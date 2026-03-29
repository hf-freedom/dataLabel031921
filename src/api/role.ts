import type { Role, RoleQuery, RoleFormData, PageResponse } from '@/types'
import { request } from '@/utils/request'
import { mockRoleApi } from '@/mock'

export const roleApi = {
  getList: (params: RoleQuery): Promise<PageResponse<Role>> => 
    request(() => mockRoleApi.getList(params)),
  
  getAll: (): Promise<Role[]> => 
    request(() => mockRoleApi.getAll()),
  
  getById: (id: number): Promise<Role> => 
    request(() => mockRoleApi.getById(id)),
  
  create: (data: RoleFormData): Promise<Role> => 
    request(() => mockRoleApi.create(data as any)),
  
  update: (id: number, data: Partial<RoleFormData>): Promise<Role> => 
    request(() => mockRoleApi.update(id, data as any)),
  
  delete: (ids: number[]): Promise<null> => 
    request(() => mockRoleApi.delete(ids)),
  
  updatePermissions: (id: number, permissions: string[]): Promise<null> => 
    request(() => mockRoleApi.updatePermissions(id, permissions))
}
