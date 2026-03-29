import type { PermissionTree } from '@/types'
import { request } from '@/utils/request'
import { mockPermissionApi } from '@/mock'

export const permissionApi = {
  getTree: (): Promise<PermissionTree[]> => 
    request(() => mockPermissionApi.getTree()),
  
  getAllCodes: (): Promise<string[]> => 
    request(() => mockPermissionApi.getAllCodes())
}
