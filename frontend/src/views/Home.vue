<script setup lang="ts">
const versions = window.desktop?.getVersions()

const featureCards = [
  {
    title: '桌面壳',
    description: 'Electron 主进程与 preload 已接入，可继续扩展菜单、窗口与系统能力。',
  },
  {
    title: '前端界面',
    description: 'Vue 3 + TypeScript + Vite + Vue Router + Pinia 已就绪，支持多页面框架与全局状态管理。',
  },
  {
    title: '构建发布',
    description: '已预置 Linux 打包配置，可生成 AppImage 与 deb 安装包。',
  },
]
</script>

<template>
  <div class="home-view">
    <section class="hero">
      <p class="eyebrow">KY Electron Starter</p>
      <h1>Vue 3 + TypeScript + Electron + Vite</h1>
      <p class="summary">
        当前项目已经完成基础骨架搭建，已接入路由与状态管理，后续可继续接入数据库和具体业务。
      </p>
      <div class="version-grid" v-if="versions">
        <div class="version-card">
          <span class="label">Electron</span>
          <strong>{{ versions?.electron ?? '--' }}</strong>
        </div>
        <div class="version-card">
          <span class="label">Node.js</span>
          <strong>{{ versions?.node ?? '--' }}</strong>
        </div>
        <div class="version-card">
          <span class="label">Chrome</span>
          <strong>{{ versions?.chrome ?? '--' }}</strong>
        </div>
      </div>
    </section>

    <section class="content-grid">
      <article
        v-for="card in featureCards"
        :key="card.title"
        class="feature-card"
      >
        <h2>{{ card.title }}</h2>
        <p>{{ card.description }}</p>
      </article>
    </section>

    <section class="next-step">
      <h2>建议下一步</h2>
      <ul>
        <li>在 `electron/preload.ts` 暴露受控系统 API</li>
        <li>按业务规划数据库、日志和自动更新能力</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.hero {
  text-align: center;
}
.version-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
.version-card {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.feature-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}
.next-step {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}
ul {
  text-align: left;
  display: inline-block;
}
</style>
