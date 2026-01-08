/**
 * 资产管理类型定义
 */

// 产品线
export interface ProductLine {
  id: string
  code: string
  name: string
  description: string
  owner: string
  status: 'active' | 'inactive' | 'archived'
  products: string[]
  productCount: number
  features: string[]
  featureCount: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

// 领域特性
export interface DomainFeature {
  id: string
  code: string
  name: string
  description: string
  productLineId: string
  productLineName: string
  category: string
  type: 'common' | 'variant' | 'custom'
  reuseCount: number
  modules: string[]
  moduleCount: number
  interfaces: FeatureInterface[]
  dependencies: string[]
  variants: FeatureVariant[]
  status: 'active' | 'inactive' | 'deprecated'
  createdAt: string
  updatedAt: string
  tags: string[]
}

// 特性接口
export interface FeatureInterface {
  name: string
  type: string
  description: string
  parameters: InterfaceParameter[]
  returns: string
}

export interface InterfaceParameter {
  name: string
  type: string
  required: boolean
  description: string
}

// 特性变体
export interface FeatureVariant {
  id: string
  name: string
  description: string
  products: string[]
  configOptions: Record<string, any>
}

// 软件模块
export interface SoftwareModule {
  id: string
  code: string
  name: string
  description: string
  featureId: string
  featureName: string
  repository: string
  branch: string
  version: string
  language: string
  framework: string
  buildTool: string
  dependencies: ModuleDependency[]
  interfaces: ModuleInterface[]
  deployments: ModuleDeployment[]
  metrics: ModuleMetrics
  status: 'active' | 'inactive' | 'deprecated'
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface ModuleDependency {
  moduleId: string
  moduleName: string
  version: string
  type: 'required' | 'optional'
}

export interface ModuleInterface {
  name: string
  type: 'REST' | 'RPC' | 'Event' | 'Library'
  protocol: string
  endpoint?: string
  methods: InterfaceMethod[]
}

export interface InterfaceMethod {
  name: string
  description: string
  parameters: InterfaceParameter[]
  returns: string
}

export interface ModuleDeployment {
  environment: string
  version: string
  url: string
  status: 'running' | 'stopped' | 'error'
  lastDeployedAt: string
}

export interface ModuleMetrics {
  codeLines: number
  testCoverage: number
  buildSuccess: number
  buildTotal: number
  issues: number
  technicalDebt: number
}

// 资产关系
export interface AssetRelationship {
  nodes: AssetNode[]
  edges: AssetEdge[]
}

export interface AssetNode {
  id: string
  type: 'product-line' | 'product' | 'feature' | 'module'
  label: string
  data: any
}

export interface AssetEdge {
  id: string
  source: string
  target: string
  type: 'contains' | 'depends' | 'implements' | 'uses'
  label?: string
}

