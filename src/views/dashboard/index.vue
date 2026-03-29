<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="32"><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>欢迎使用 RBAC 权限管理系统</span>
          </template>
          <div class="welcome-content">
            <h3>系统功能介绍</h3>
            <ul>
              <li>用户管理：管理系统用户，支持增删改查、分配角色</li>
              <li>角色管理：管理系统角色，支持增删改查、分配权限</li>
              <li>权限管理：管理系统权限，支持菜单权限和按钮权限</li>
              <li>动态路由：根据用户权限动态生成可访问的路由</li>
              <li>按钮级权限：通过 v-permission 指令控制按钮显隐</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>当前用户信息</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userStore.userInfo?.username }}
            </el-descriptions-item>
            <el-descriptions-item label="昵称">
              {{ userStore.userInfo?.nickname }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              <el-tag v-for="role in userStore.userInfo?.roles" :key="role" style="margin-right: 4px">
                {{ role }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const stats = computed(() => [
  { title: '用户总数', value: 5, icon: 'User', color: '#409EFF' },
  { title: '角色总数', value: 3, icon: 'UserFilled', color: '#67C23A' },
  { title: '权限总数', value: 20, icon: 'Lock', color: '#E6A23C' },
  { title: '在线用户', value: 1, icon: 'Connection', color: '#F56C6C' }
])
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .stat-info {
      margin-left: 16px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .stat-title {
      font-size: 14px;
      color: #999;
      margin-top: 4px;
    }
  }

  .welcome-content {
    h3 {
      margin: 0 0 16px;
      color: #333;
    }

    ul {
      padding-left: 20px;
      margin: 0;

      li {
        line-height: 2;
        color: #666;
      }
    }
  }
}
</style>
