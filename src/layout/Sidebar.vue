<template>
  <div class="sidebar">
    <div class="sidebar-logo">
      <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
      <span v-show="!appStore.sidebarCollapsed" class="logo-text">RBAC Admin</span>
    </div>
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <sidebar-item
          v-for="route in menuRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore, usePermissionStore } from '@/stores'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeMenu = computed(() => route.path)

const menuRoutes = computed(() => {
  const routes = permissionStore.menuRoutes
  if (routes.length > 0 && routes[0].path === '/' && routes[0].children) {
    return routes[0].children
  }
  return routes
})
</script>

<style scoped lang="scss">
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #263445;
  overflow: hidden;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  margin-left: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.el-menu {
  border-right: none;
}

:deep(.el-menu) {
  background-color: #304156;
}
</style>
