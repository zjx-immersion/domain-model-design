export interface Project {
  id: string
  code: string
  name: string
  productId: string
  productName: string
  type: 'product_development' | 'research' | 'maintenance'
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
  owner: string
  ownerName: string
  description: string
  startDate: string
  plannedEndDate: string
  actualEndDate: string | null
  budget: number
  teamCount: number
  memberCount: number
  piCount: number
  milestoneCount: number
  progress: number
  health: 'healthy' | 'at_risk' | 'delayed' | 'unknown'
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface PIPlanning {
  id: string
  code: string
  name: string
  projectId: string
  projectName: string
  status: 'planning' | 'active' | 'completed'
  startDate: string
  endDate: string
  duration: number
  teamCount: number
  objectiveCount: number
  storyCount: number
  totalPoints: number
  completedPoints: number
  progress: number
  confidence: number
  risks: Risk[]
  dependencies: Dependency[]
  achievements: string[]
  createdAt: string
  updatedAt: string
}

export interface Risk {
  id: string
  title: string
  level: 'low' | 'medium' | 'high'
  impact: string
  mitigation: string
  owner: string
}

export interface Dependency {
  id: string
  from: string
  to: string
  type: 'data_interface' | 'module_integration' | 'resource' | 'knowledge'
  status: 'identified' | 'at_risk' | 'resolved'
}

export interface Milestone {
  id: string
  code: string
  name: string
  projectId: string
  type: 'release' | 'review' | 'deadline' | 'checkpoint'
  status: 'upcoming' | 'in_progress' | 'completed' | 'missed'
  plannedDate: string
  actualDate: string | null
  description: string
  deliverables: string[]
  owner: string
  createdAt: string
}

