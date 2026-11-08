// 侧边栏筛选框：输入关键字即时过滤侧边栏条目。
// 采用与 OutlineFold 相同的 DOM 方案——不侵入 VitePress 内部的折叠状态，
// 自底向上标记 sidebar-item-hidden，组只要还有可见后代就保留；
// 筛选期间给 .VPSidebar 挂 sidebar-filtering 类，CSS 强制展开所有折叠组。
import { defineComponent, h, onBeforeUnmount, onMounted } from "vue"

export default defineComponent({
  name: "SidebarFilter",
  setup() {
    let inputEl: HTMLInputElement | null = null
    let emptyEl: HTMLElement | null = null

    function clearEmpty() {
      emptyEl?.remove()
      emptyEl = null
    }

    function applyFilter(raw: string) {
      const sidebar = document.querySelector(".VPSidebar")
      if (!sidebar) return
      const norm = raw.trim().toLowerCase()
      const items = Array.from(sidebar.querySelectorAll<HTMLElement>(".VPSidebarItem"))

      if (!norm) {
        for (const it of items) it.classList.remove("sidebar-item-hidden")
        for (const g of sidebar.querySelectorAll<HTMLElement>(".group")) {
          g.classList.remove("sidebar-item-hidden")
        }
        sidebar.classList.remove("sidebar-filtering")
        clearEmpty()
        return
      }

      sidebar.classList.add("sidebar-filtering")

      // .VPSidebarItem 嵌套 .VPSidebarItem 且文档序为父先子后，
      // 从后往前遍历保证处理父项时所有子项的可见性已定
      for (let i = items.length - 1; i >= 0; i--) {
        const el = items[i]
        const own = el.querySelector<HTMLElement>(":scope > .item .text")
        const selfMatch = !!own && own.textContent!.toLowerCase().includes(norm)
        let childMatch = false
        if (selfMatch) {
          el.classList.remove("sidebar-item-hidden")
          continue
        }
        const childItems = el.querySelector(":scope > .items")
        if (childItems) {
          childMatch = !!childItems.querySelector(".VPSidebarItem:not(.sidebar-item-hidden)")
        }
        el.classList.toggle("sidebar-item-hidden", !childMatch)
      }

      // 顶层 .group 包裹（VPSidebarGroup 渲染）本身不是 .VPSidebarItem，
      // 组整体隐藏时把包裹一并藏掉，避免残留空壳边线
      for (const g of sidebar.querySelectorAll<HTMLElement>(".group")) {
        const hasVisible = !!g.querySelector(".VPSidebarItem:not(.sidebar-item-hidden)")
        g.classList.toggle("sidebar-item-hidden", !hasVisible)
      }

      // 无命中时给一句提示（挂在筛选框下方）
      const anyVisible = items.some((it) => !it.classList.contains("sidebar-item-hidden"))
      if (!anyVisible && !emptyEl) {
        emptyEl = document.createElement("div")
        emptyEl.className = "sidebar-filter-empty"
        emptyEl.textContent = `没有匹配「${raw.trim()}」的条目`
        inputEl?.closest(".sidebar-filter")?.after(emptyEl)
      } else if (anyVisible) {
        clearEmpty()
      }
    }

    function onInput(e: Event) {
      applyFilter((e.target as HTMLInputElement).value)
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape" && inputEl?.value) {
        inputEl.value = ""
        applyFilter("")
      }
    }

    onBeforeUnmount(() => {
      // 组件卸载时清掉筛选态，避免残留类影响下一次挂载
      document.querySelector(".VPSidebar")?.classList.remove("sidebar-filtering")
      clearEmpty()
    })

    return {
      setInput: (el: unknown) => {
        inputEl = el as HTMLInputElement | null
      },
      onInput,
      onKeydown
    }
  },
  render() {
    return h("div", { class: "sidebar-filter" }, [
      h("input", {
        ref: this.setInput,
        type: "text",
        placeholder: "筛选本分类文章…",
        spellcheck: false,
        onInput: this.onInput,
        onKeydown: this.onKeydown
      })
    ])
  }
})
