<template>
  <div class="project-backlog">
    <el-card>
      <h2>项目待办 - {{ backlogId }}</h2>
      <el-alert
        title="功能开发中"
        type="info"
        description="ProjectBacklog 页面正在开发中，敬请期待！"
        show-icon
        :closable="false"
      />
      <div class="back-link">
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const backlogId = computed(() => route.params.id as string)

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.project-backlog {
  padding: 20px;

  h2 {
    margin-bottom: 20px;
  }

  .back-link {
    margin-top: 20px;
  }
}
</style>

