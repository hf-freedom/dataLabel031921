import type { Permission, PermissionTree, ApiResponse } from '@/types'

export const mockPermissions: Permission[] = [
  {
    id: 1,
    name: '系统管理',
    code: 'system',
    type: 'menu',
    parentId: null,
    path: '/system',
    icon: 'Setting',
    sort: 1,
    children: [
      {
        id: 2,
        name: '用户管理',
        code: 'user',
        type: 'menu',
        parentId: 1,
        path: '/system/user',
        component: 'system/user/index',
        icon: 'User',
        sort: 1,
        children: [
          { id: 21, name: '查看', code: 'user:view', type: 'button', parentId: 2, sort: 1 },
          { id: 22, name: '新增', code: 'user:create', type: 'button', parentId: 2, sort: 2 },
          { id: 23, name: '编辑', code: 'user:update', type: 'button', parentId: 2, sort: 3 },
          { id: 24, name: '删除', code: 'user:delete', type: 'button', parentId: 2, sort: 4 },
          { id: 25, name: '分配角色', code: 'user:assign-role', type: 'button', parentId: 2, sort: 5 }
        ]
      },
      {
        id: 3,
        name: '角色管理',
        code: 'role',
        type: 'menu',
        parentId: 1,
        path: '/system/role',
        component: 'system/role/index',
        icon: 'UserFilled',
        sort: 2,
        children: [
          { id: 31, name: '查看', code: 'role:view', type: 'button', parentId: 3, sort: 1 },
          { id: 32, name: '新增', code: 'role:create', type: 'button', parentId: 3, sort: 2 },
          { id: 33, name: '编辑', code: 'role:update', type: 'button', parentId: 3, sort: 3 },
          { id: 34, name: '删除', code: 'role:delete', type: 'button', parentId: 3, sort: 4 },
          { id: 35, name: '分配权限', code: 'role:assign-permission', type: 'button', parentId: 3, sort: 5 }
        ]
      },
      {
        id: 4,
        name: '权限管理',
        code: 'permission',
        type: 'menu',
        parentId: 1,
        path: '/system/permission',
        component: 'system/permission/index',
        icon: 'Lock',
        sort: 3,
        children: [
          { id: 41, name: '查看', code: 'permission:view', type: 'button', parentId: 4, sort: 1 },
          { id: 42, name: '新增', code: 'permission:create', type: 'button', parentId: 4, sort: 2 },
          { id: 43, name: '编辑', code: 'permission:update', type: 'button', parentId: 4, sort: 3 },
          { id: 44, name: '删除', code: 'permission:delete', type: 'button', parentId: 4, sort: 4 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: '仪表盘',
    code: 'dashboard',
    type: 'menu',
    parentId: null,
    path: '/dashboard',
    component: 'dashboard/index',
    icon: 'DataBoard',
    sort: 0,
    children: [
      { id: 51, name: '查看', code: 'dashboard:view', type: 'button', parentId: 5, sort: 1 }
    ]
  }
]

function buildTree(permissions: Permission[]): PermissionTree[] {
  const map = new Map<number, PermissionTree>()
  const roots: PermissionTree[] = []
  
  permissions.forEach(p => {
    map.set(p.id, { ...p, children: [] })
  })
  
  permissions.forEach(p => {
    const node = map.get(p.id)!
    if (p.parentId === null) {
      roots.push(node)
    } else {
      const parent = map.get(p.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(node)
      }
    }
  })
  
  return roots
}

export const mockPermissionApi = {
  getTree: (): Promise<ApiResponse<PermissionTree[]>> => {
    const tree = buildTree(mockPermissions)
    return Promise.resolve({ code: 200, message: 'success', data: tree })
  },
  
  getAllCodes: (): Promise<ApiResponse<string[]>> => {
    const codes: string[] = []
    const collectCodes = (items: Permission[]) => {
      items.forEach(item => {
        codes.push(item.code)
        if (item.children) collectCodes(item.children)
      })
    }
    collectCodes(mockPermissions)
    return Promise.resolve({ code: 200, message: 'success', data: codes })
  }
}
