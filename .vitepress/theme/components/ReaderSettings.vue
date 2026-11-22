<script setup lang="ts">
// 内联阅读器设置条：嵌在文章元信息行右侧（ArticleMeta 引用），
// 不弹窗；专注模式下保留（它就是退出入口），Esc 也可退出
import { onMounted, onUnmounted, reactive } from "vue"
import { applyPrefs, loadPrefs, savePrefs, type ReaderPrefs } from "../reader-prefs"

const prefs = reactive<ReaderPrefs>(loadPrefs())

function set(patch: Partial<ReaderPrefs>) {
  Object.assign(prefs, patch)
  applyPrefs(prefs)
  savePrefs(prefs)
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && prefs.focus) set({ focus: false })
}

onMounted(() => {
  window.addEventListener("keydown", onKey)
  applyPrefs(prefs)
})
onUnmounted(() => window.removeEventListener("keydown", onKey))

const sizes = ["小", "中", "大"]
const lines = ["紧凑", "标准", "宽松"]
</script>

<template>
  <div class="reader-settings">
    <div class="rs-group" role="group" aria-label="正文字号">
      <span class="rs-label">字号</span>
      <button
        v-for="(label, i) in sizes"
        :key="i"
        class="rs-btn"
        :class="{ 'is-on': prefs.size === i }"
        @click="set({ size: i as 0 | 1 | 2 })"
      >
        {{ label }}
      </button>
    </div>
    <div class="rs-group" role="group" aria-label="行距">
      <span class="rs-label">行距</span>
      <button
        v-for="(label, i) in lines"
        :key="i"
        class="rs-btn"
        :class="{ 'is-on': prefs.line === i }"
        @click="set({ line: i as 0 | 1 | 2 })"
      >
        {{ label }}
      </button>
    </div>
    <div class="rs-group" role="group" aria-label="阅读字体">
      <span class="rs-label">字体</span>
      <button class="rs-btn" :class="{ 'is-on': prefs.font === 'sans' }" @click="set({ font: 'sans' })">
        黑体
      </button>
      <button class="rs-btn" :class="{ 'is-on': prefs.font === 'kai' }" @click="set({ font: 'kai' })">
        文楷
      </button>
    </div>
    <div class="rs-group" role="group" aria-label="正文宽度">
      <span class="rs-label">宽度</span>
      <button
        class="rs-btn"
        :class="{ 'is-on': prefs.width === 'normal' }"
        @click="set({ width: 'normal' })"
      >
        标准
      </button>
      <button
        class="rs-btn"
        :class="{ 'is-on': prefs.width === 'wide' }"
        @click="set({ width: 'wide' })"
      >
        宽
      </button>
    </div>
    <button
      class="rs-focus"
      :class="{ 'is-on': prefs.focus }"
      :title="prefs.focus ? '退出专注模式（Esc）' : '进入专注模式'"
      @click="set({ focus: !prefs.focus })"
    >
      <svg class="rs-focus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" />
      </svg>
      {{ prefs.focus ? "退出专注" : "专注" }}
    </button>
  </div>
</template>
