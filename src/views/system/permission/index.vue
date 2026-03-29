<template>
  <div class="permission-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>权限树</span>
          <el-button type="primary" @click="handleExpandAll">展开全部</el-button>
          <el-button @click="handleCollapseAll">收起全部</el-button>
        </div>
      </template>

      <el-tree
        ref="treeRef"
        :data="permissionTree"
        :props="treeProps"
        show-checkbox
        node-key="code"
        :default-expand-all="isExpandAll"
        :default-checked-keys="checkedKeys"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <span class="node-label">{{ data.name }}</span>
            <el-tag v-if="data.type === 'menu'" type="primary" size="small">菜单</el-tag>
            <el-tag v-else type="warning" size="small">按钮</el-tag>
            <span class="node-code">{{ data.code }}</span>
          </div>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { permissionApi } from '@/api'
import type { PermissionTree } from '@/types'

const treeRef = ref()
const permissionTree = ref<PermissionTree[]>([])
const checkedKeys = ref<string[]>([])
const isExpandAll = ref(true)

const treeProps = {
  label: 'name',
  children: 'children'
}

const loadData = async () => {
  const res = await permissionApi.getTree()
  permissionTree.value = res
}

const handleExpandAll = () => {
  const nodes = treeRef.value?.store?.nodesMap
  if (nodes) {
    Object.values(nodes).forEach((node: any) => {
      node.expanded = true
    })
  }
}

const handleCollapseAll = () => {
  const nodes = treeRef.value?.store?.nodesMap
  if (nodes) {
    Object.values(nodes).forEach((node: any) => {
      node.expanded = false
    })
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.permission-management {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .tree-node {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    .node-label {
      font-weight: 500;
    }

    .node-code {
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
