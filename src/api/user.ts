import type { User, UserQuery, UserFormData, PageResponse } from '@/types'
import { request } from '@/utils/request'
import { mockUserApi } from '@/mock'

export const userApi = {
  getList: (params: UserQuery): Promise<PageResponse<User>> => 
    request(() => mockUserApi.getList(params)),
  
  getById: (id: number): Promise<User> => 
    request(() => mockUserApi.getById(id)),
  
  create: (data: UserFormData): Promise<User> => 
    request(() => mockUserApi.create(data as any)),
  
  update: (id: number, data: Partial<UserFormData>): Promise<User> => 
    request(() => mockUserApi.update(id, data as any)),
  
  delete: (ids: number[]): Promise<null> => 
    request(() => mockUserApi.delete(ids)),
  
  updateStatus: (id: number, status: 0 | 1): Promise<null> => 
    request(() => mockUserApi.updateStatus(id, status)),
  
  checkUsername: (username: string, excludeId?: number): Promise<boolean> => 
    request(() => mockUserApi.checkUsername(username, excludeId))
}
