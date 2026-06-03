<script setup lang="ts">
import { useCounterStore } from '../store/counter'

const counterStore = useCounterStore()
</script>

<template>
  <div class="about-view">
    <h2>关于我们 (About)</h2>
    <p>这是一个演示 Pinia 状态管理与 Vue Router 多页面路由的页面。</p>
    
    <div class="counter-demo">
      <p>当前 Pinia 计数器: <strong>{{ counterStore.count }}</strong></p>
      <button @click="counterStore.increment">点击增加 (全局状态)</button>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  padding: 2rem;
  text-align: center;
}
.counter-demo {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}
button {
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #646cff;
  color: white;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #535bf2;
}
</style>
