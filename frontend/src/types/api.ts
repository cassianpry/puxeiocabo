export type Role = 'user' | 'admin'

export interface Fighter {
  shortId: string
  fighterId: string | null
  platformId: number
  platformName: string
  platformTool: string
  circleName: string | null
}

export interface Report {
  id: number
  reporterId: string
  reportedId: string
  reporter: Fighter
  reported: Fighter
  proofImagePath: string
  comment: string
  adminComment: string | null
  exifData: string | null
  aiSuspicious: boolean
  aiReason: string | null
  createdAt: string
  status: 'pending' | 'approved' | 'rejected' | 'deleted'
}

export interface User {
  id: number
  email: string
  shortId: string | null
  fighter: Fighter | null
  role: Role
  createdAt: string
}

export interface PaginatedResponse<T> {
  reports: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  email: string
  role: Role
}
