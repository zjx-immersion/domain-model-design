const fs = require('fs');
const path = require('path');

console.log('🚀 开始Phase 1数据完善...\n');

const dataDir = path.join(__dirname, '../../biz-data/mock');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Task D1.1 & D1.2: 增强Backlog数据
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('📋 Task D1.1: 增强Project Backlog数据...');

const projectBacklogs = JSON.parse(fs.readFileSync(path.join(dataDir, 'backlog/project-backlogs.json'), 'utf8'));
const teamBacklogs = JSON.parse(fs.readFileSync(path.join(dataDir, 'backlog/team-backlogs.json'), 'utf8'));
const mrs = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/module-requirements.json'), 'utf8'));
const frs = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/feature-requirements.json'), 'utf8'));
const urs = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/user-requirements.json'), 'utf8'));

// 增强Project Backlog
projectBacklogs.data.forEach(pb => {
  // 基于现有workItems推断MR
  const mrCount = (pb.workItemsByType?.module_requirement || []).length;
  pb.mrIds = pb.workItemsByType?.module_requirement || [];
  
  // 推断FR和UR（基于MR数量的合理估算）
  pb.frIds = mrCount > 0 ? [`FR-00${pb.piPlanningId?.slice(-1) || '1'}`] : [];
  pb.urIds = mrCount > 0 ? [`UR-00${pb.piPlanningId?.slice(-1) || '1'}`] : [];
  
  // 资产关联（基于已有Module信息）
  pb.featureIds = [];
  pb.moduleIds = [];
  
  // 需求视图（简化版）
  pb.requirements = {
    urs: [],
    frs: [],
    mrs: pb.mrIds.map(mrId => ({
      id: mrId,
      title: `模块需求 ${mrId}`,
      status: 'todo',
      priority: 'P1'
    }))
  };
  
  // 优先级队列
  pb.priorityQueue = {
    p0: [],
    p1: pb.mrIds,
    p2: []
  };
  
  // 统计信息
  pb.statistics = {
    totalRequirements: pb.urIds.length + pb.frIds.length + pb.mrIds.length,
    urCount: pb.urIds.length,
    frCount: pb.frIds.length,
    mrCount: pb.mrIds.length,
    featureCount: 0,
    moduleCount: 0,
    requirementCompleteness: pb.progress || 0
  };
  
  console.log(`  ✓ ${pb.name}: MR=${pb.mrIds.length}, FR=${pb.frIds.length}, UR=${pb.urIds.length}`);
});

// 更新metadata
projectBacklogs.metadata.version = "3.0";
projectBacklogs.metadata.lastUpdate = new Date().toISOString();

fs.writeFileSync(
  path.join(dataDir, 'backlog/project-backlogs.json'),
  JSON.stringify(projectBacklogs, null, 2)
);

console.log('✅ Project Backlog数据增强完成！\n');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('📋 Task D1.2: 增强Team Backlog数据...');

teamBacklogs.data.forEach(tb => {
  // MR列表
  tb.mrIds = tb.workItemIds || [];
  
  // 按Sprint分组的MR
  tb.mrsBySprint = tb.workItemsBySprint || {};
  
  // 按Module分组（简化）
  tb.mrsByModule = {};
  
  // 按状态分组的MR
  tb.mrsByStatus = tb.workItemsByStatus || {
    ready: [],
    in_progress: [],
    in_review: [],
    done: []
  };
  
  // MR详细信息（简化版）
  tb.mrsDetails = tb.mrIds.map(mrId => ({
    id: mrId,
    title: `模块需求 ${mrId}`,
    status: 'todo',
    priority: 'P1',
    storyPoints: 5
  }));
  
  // MR统计
  const doneMRs = (tb.workItemsByStatus?.done || []).length;
  tb.mrStatistics = {
    totalMRs: tb.mrIds.length,
    readyMRs: (tb.workItemsByStatus?.todo || []).length,
    inProgressMRs: (tb.workItemsByStatus?.in_progress || []).length,
    inReviewMRs: 0,
    doneMRs: doneMRs,
    totalMRStoryPoints: tb.totalStoryPoints || 0,
    completedMRStoryPoints: tb.completedStoryPoints || 0,
    mrCompletionRate: tb.mrIds.length > 0 ? Math.round((doneMRs / tb.mrIds.length) * 100) : 0
  };
  
  console.log(`  ✓ ${tb.name}: MR=${tb.mrIds.length}, 完成率=${tb.mrStatistics.mrCompletionRate}%`);
});

// 更新metadata
teamBacklogs.metadata.version = "3.0";
teamBacklogs.metadata.lastUpdate = new Date().toISOString();

fs.writeFileSync(
  path.join(dataDir, 'backlog/team-backlogs.json'),
  JSON.stringify(teamBacklogs, null, 2)
);

console.log('✅ Team Backlog数据增强完成！\n');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Task D1.3: 补充需求-资产关联
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('📋 Task D1.3: 补充需求-资产关联数据...');

// 读取需求数据
const ursData = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/user-requirements.json'), 'utf8'));
const frsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/feature-requirements.json'), 'utf8'));
const mrsData = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/module-requirements.json'), 'utf8'));

let urUpdated = 0, frUpdated = 0, mrUpdated = 0;

// 确保UR有productId
ursData.forEach((ur, idx) => {
  if (!ur.productId) {
    ur.productId = `PROD-00${(idx % 3) + 1}`;
    urUpdated++;
  }
});

// 确保FR有parentURId和relatedFeatureAssetId
frsData.forEach((fr, idx) => {
  if (!fr.parentURId && ursData.length > 0) {
    fr.parentURId = ursData[idx % ursData.length].id;
    frUpdated++;
  }
  if (!fr.relatedFeatureAssetId) {
    fr.relatedFeatureAssetId = `FTR-ADAS-00${(idx % 5) + 1}`;
  }
});

// 确保MR有parentFRId, moduleId, assignedTeamId
mrsData.forEach((mr, idx) => {
  if (!mr.parentFRId && frsData.length > 0) {
    mr.parentFRId = frsData[idx % frsData.length].id;
    mrUpdated++;
  }
  if (!mr.moduleId) {
    mr.moduleId = `MOD-ADAS-PERCEPTION-00${(idx % 3) + 1}`;
  }
  if (!mr.assignedTeamId) {
    mr.assignedTeamId = `TEAM-00${(idx % 4) + 1}`;
  }
});

// 保存更新
fs.writeFileSync(path.join(dataDir, 'requirement/user-requirements.json'), JSON.stringify(ursData, null, 2));
fs.writeFileSync(path.join(dataDir, 'requirement/feature-requirements.json'), JSON.stringify(frsData, null, 2));
fs.writeFileSync(path.join(dataDir, 'requirement/module-requirements.json'), JSON.stringify(mrsData, null, 2));

console.log(`  ✓ UR补充: ${urUpdated}条`);
console.log(`  ✓ FR补充: ${frUpdated}条`);
console.log(`  ✓ MR补充: ${mrUpdated}条`);
console.log('✅ 需求-资产关联数据补充完成！\n');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Task D1.4: 优化追溯数据
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('📋 Task D1.4: 优化追溯数据...');

const traceabilityData = {
  metadata: {
    version: "3.0",
    lastUpdate: new Date().toISOString(),
    description: "需求追溯数据 - V3增强版"
  },
  forwardTraces: [],
  backwardTraces: [],
  completeness: {
    totalURs: ursData.length,
    tracedURs: ursData.length,
    urCoverage: 100,
    totalFRs: frsData.length,
    tracedFRs: frsData.length,
    frCoverage: 100,
    totalMRs: mrsData.length,
    tracedMRs: mrsData.length,
    mrCoverage: 100,
    totalTasks: 0,
    tracedTasks: 0,
    taskCoverage: 0,
    totalCommits: 0,
    tracedCommits: 0,
    commitCoverage: 0,
    overallCompleteness: 60
  }
};

// 构建基础追溯链路
ursData.forEach(ur => {
  const relatedFRs = frsData.filter(fr => fr.parentURId === ur.id);
  
  traceabilityData.forwardTraces.push({
    urId: ur.id,
    urTitle: ur.title,
    frs: relatedFRs.map(fr => {
      const relatedMRs = mrsData.filter(mr => mr.parentFRId === fr.id);
      return {
        frId: fr.id,
        frTitle: fr.title,
        relatedFeatureAssetId: fr.relatedFeatureAssetId,
        mrs: relatedMRs.map(mr => ({
          mrId: mr.id,
          mrTitle: mr.title,
          relatedModuleId: mr.moduleId,
          tasks: []
        }))
      };
    })
  });
});

fs.writeFileSync(
  path.join(dataDir, 'requirement/traceability.json'),
  JSON.stringify(traceabilityData, null, 2)
);

console.log(`  ✓ 正向追溯链路: ${traceabilityData.forwardTraces.length}条`);
console.log(`  ✓ 追溯完整度: ${traceabilityData.completeness.overallCompleteness}%`);
console.log('✅ 追溯数据优化完成！\n');

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 总结
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🎉 Phase 1数据完善全部完成！');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📊 完成情况:');
console.log('  ✅ D1.1: Project Backlog数据增强');
console.log('  ✅ D1.2: Team Backlog数据增强');
console.log('  ✅ D1.3: 需求-资产关联补充');
console.log('  ✅ D1.4: 追溯数据优化');

console.log('\n📁 更新的文件:');
console.log('  - backlog/project-backlogs.json');
console.log('  - backlog/team-backlogs.json');
console.log('  - requirement/user-requirements.json');
console.log('  - requirement/feature-requirements.json');
console.log('  - requirement/module-requirements.json');
console.log('  - requirement/traceability.json');

console.log('\n✨ Phase 1数据完善任务完成！');
