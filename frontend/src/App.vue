<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'F6') {
    e.preventDefault()
    if (route.path !== '/settings') {
      router.push('/settings')
    } else {
      router.back()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <main class="app-shell">
    <!-- 路由出口 -->
    <div class="app-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-nav {
  padding: 1.5rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  border-radius: 8px;
}

.app-nav a {
  font-weight: bold;
  color: #888;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s;
}

.app-nav a.router-link-exact-active {
  color: #646cff;
}

.app-nav a:hover {
  color: #fff;
}

.separator {
  color: #444;
  margin: 0 1rem;
}

.app-content {
  flex: 1;
  /* padding: 0 1rem; */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
