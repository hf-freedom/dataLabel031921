<template>
  <div v-if="!item.meta?.hidden">
    <template v-if="!hasChildren">
      <el-menu-item :index="resolvePath(basePath)">
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>{{ item.meta?.title }}</template>
      </el-menu-item>
    </template>
    
    <template v-else>
      <el-sub-menu :index="resolvePath(basePath)">
        <template #title>
          <el-icon v-if="item.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta?.title }}</span>
        </template>
        <sidebar-item
          v-for="child in visibleChildren"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

interface Props {
  item: RouteRecordRaw
  basePath: string
}

const props = defineProps<Props>()

const visibleChildren = computed(() => {
  return (props.item.children || []).filter(child => !child.meta?.hidden)
})

const hasChildren = computed(() => visibleChildren.value.length > 0)

const resolvePath = (path: string): string => {
  if (path.startsWith('/')) return path
  if (props.basePath.endsWith('/')) {
    return props.basePath + path
  }
  return props.basePath + '/' + path
}
</script>
