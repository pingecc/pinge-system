<script setup lang="ts">
import { onMounted } from "vue"
import { onContentUpdated } from "vitepress"

let pending = 0

function queueApply() {
  window.clearTimeout(pending)
  pending = window.setTimeout(applyFolds, 0)
}

// 只处理右侧目录里的"嵌套项"（三级及以下标题）
function applyFolds() {
  const items = document.querySelectorAll<HTMLLIElement>(
    ".VPDocAsideOutline ul.VPDocOutlineItem.nested > li"
  )
  items.forEach((li) => {
    const nested = li.querySelector<HTMLUListElement>(":scope > ul.VPDocOutlineItem")
    if (!nested) return

    let btn = li.querySelector<HTMLButtonElement>(":scope > button.outline-fold")
    if (!btn) {
      btn = document.createElement("button")
      btn.type = "button"
      btn.className = "outline-fold"
      btn.title = "展开 / 折叠"
      btn.setAttribute("aria-expanded", "false")
      btn.addEventListener("click", () => {
        const collapsed = li.classList.toggle("is-collapsed")
        btn?.setAttribute("aria-expanded", String(!collapsed))
        li.classList.add("user-open")
      })
      li.insertBefore(btn, li.firstChild)
    }

    if (!li.classList.contains("user-open")) li.classList.add("is-collapsed")
  })
}

function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof Element)) continue
        if (
          node.matches(".VPDocOutlineItem") ||
          node.querySelector(".VPDocOutlineItem")
        ) {
          queueApply()
          return
        }
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

onMounted(() => {
  applyFolds()
  setupObserver()
})
onContentUpdated(applyFolds)
</script>

<template>
  <!-- 无可见内容：右侧目录三级及以下标题默认折叠，点击展开 -->
</template>
