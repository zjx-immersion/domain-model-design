<template>
  <div class="products-list page-container">
    <div class="page-header">
      <h1>领域产品管理</h1>
      <p class="description">管理产品线下的所有领域产品和版本</p>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="searchKey"
        placeholder="搜索产品名称或编号"
        prefix-icon="Search"
        style="width: 300px"
        clearable
      />
      <el-select v-model="productLineFilter" placeholder="产品线筛选" clearable style="width: 200px">
        <el-option
          v-for="pl in productLines"
          :key="pl.id"
          :label="pl.name"
          :value="pl.id"
        />
      </el-select>
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px">
        <el-option label="规划中" value="planning" />
        <el-option label="开发中" value="in_development" />
        <el-option label="已发布" value="released" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="handleCreate">创建产品</el-button>
    </div>

    <!-- 产品卡片列表 -->
    <el-row :gutter="24">
      <el-col v-for="product in filteredProducts" :key="product.id" :span="8">
        <el-card class="product-card" shadow="hover" @click="viewProduct(product.id)">
          <template #header>
            <div class="card-header">
              <div>
                <span class="product-code">{{ product.code }}</span>
                <h3>{{ product.name }}</h3>
                <span class="product-line">{{ product.productLineName }}</span>
              </div>
              <el-tag :type="getStatusType(product.status)">
                {{ getStatusText(product.status) }}
              </el-tag>
            </div>
          </template>

          <div class="product-content">
            <p class="description">{{ product.description }}</p>

            <div class="product-info">
              <div class="info-item">
                <el-icon><User /></el-icon>
                <span>{{ product.ownerName }}</span>
              </div>

              <div class="info-item">
                <el-icon><Box /></el-icon>
                <span>v{{ product.version }}</span>
              </div>

              <div class="info-item">
                <el-icon><Calendar /></el-icon>
                <span v-if="product.releaseDate">{{ product.releaseDate }}</span>
                <span v-else>计划: {{ product.planReleaseDate }}</span>
              </div>
            </div>

            <div class="product-metrics">
              <div class="metric">
                <span class="metric-value">{{ product.featureCount }}</span>
                <span class="metric-label">特性</span>
              </div>
              <div class="metric">
                <span class="metric-value">{{ product.moduleCount }}</span>
                <span class="metric-label">模块</span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="card-actions">
              <el-button text @click.stop="viewProduct(product.id)">
                <el-icon><View /></el-icon> 查看详情
              </el-button>
              <el-button text @click.stop="viewFeatures(product.id)">
                <el-icon><Files /></el-icon> 特性列表
              </el-button>
              <el-dropdown @command="(cmd) => handleCommand(cmd, product)">
                <el-button text icon="More" circle @click.stop />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="modules">模块列表</el-dropdown-item>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="version">版本管理</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="filteredProducts.length === 0" description="暂无产品" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import productsData from '@/data/products/domain-products.json'
import productLinesData from '@/data/products/product-lines.json'

const router = useRouter()

const searchKey = ref('')
const productLineFilter = ref('')
const statusFilter = ref('')
const products = ref(productsData)
const productLines = ref(productLinesData)

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchSearch = !searchKey.value || 
      product.name.includes(searchKey.value) || 
      product.code.includes(searchKey.value)
    const matchProductLine = !productLineFilter.value || 
      product.productLineId === productLineFilter.value
    const matchStatus = !statusFilter.value || product.status === statusFilter.value
    return matchSearch && matchProductLine && matchStatus
  })
})

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_development: 'primary',
    released: 'success',
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    in_development: '开发中',
    released: '已发布',
  }
  return textMap[status] || status
}

function viewProduct(id: string) {
  router.push(`/products/list/${id}`)
}

function viewFeatures(productId: string) {
  router.push({
    path: '/assets/features',
    query: { productId },
  })
}

function viewModules(productId: string) {
  router.push({
    path: '/assets/modules',
    query: { productId },
  })
}

function handleCreate() {
  ElMessage.info('创建产品功能开发中...')
}

function handleCommand(command: string, product: any) {
  switch (command) {
    case 'modules':
      viewModules(product.id)
      break
    case 'edit':
      ElMessage.info(`编辑产品: ${product.name}`)
      break
    case 'version':
      router.push(`/products/list/${product.id}/versions`)
      break
    case 'delete':
      ElMessageBox.confirm(`确定删除产品 ${product.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        ElMessage.success('删除成功')
      })
      break
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.products-list {
  .filter-bar {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    align-items: center;
  }

  .product-card {
    margin-bottom: $spacing-lg;
    cursor: pointer;
    transition: all $transition-base;
    height: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-md;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .product-code {
        font-size: 12px;
        color: $text-secondary;
        display: block;
        margin-bottom: 4px;
      }

      h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 600;
      }

      .product-line {
        font-size: 13px;
        color: $primary;
      }
    }

    .product-content {
      .description {
        color: $text-secondary;
        margin-bottom: $spacing-md;
        line-height: 1.6;
        min-height: 48px;
      }

      .product-info {
        display: flex;
        flex-direction: column;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;
        padding: $spacing-md 0;
        border-top: 1px solid $border-light;
        border-bottom: 1px solid $border-light;

        .info-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          font-size: 14px;
          color: $text-secondary;
        }
      }

      .product-metrics {
        display: flex;
        justify-content: space-around;

        .metric {
          text-align: center;

          .metric-value {
            display: block;
            font-size: 24px;
            font-weight: 600;
            color: $primary;
            margin-bottom: 4px;
          }

          .metric-label {
            font-size: 12px;
            color: $text-secondary;
          }
        }
      }
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

