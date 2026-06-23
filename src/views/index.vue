<template>
  <div class="welcome-page">
    <div class="welcome-card">
      <div class="welcome-badge">欢迎</div>
      <h1>欢迎使用智能仓库管理系统</h1>
      <p class="welcome-text">通过系统快速管理仓库库存、出入库流程和数据统计。</p>
      <div class="welcome-features">
        <div class="feature-item">
          <div class="feature-icon">📦</div>
          <div>
            <h3>仓库管理</h3>
            <p>实时掌握库存状态，支持多仓区管理。</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🚚</div>
          <div>
            <h3>出入库流程</h3>
            <p>规范化出入库操作，提升效率与准确率。</p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div>
            <h3>数据统计</h3>
            <p>可视化报表和关键指标一目了然。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 欢迎页内容，仅用于首页展示
</script>

<style scoped lang="scss">
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #1f3c88 0%, #3b8d99 100%);
}

.welcome-card {
  width: 100%;
  max-width: 960px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  padding: 40px 36px;
  color: #ffffff;
  backdrop-filter: blur(18px);
}

.welcome-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 18px;
}

h1 {
  margin: 0;
  font-size: 42px;
  line-height: 1.1;
  font-weight: 700;
}

.welcome-text {
  margin: 18px 0 30px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 17px;
  max-width: 680px;
}

.welcome-features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  gap: 16px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.feature-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.14);
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
  font-size: 24px;
}

.feature-item h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.feature-item p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
}

@media (max-width: 900px) {
  .welcome-card {
    padding: 32px 24px;
  }

  .welcome-features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 34px;
  }

  .welcome-card {
    border-radius: 20px;
  }
}
</style>
