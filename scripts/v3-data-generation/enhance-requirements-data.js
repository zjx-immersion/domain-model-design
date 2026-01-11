#!/usr/bin/env node

/**
 * 增强需求数据 - 添加缺失字段和状态同步
 * 
 * 功能：
 * 1. 为FR/MR添加code字段（编号显示）
 * 2. 补充详细内容字段
 * 3. 从Backlog/Sprint同步状态
 */

const fs = require('fs');
const path = require('path');

// 文件路径
const DATA_DIR = path.join(__dirname, '../../biz-data/mock');
const FR_FILE = path.join(DATA_DIR, 'requirement/feature-requirements.json');
const MR_FILE = path.join(DATA_DIR, 'requirement/module-requirements.json');
const UR_FILE = path.join(DATA_DIR, 'requirement/user-requirements.json');
const BACKLOG_PROJECT_FILE = path.join(DATA_DIR, 'backlog/project-backlogs.json');
const BACKLOG_TEAM_FILE = path.join(DATA_DIR, 'backlog/team-backlogs.json');

// 读取JSON文件
function readJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  return Array.isArray(data) ? data : (data.data || []);
}

// 写入JSON文件
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// 状态映射
const STATUS_MAP = {
  'planned': 'planned',
  'in_progress': 'in_development',
  'in_development': 'in_development',
  'in_review': 'in_review',
  'completed': 'completed',
  'done': 'completed'
};

// 增强Feature Requirements
function enhanceFRs() {
  console.log('📝 增强Feature Requirements数据...');
  
  const frs = readJSON(FR_FILE);
  const urs = readJSON(UR_FILE);
  const projectBacklogs = readJSON(BACKLOG_PROJECT_FILE);
  
  // 从Backlog获取FR状态
  const frStatusMap = {};
  projectBacklogs.forEach(backlog => {
    if (backlog.requirements && backlog.requirements.frs) {
      backlog.requirements.frs.forEach(fr => {
        frStatusMap[fr.id] = fr.status || 'planned';
      });
    }
  });
  
  // 创建UR映射
  const urMap = {};
  urs.forEach(ur => {
    urMap[ur.id] = ur;
  });
  
  let frCounter = 1;
  const enhancedFRs = frs.map(fr => {
    // 生成code（如果没有）
    const code = fr.code || `FR-${String(frCounter++).padStart(3, '0')}`;
    
    // 获取关联的UR信息
    const parentUR = urMap[fr.parentUserRequirementId];
    const userRequirementTitle = parentUR ? parentUR.title : '';
    
    // 获取状态（优先从Backlog，否则使用默认）
    const status = STATUS_MAP[frStatusMap[fr.id]] || fr.status || 'planned';
    
    // 增强详细内容
    const detailedDescription = fr.detailedDescription || `${fr.description}\n\n性能要求：\n- 延迟：${fr.performanceRequirements?.latency || 'N/A'}\n- 准确率：${fr.performanceRequirements?.accuracy || 'N/A'}\n- 可靠性：${fr.performanceRequirements?.reliability || 'N/A'}`;
    
    return {
      ...fr,
      code,
      status,
      userRequirementTitle,
      detailedDescription,
      // 补充其他可能缺失的字段
      priority: (fr.priority || 'p0').toUpperCase(),
      progress: calculateProgress(status),
      estimatedHours: fr.estimatedHours || 40,
      actualHours: fr.actualHours || 0,
      owner: fr.owner || '待分配',
      createdAt: fr.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  
  writeJSON(FR_FILE, enhancedFRs);
  console.log(`✅ 增强了 ${enhancedFRs.length} 条Feature Requirements`);
}

// 增强Module Requirements
function enhanceMRs() {
  console.log('📝 增强Module Requirements数据...');
  
  const mrs = readJSON(MR_FILE);
  const frs = readJSON(FR_FILE);
  const teamBacklogs = readJSON(BACKLOG_TEAM_FILE);
  
  // 从Team Backlog获取MR状态
  const mrStatusMap = {};
  teamBacklogs.forEach(backlog => {
    if (backlog.mrsDetails) {
      backlog.mrsDetails.forEach(mr => {
        mrStatusMap[mr.id] = mr.status || 'planned';
      });
    }
  });
  
  // 创建FR映射
  const frMap = {};
  frs.forEach(fr => {
    frMap[fr.id] = fr;
  });
  
  let mrCounter = 1;
  const enhancedMRs = mrs.map(mr => {
    // 生成code（如果没有）
    const code = mr.code || `MR-${String(mrCounter++).padStart(3, '0')}`;
    
    // 获取关联的FR信息
    const parentFR = frMap[mr.parentFRId];
    const featureRequirementTitle = parentFR ? parentFR.title : '';
    
    // 获取状态（优先从Team Backlog，否则使用默认）
    const status = STATUS_MAP[mrStatusMap[mr.id]] || mr.status || 'planned';
    
    // 增强详细内容
    const detailedDescription = mr.detailedDescription || `${mr.description || mr.title}\n\n实现要点：\n- 模块：${mr.moduleId || 'N/A'}\n- 复杂度：${mr.complexity || 'medium'}\n- 工时估算：${mr.storyPoints || 5} SP`;
    
    // 获取模块名称
    const moduleName = mr.moduleName || extractModuleName(mr.moduleId);
    
    return {
      ...mr,
      code,
      status,
      featureRequirementTitle,
      detailedDescription,
      moduleName,
      // 补充其他可能缺失的字段
      priority: (mr.priority || 'p0').toUpperCase(),
      progress: calculateProgress(status),
      storyPoints: mr.storyPoints || 5,
      estimatedHours: mr.estimatedHours || (mr.storyPoints || 5) * 8,
      actualHours: mr.actualHours || 0,
      assignedTeamId: mr.assignedTeamId || 'TEAM-001',
      assignee: mr.assignee || '待分配',
      sprintId: mr.sprintId || null,
      createdAt: mr.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  
  writeJSON(MR_FILE, enhancedMRs);
  console.log(`✅ 增强了 ${enhancedMRs.length} 条Module Requirements`);
}

// 计算进度
function calculateProgress(status) {
  const progressMap = {
    'planned': 0,
    'in_development': 0.5,
    'in_review': 0.8,
    'completed': 1.0
  };
  return progressMap[status] || 0;
}

// 提取模块名称
function extractModuleName(moduleId) {
  if (!moduleId) return 'N/A';
  
  const nameMap = {
    'MOD-PARK-PER': '车位感知',
    'MOD-PARK-PLAN': '路径规划',
    'MOD-PARK-CTRL': '车辆控制',
    'MOD-HWY-PER': '高速感知',
    'MOD-HWY-PLAN': '高速规划',
    'MOD-HWY-CTRL': '高速控制',
    'MOD-CRUISE-PER': '巡航感知',
    'MOD-CRUISE-PLAN': '巡航规划',
    'MOD-SAFETY-MON': '安全监控',
    'MOD-SAFETY-WARN': '安全预警',
  };
  
  for (const [prefix, name] of Object.entries(nameMap)) {
    if (moduleId.startsWith(prefix)) {
      return name;
    }
  }
  
  return moduleId;
}

// 主函数
function main() {
  console.log('🚀 开始增强需求数据...\n');
  
  try {
    enhanceFRs();
    console.log('');
    enhanceMRs();
    console.log('');
    console.log('✅ 需求数据增强完成！');
  } catch (error) {
    console.error('❌ 增强失败:', error.message);
    process.exit(1);
  }
}

main();

