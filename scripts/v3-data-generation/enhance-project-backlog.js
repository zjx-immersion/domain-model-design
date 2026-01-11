const fs = require('fs');
const path = require('path');

console.log('🚀 开始增强Project Backlog数据...\n');

// 读取数据文件
const dataDir = path.join(__dirname, '../../biz-data/mock');

const projectBacklogs = JSON.parse(fs.readFileSync(path.join(dataDir, 'backlog/project-backlogs.json'), 'utf8'));
const workItems = JSON.parse(fs.readFileSync(path.join(dataDir, 'work-items.json'), 'utf8'));
const urs = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/user-requirements.json'), 'utf8'));
const frs = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/feature-requirements.json'), 'utf8'));
const mrs = JSON.parse(fs.readFileSync(path.join(dataDir, 'requirement/module-requirements.json'), 'utf8'));
const features = JSON.parse(fs.readFileSync(path.join(dataDir, 'feature/features.json'), 'utf8'));
const modules = JSON.parse(fs.readFileSync(path.join(dataDir, 'asset/modules.json'), 'utf8'));
const productLines = JSON.parse(fs.readFileSync(path.join(dataDir, 'asset/product-lines.json'), 'utf8'));
const teams = JSON.parse(fs.readFileSync(path.join(dataDir, 'teams.json'), 'utf8'));

// 创建映射表 - 从产品线提取产品
const productMap = {};
productLines.forEach(pl => {
  if (pl.products) {
    pl.products.forEach(p => {
      productMap[p.id] = p.name;
    });
  }
});

const featureMap = Object.fromEntries(features.map(f => [f.id, f.name]));
const moduleMap = Object.fromEntries(modules.map(m => [m.id, m.name]));
const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]));

console.log(`📋 数据加载完成:`);
console.log(`  - WorkItem: ${workItems.length}条`);
console.log(`  - UR: ${urs.length}条`);
console.log(`  - FR: ${frs.length}条`);
console.log(`  - MR: ${mrs.length}条`);
console.log(`  - Feature: ${features.length}条`);
console.log(`  - Module: ${modules.length}条`);
console.log(`  - Product: ${Object.keys(productMap).length}个`);
console.log(`  - Team: ${teams.length}个`);

// 增强每个Project Backlog
projectBacklogs.data.forEach((pb, index) => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`处理 [${index + 1}/${projectBacklogs.data.length}] ${pb.name}...`);
  
  // 1. 从WorkItem提取MR
  const pbWorkItems = workItems.filter(wi => pb.workItemIds.includes(wi.id));
  const mrWorkItems = pbWorkItems.filter(wi => wi.type === 'module_requirement');
  
  // 如果WorkItem没有relatedRequirementId，我们根据type和id推断
  pb.mrIds = mrWorkItems.map(wi => {
    if (wi.relatedRequirementId) return wi.relatedRequirementId;
    // 尝试从WorkItem ID推断MR ID
    // 假设 WI-001 对应 MR-001
    const potentialMRId = wi.id.replace('WI-', 'MR-');
    return mrs.find(mr => mr.id === potentialMRId) ? potentialMRId : null;
  }).filter(Boolean);
  
  console.log(`  ✓ 提取MR: ${pb.mrIds.length}个`);
  
  // 2. 从MR提取FR
  const pbMRs = mrs.filter(mr => pb.mrIds.includes(mr.id));
  pb.frIds = [...new Set(pbMRs.map(mr => mr.parentFRId).filter(Boolean))];
  console.log(`  ✓ 提取FR: ${pb.frIds.length}个`);
  
  // 3. 从FR提取UR
  const pbFRs = frs.filter(fr => pb.frIds.includes(fr.id));
  pb.urIds = [...new Set(pbFRs.map(fr => fr.parentURId).filter(Boolean))];
  console.log(`  ✓ 提取UR: ${pb.urIds.length}个`);
  
  // 4. 从MR提取Module
  pb.moduleIds = [...new Set(pbMRs.map(mr => mr.moduleId).filter(Boolean))];
  console.log(`  ✓ 提取Module: ${pb.moduleIds.length}个`);
  
  // 5. 从FR提取Feature
  pb.featureIds = [...new Set(pbFRs.map(fr => fr.relatedFeatureAssetId).filter(Boolean))];
  console.log(`  ✓ 提取Feature: ${pb.featureIds.length}个`);
  
  // 6. 构建需求视图
  const pbURs = urs.filter(ur => pb.urIds.includes(ur.id));
  
  pb.requirements = {
    urs: pbURs.map(ur => ({
      id: ur.id,
      title: ur.title,
      status: ur.status,
      priority: ur.priority,
      productId: ur.productId,
      productName: productMap[ur.productId] || ur.productId || 'Unknown'
    })),
    frs: pbFRs.map(fr => ({
      id: fr.id,
      title: fr.title,
      parentURId: fr.parentURId,
      status: fr.status,
      priority: fr.priority,
      relatedFeatureAssetId: fr.relatedFeatureAssetId,
      featureName: fr.relatedFeatureAssetId ? (featureMap[fr.relatedFeatureAssetId] || 'Unknown') : undefined
    })),
    mrs: pbMRs.map(mr => ({
      id: mr.id,
      title: mr.title,
      parentFRId: mr.parentFRId,
      status: mr.status,
      priority: mr.priority,
      moduleId: mr.moduleId,
      moduleName: moduleMap[mr.moduleId] || 'Unknown',
      assignedTeamId: mr.assignedTeamId,
      teamName: teamMap[mr.assignedTeamId] || 'Unknown',
      storyPoints: mr.storyPoints || 0
    }))
  };
  console.log(`  ✓ 构建需求视图: UR=${pb.requirements.urs.length}, FR=${pb.requirements.frs.length}, MR=${pb.requirements.mrs.length}`);
  
  // 7. 优先级队列
  pb.priorityQueue = {
    p0: pbMRs.filter(mr => mr.priority === 'P0').map(mr => mr.id),
    p1: pbMRs.filter(mr => mr.priority === 'P1').map(mr => mr.id),
    p2: pbMRs.filter(mr => mr.priority === 'P2').map(mr => mr.id)
  };
  console.log(`  ✓ 优先级队列: P0=${pb.priorityQueue.p0.length}, P1=${pb.priorityQueue.p1.length}, P2=${pb.priorityQueue.p2.length}`);
  
  // 8. 统计信息
  const completedMRs = pbMRs.filter(mr => mr.status === 'done' || mr.status === 'closed');
  pb.statistics = {
    totalRequirements: pb.urIds.length + pb.frIds.length + pb.mrIds.length,
    urCount: pb.urIds.length,
    frCount: pb.frIds.length,
    mrCount: pb.mrIds.length,
    featureCount: pb.featureIds.length,
    moduleCount: pb.moduleIds.length,
    requirementCompleteness: pbMRs.length > 0 ? Math.round((completedMRs.length / pbMRs.length) * 100) : 0
  };
  console.log(`  ✓ 统计: 总需求=${pb.statistics.totalRequirements}, 完成度=${pb.statistics.requirementCompleteness}%`);
});

// 更新metadata
projectBacklogs.metadata.lastUpdate = new Date().toISOString();
projectBacklogs.metadata.version = "3.0";
projectBacklogs.metadata.description = "项目待办（PI Backlog）Mock数据 - V3增强版，包含完整的需求-资产关联";

// 保存增强后的数据
const outputPath = path.join(dataDir, 'backlog/project-backlogs.json');
fs.writeFileSync(outputPath, JSON.stringify(projectBacklogs, null, 2), 'utf8');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Project Backlog数据增强完成！');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log(`📊 总体统计:`);
console.log(`  - Project Backlog数量: ${projectBacklogs.data.length}`);
projectBacklogs.data.forEach((pb, idx) => {
  console.log(`\n  [${idx + 1}] ${pb.name}:`);
  console.log(`      ├─ UR: ${pb.urIds?.length || 0}个`);
  console.log(`      ├─ FR: ${pb.frIds?.length || 0}个`);
  console.log(`      ├─ MR: ${pb.mrIds?.length || 0}个`);
  console.log(`      ├─ Feature: ${pb.featureIds?.length || 0}个`);
  console.log(`      ├─ Module: ${pb.moduleIds?.length || 0}个`);
  console.log(`      └─ 完成度: ${pb.statistics?.requirementCompleteness || 0}%`);
});

console.log('\n✅ 数据已保存到:', outputPath);
console.log('\n🎉 D1.1任务完成！');
