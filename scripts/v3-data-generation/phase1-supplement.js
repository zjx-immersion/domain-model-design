#!/usr/bin/env node

/**
 * Phase 1数据补充脚本
 * 
 * 补充内容：
 * 1. WorkItem与MR的双向关联
 * 2. Product版本数据
 * 3. Feature BOM与Product版本关联
 * 4. 制品晋级数据
 * 5. 更多测试场景数据
 */

const fs = require('fs');
const path = require('path');

// 数据路径
const DATA_ROOT = path.join(__dirname, '../../biz-data/mock');

// 读取JSON文件
function readJSON(filePath) {
  const fullPath = path.join(DATA_ROOT, filePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

// 写入JSON文件
function writeJSON(filePath, data) {
  const fullPath = path.join(DATA_ROOT, filePath);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf8');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Phase 1 数据补充开始');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// ============================================================================
// Task S1.1: WorkItem与MR的双向关联
// ============================================================================
console.log('🔄 Task S1.1: 补充WorkItem与MR的双向关联...');

const workItems = readJSON('work-items.json');
const moduleRequirements = readJSON('requirement/module-requirements.json');

// 确保数据结构正确
const workItemsData = workItems.data || workItems;
const mrData = moduleRequirements.data || moduleRequirements;

// 为每个MR补充workItemIds
mrData.forEach(mr => {
  mr.workItemIds = mr.workItemIds || [];
  
  // 查找关联的WorkItem
  const relatedWorkItems = workItemsData.filter(wi => 
    wi.requirementId === mr.id || wi.sourceId === mr.id
  );
  
  mr.workItemIds = relatedWorkItems.map(wi => wi.id);
  mr.workItemCount = mr.workItemIds.length;
});

// 为每个WorkItem确保有MR关联
workItemsData.forEach(wi => {
  if (wi.type === 'module_requirement' && wi.requirementId) {
    const mr = mrData.find(m => m.id === wi.requirementId);
    if (mr && !wi.parentMRId) {
      wi.parentMRId = mr.id;
      wi.parentMRName = mr.title || mr.name;
    }
  }
});

// 写回数据，保持原有结构
if (moduleRequirements.data) {
  writeJSON('requirement/module-requirements.json', moduleRequirements);
} else {
  writeJSON('requirement/module-requirements.json', mrData);
}

if (workItems.data) {
  writeJSON('work-items.json', workItems);
} else {
  writeJSON('work-items.json', workItemsData);
}

console.log(`✅ MR关联WorkItem: ${mrData.filter(mr => mr.workItemIds && mr.workItemIds.length > 0).length}/${mrData.length}`);
console.log(`✅ WorkItem关联MR: ${workItemsData.filter(wi => wi.parentMRId).length}/${workItemsData.length}\n`);

// ============================================================================
// Task S1.2: Product版本数据
// ============================================================================
console.log('🔄 Task S1.2: 生成Product版本数据...');

const productLines = readJSON('asset/product-lines.json');

const productVersions = {
  metadata: {
    version: '3.0',
    lastUpdate: new Date().toISOString(),
    description: 'Product版本数据 - 支持产品版本规划和Feature BOM关联'
  },
  data: []
};

// 为每个产品线的产品生成版本
productLines.data.forEach(productLine => {
  productLine.products.forEach(product => {
    // 生成3个版本：旗舰版、高配版、标准版
    const versions = [
      {
        id: `${product.id}-V1`,
        productId: product.id,
        productName: product.name,
        productLineId: productLine.id,
        productLineName: productLine.name,
        versionName: '旗舰版',
        versionCode: 'V1.0-Premium',
        versionType: 'flagship',
        status: 'released',
        releaseDate: '2024-06-15',
        targetMarket: '高端市场',
        salesPrice: 350000,
        targetVolume: 50000,
        description: `${product.name}旗舰版 - 全配置版本`,
        features: {
          total: 25,
          core: 15,
          optional: 10
        },
        featureBOMId: `FB-${product.id}-Premium`,
        platforms: ['PLT-001', 'PLT-002', 'PLT-005'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-10T15:30:00Z'
      },
      {
        id: `${product.id}-V2`,
        productId: product.id,
        productName: product.name,
        productLineId: productLine.id,
        productLineName: productLine.name,
        versionName: '高配版',
        versionCode: 'V1.0-Advanced',
        versionType: 'advanced',
        status: 'released',
        releaseDate: '2024-06-15',
        targetMarket: '中高端市场',
        salesPrice: 280000,
        targetVolume: 120000,
        description: `${product.name}高配版 - 高级配置版本`,
        features: {
          total: 20,
          core: 15,
          optional: 5
        },
        featureBOMId: `FB-${product.id}-Advanced`,
        platforms: ['PLT-001', 'PLT-002'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-10T15:30:00Z'
      },
      {
        id: `${product.id}-V3`,
        productId: product.id,
        productName: product.name,
        productLineId: productLine.id,
        productLineName: productLine.name,
        versionName: '标准版',
        versionCode: 'V1.0-Standard',
        versionType: 'standard',
        status: 'released',
        releaseDate: '2024-06-15',
        targetMarket: '大众市场',
        salesPrice: 220000,
        targetVolume: 200000,
        description: `${product.name}标准版 - 标准配置版本`,
        features: {
          total: 15,
          core: 15,
          optional: 0
        },
        featureBOMId: `FB-${product.id}-Standard`,
        platforms: ['PLT-001'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-06-10T15:30:00Z'
      }
    ];
    
    productVersions.data.push(...versions);
  });
});

// 为每个产品线添加2026年规划版本
productLines.data.forEach(productLine => {
  productLine.products.forEach(product => {
    const planningVersion = {
      id: `${product.id}-V2026`,
      productId: product.id,
      productName: product.name,
      productLineId: productLine.id,
      productLineName: productLine.name,
      versionName: '2026款',
      versionCode: 'V2.0',
      versionType: 'next_gen',
      status: 'planning',
      releaseDate: '2026-06-01',
      targetMarket: '全市场',
      salesPrice: 300000,
      targetVolume: 150000,
      description: `${product.name} 2026年改款 - 增强智能化配置`,
      features: {
        total: 28,
        core: 18,
        optional: 10
      },
      featureBOMId: `FB-${product.id}-2026`,
      platforms: ['PLT-001', 'PLT-002', 'PLT-005', 'PLT-009'],
      createdAt: '2025-01-10T10:00:00Z',
      updatedAt: '2025-01-10T10:00:00Z'
    };
    
    productVersions.data.push(planningVersion);
  });
});

writeJSON('asset/product-versions.json', productVersions);

console.log(`✅ Product版本数据: ${productVersions.data.length}条`);
console.log(`   - 已发布版本: ${productVersions.data.filter(v => v.status === 'released').length}条`);
console.log(`   - 规划中版本: ${productVersions.data.filter(v => v.status === 'planning').length}条\n`);

// ============================================================================
// Task S1.3: 制品晋级数据
// ============================================================================
console.log('🔄 Task S1.3: 生成制品晋级数据...');

const features = readJSON('feature/features.json');
const modules = readJSON('asset/modules.json');

// 确保数据结构正确
const featuresData = features.data || features;
const modulesData = modules.data || modules;

const artifactPromotions = {
  metadata: {
    version: '3.0',
    lastUpdate: new Date().toISOString(),
    description: '制品晋级数据 - 记录Feature和Module的环境晋级历史'
  },
  data: []
};

// 为每个Feature生成晋级记录
featuresData.slice(0, 10).forEach((feature, index) => {
  const promotion = {
    id: `AP-F-${String(index + 1).padStart(3, '0')}`,
    artifactType: 'feature',
    artifactId: feature.id,
    artifactName: feature.name,
    artifactVersion: feature.currentVersion,
    promotionPath: [
      {
        environment: 'dev',
        status: 'passed',
        promotedAt: '2024-12-01T10:00:00Z',
        promotedBy: 'DevOps-001',
        buildId: 'BUILD-F-001',
        testResults: {
          unitTest: { passed: 120, failed: 0, coverage: 85 },
          integrationTest: { passed: 45, failed: 0 }
        }
      },
      {
        environment: 'test',
        status: 'passed',
        promotedAt: '2024-12-05T14:00:00Z',
        promotedBy: 'DevOps-001',
        buildId: 'BUILD-F-001',
        testResults: {
          systemTest: { passed: 80, failed: 0 },
          performanceTest: { passed: true, metrics: { latency: '50ms', throughput: '1000tps' } }
        }
      },
      {
        environment: 'uat',
        status: 'passed',
        promotedAt: '2024-12-10T16:00:00Z',
        promotedBy: 'DevOps-002',
        buildId: 'BUILD-F-001',
        testResults: {
          acceptanceTest: { passed: 30, failed: 0 },
          securityTest: { passed: true, vulnerabilities: 0 }
        }
      },
      {
        environment: 'prod',
        status: 'deployed',
        promotedAt: '2024-12-15T10:00:00Z',
        promotedBy: 'DevOps-Manager',
        buildId: 'BUILD-F-001',
        releaseNotes: `${feature.name} v${feature.currentVersion} 正式发布`
      }
    ],
    qualityGates: {
      codeReview: { status: 'passed', reviewers: 2, approvedAt: '2024-11-28T15:00:00Z' },
      unitTest: { status: 'passed', coverage: 85, threshold: 80 },
      integrationTest: { status: 'passed', passRate: 100, threshold: 95 },
      securityScan: { status: 'passed', vulnerabilities: 0, threshold: 0 },
      performanceTest: { status: 'passed', latency: 50, threshold: 100 }
    },
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z'
  };
  
  artifactPromotions.data.push(promotion);
});

// 为每个Module生成晋级记录
modulesData.slice(0, 10).forEach((module, index) => {
  const promotion = {
    id: `AP-M-${String(index + 1).padStart(3, '0')}`,
    artifactType: 'module',
    artifactId: module.id,
    artifactName: module.name,
    artifactVersion: module.currentVersion,
    promotionPath: [
      {
        environment: 'dev',
        status: 'passed',
        promotedAt: '2024-12-03T10:00:00Z',
        promotedBy: 'DevOps-001',
        buildId: `BUILD-M-${String(index + 1).padStart(3, '0')}`,
        testResults: {
          unitTest: { passed: 80, failed: 0, coverage: 82 },
          integrationTest: { passed: 30, failed: 0 }
        }
      },
      {
        environment: 'test',
        status: 'in_progress',
        promotedAt: '2024-12-07T14:00:00Z',
        promotedBy: 'DevOps-001',
        buildId: `BUILD-M-${String(index + 1).padStart(3, '0')}`,
        testResults: {
          systemTest: { passed: 25, failed: 2, inProgress: 8 }
        }
      }
    ],
    qualityGates: {
      codeReview: { status: 'passed', reviewers: 2, approvedAt: '2024-12-01T15:00:00Z' },
      unitTest: { status: 'passed', coverage: 82, threshold: 80 },
      integrationTest: { status: 'passed', passRate: 100, threshold: 95 },
      securityScan: { status: 'passed', vulnerabilities: 0, threshold: 0 }
    },
    createdAt: '2024-12-03T10:00:00Z',
    updatedAt: '2024-12-07T14:00:00Z'
  };
  
  artifactPromotions.data.push(promotion);
});

writeJSON('devops/artifact-promotions.json', artifactPromotions);

console.log(`✅ 制品晋级记录: ${artifactPromotions.data.length}条`);
console.log(`   - Feature晋级: ${artifactPromotions.data.filter(ap => ap.artifactType === 'feature').length}条`);
console.log(`   - Module晋级: ${artifactPromotions.data.filter(ap => ap.artifactType === 'module').length}条\n`);

// ============================================================================
// Task S1.4: 补充测试场景数据
// ============================================================================
console.log('🔄 Task S1.4: 补充测试场景数据...');

const testScenarios = {
  metadata: {
    version: '3.0',
    lastUpdate: new Date().toISOString(),
    description: '测试场景数据 - 支持端到端业务场景验证'
  },
  data: [
    {
      id: 'TS-001',
      name: 'UR分解为FR和MR完整流程',
      description: '验证从用户需求分解为特性需求和模块需求的完整流程',
      type: 'requirement_decomposition',
      priority: 'P0',
      status: 'passed',
      steps: [
        { step: 1, action: '创建UR', expected: 'UR成功创建', actual: 'UR-001创建成功', status: 'passed' },
        { step: 2, action: '分解FR', expected: 'FR关联UR和Feature', actual: 'FR-001关联UR-001和FEA-001', status: 'passed' },
        { step: 3, action: '分解MR', expected: 'MR关联FR和Module', actual: 'MR-001关联FR-001和MOD-004', status: 'passed' },
        { step: 4, action: '查看追溯链路', expected: 'UR→FR→MR链路完整', actual: '追溯链路完整', status: 'passed' }
      ],
      involvedEntities: {
        ur: ['UR-001'],
        fr: ['FR-001'],
        mr: ['MR-001', 'MR-002'],
        feature: ['FEA-001'],
        module: ['MOD-004']
      },
      executedBy: 'QA-001',
      executedAt: '2025-01-10T10:00:00Z'
    },
    {
      id: 'TS-002',
      name: 'PI Planning创建Project Backlog',
      description: '验证PI Planning过程中创建Project Backlog的流程',
      type: 'pi_planning',
      priority: 'P0',
      status: 'passed',
      steps: [
        { step: 1, action: '创建PI Planning', expected: 'PI Planning成功创建', actual: 'PI-2025-Q1创建成功', status: 'passed' },
        { step: 2, action: '分配UR到PI', expected: 'UR成功分配', actual: '1个UR分配成功', status: 'passed' },
        { step: 3, action: '创建Project Backlog', expected: 'Project Backlog包含MR', actual: 'backlog-PB-001包含5个MR', status: 'passed' },
        { step: 4, action: '查看统计信息', expected: '统计信息正确', actual: 'UR:1, FR:1, MR:5', status: 'passed' }
      ],
      involvedEntities: {
        piPlanning: ['PI-2025-Q1'],
        projectBacklog: ['backlog-PB-001'],
        ur: ['UR-001'],
        fr: ['FR-001'],
        mr: ['MR-001', 'MR-002', 'MR-003', 'MR-004', 'MR-005']
      },
      executedBy: 'QA-002',
      executedAt: '2025-01-10T11:00:00Z'
    },
    {
      id: 'TS-003',
      name: 'MR分配到Team Backlog',
      description: '验证模块需求分配到团队待办的流程',
      type: 'team_backlog',
      priority: 'P0',
      status: 'passed',
      steps: [
        { step: 1, action: '从Project Backlog查看MR', expected: 'MR列表正确显示', actual: '5个MR显示正确', status: 'passed' },
        { step: 2, action: '分配MR到团队', expected: 'MR成功分配', actual: '5个MR分配到感知团队', status: 'passed' },
        { step: 3, action: '创建Team Backlog', expected: 'Team Backlog包含MR', actual: 'backlog-TB-001包含7个MR', status: 'passed' },
        { step: 4, action: '查看MR统计', expected: 'MR统计正确', actual: '总数:7, 已完成:3, 完成率:43%', status: 'passed' }
      ],
      involvedEntities: {
        projectBacklog: ['backlog-PB-001'],
        teamBacklog: ['backlog-TB-001'],
        team: ['TEAM-001'],
        mr: ['MR-001', 'MR-002', 'MR-003', 'MR-004', 'MR-005', 'MR-006', 'MR-007']
      },
      executedBy: 'QA-002',
      executedAt: '2025-01-10T12:00:00Z'
    },
    {
      id: 'TS-004',
      name: 'Feature资产复用',
      description: '验证Feature资产在多个产品中复用的流程',
      type: 'feature_reuse',
      priority: 'P1',
      status: 'passed',
      steps: [
        { step: 1, action: '查询可复用Feature', expected: 'Feature列表正确', actual: '20个Feature可选', status: 'passed' },
        { step: 2, action: '选择Feature', expected: 'Feature详情显示', actual: 'FEA-001详情正确', status: 'passed' },
        { step: 3, action: '添加到产品BOM', expected: 'BOM更新成功', actual: 'FEA-001添加到3个产品', status: 'passed' },
        { step: 4, action: '查看复用统计', expected: '复用次数更新', actual: '复用次数从2增加到5', status: 'passed' }
      ],
      involvedEntities: {
        feature: ['FEA-001'],
        product: ['PROD-001', 'PROD-002', 'PROD-003'],
        featureBOM: ['FB-PROD-001-Premium', 'FB-PROD-002-Advanced', 'FB-PROD-003-Standard']
      },
      executedBy: 'QA-003',
      executedAt: '2025-01-10T13:00:00Z'
    },
    {
      id: 'TS-005',
      name: '制品晋级流程',
      description: '验证Feature从dev到prod环境的晋级流程',
      type: 'artifact_promotion',
      priority: 'P1',
      status: 'passed',
      steps: [
        { step: 1, action: 'Feature在dev环境测试', expected: '测试通过', actual: '单元测试85%覆盖率', status: 'passed' },
        { step: 2, action: '晋级到test环境', expected: '晋级成功', actual: 'test环境部署成功', status: 'passed' },
        { step: 3, action: 'test环境验证', expected: '系统测试通过', actual: '80个测试用例全部通过', status: 'passed' },
        { step: 4, action: '晋级到prod环境', expected: '生产发布成功', actual: 'prod环境部署完成', status: 'passed' }
      ],
      involvedEntities: {
        feature: ['FEA-001'],
        artifactPromotion: ['AP-F-001'],
        environments: ['dev', 'test', 'uat', 'prod']
      },
      executedBy: 'QA-004',
      executedAt: '2025-01-10T14:00:00Z'
    }
  ]
};

writeJSON('test/test-scenarios.json', testScenarios);

console.log(`✅ 测试场景数据: ${testScenarios.data.length}个`);
console.log(`   - 需求分解场景: 1个`);
console.log(`   - PI Planning场景: 1个`);
console.log(`   - Team Backlog场景: 1个`);
console.log(`   - Feature复用场景: 1个`);
console.log(`   - 制品晋级场景: 1个\n`);

// ============================================================================
// 完成总结
// ============================================================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  ✅ Phase 1 数据补充完成！');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📊 补充数据统计：');
console.log(`  1. WorkItem与MR关联: ${workItems.data.filter(wi => wi.parentMRId).length}个WorkItem`);
console.log(`  2. Product版本数据: ${productVersions.data.length}条版本记录`);
console.log(`  3. 制品晋级数据: ${artifactPromotions.data.length}条晋级记录`);
console.log(`  4. 测试场景数据: ${testScenarios.data.length}个测试场景`);
console.log();

console.log('✅ 所有数据已写入文件！');
console.log('✅ 数据版本已升级到3.0！');
console.log('✅ 支持V3架构的所有核心业务场景！\n');

