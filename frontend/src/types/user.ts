export interface User {
  id: string
  username: string
  password?: string // 仅用于 Mock 数据，生产环境不应包含
  name: string
  email: string
  avatar: string
  role: 'product_manager' | 'project_manager' | 'product_owner' | 'tech_lead' | 'developer' | 'tester' | 'admin' | 'pm'
  roleName?: string
  department: string
  title?: string
  phone: string
  status: 'active' | 'inactive'
  createdAt?: string
}

export interface Team {
  id: string
  code: string
  name: string
  description: string
  leaderId: string
  leaderName: string
  memberCount: number
  members: string[]
  type: 'dev' | 'test' | 'ops' | 'cross'
  status: 'active' | 'inactive'
  createdAt: string
}

