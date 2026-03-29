<template>
  <div class="role-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button v-permission="'role:create'" type="primary" @click="handleAdd">
            新增角色
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="search-form">
        <el-form-item label="角色名称">
          <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色标识" width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button v-permission="'role:update'" type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button v-permission="'role:assign-permission'" type="warning" link @click="handleAssignPermission(row)">
              分配权限
            </el-button>
            <el-button v-permission="'role:delete'" type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="formData.code" :disabled="!!formData.id" placeholder="请输入角色标识" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="permissionDialogVisible" title="分配权限" width="500px">
      <el-tree
        ref="treeRef"
        :data="permissionTree"
        :props="{ label: 'name', children: 'children' }"
        show-checkbox
        node-key="code"
        :default-checked-keys="selectedPermissions"
        :default-expand-all="true"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAssignPermissionSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { roleApi, permissionApi } from '@/api'
import type { Role, PermissionTree } from '@/types'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Role[]>([])
const total = ref(0)
const permissionTree = ref<PermissionTree[]>([])

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  name: '',
  status: undefined as number | undefined
})

const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const formRef = ref<FormInstance>()
const treeRef = ref()
const currentRoleId = ref<number>()
const selectedPermissions = ref<string[]>([])

const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  description: '',
  status: 1 as 0 | 1
})

const dialogTitle = computed(() => formData.id ? '编辑角色' : '新增角色')

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { pattern: /^[a-z]+$/, message: '角色标识只能是小写字母', trigger: 'blur' }
  ]
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await roleApi.getList(queryParams)
    tableData.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const loadPermissionTree = async () => {
  const res = await permissionApi.getTree()
  permissionTree.value = res
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.name = ''
  queryParams.status = undefined
  queryParams.page = 1
  loadData()
}

const resetForm = () => {
  formData.id = undefined
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.status = 1
}

const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: Role) => {
  resetForm()
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description
  formData.status = row.status
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (formData.id) {
      await roleApi.update(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await roleApi.create(formData as any)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`确定要删除角色「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await roleApi.delete([row.id])
    ElMessage.success('删除成功')
    loadData()
  })
}

const handleAssignPermission = (row: Role) => {
  currentRoleId.value = row.id
  selectedPermissions.value = row.permissions.filter(p => p !== '*')
  permissionDialogVisible.value = true
}

const handleAssignPermissionSubmit = async () => {
  if (!currentRoleId.value) return
  
  const checkedKeys = treeRef.value?.getCheckedKeys() || []
  
  submitLoading.value = true
  try {
    await roleApi.updatePermissions(currentRoleId.value, checkedKeys)
    ElMessage.success('分配权限成功')
    permissionDialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadData()
  loadPermissionTree()
})
</script>

<style scoped lang="scss">
.role-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 16px;
  }
}
</style>
