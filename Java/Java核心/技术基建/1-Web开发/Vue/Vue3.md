# Vue2和Vue3
 📊 Vue 2 vs Vue 3 全面对比表


✅ 1. **响应式状态**

- **Vue 2**：在 `data()` 中返回对象，如 `data() { return { count: 0 } }`
- **Vue 3**：使用 `ref(0)`（基本类型）或 `reactive({ count: 0 })`（对象）

---

 ✅ 2. **修改响应式数据**

- **Vue 2**：通过 `this.count++` 直接修改
- **Vue 3**：`ref` 需通过 `.value` 修改（如 `count.value++`），模板中自动解包

---

 ✅ 3. **计算属性**

- **Vue 2**：在 `computed` 选项中定义，如 `double() { return this.count * 2 }`
- **Vue 3**：使用 `computed(() => count.value * 2)` 函数式创建

---

 ✅ 4. **方法定义**

- **Vue 2**：在 `methods` 选项中定义函数
- **Vue 3**：在 `setup()` 内直接声明普通函数（如 `function handleClick() { ... }`）

---

 ✅ 5. **接收外部输入（Props）**

- **Vue 2**：通过 `props: ['title']` 声明，在组件内用 `this.title` 访问
- **Vue 3**：
    - 选项式：同 Vue 2（兼容）
    - 组合式：通过 `setup(props)` 参数获取，或 `<script setup>` 中用 `defineProps(['title'])`

---

 ✅ 6. **使用 Props 的注意事项**

- **Vue 2**：可直接解构 `this` 上的 props（无响应性问题）
- **Vue 3**：**不能直接解构 `props`**（会丢失响应性），需用 `toRefs(props)` 解构保持响应性

---

 ✅ 7. **向父组件通信（Emit 事件）**

- **Vue 2**：调用 `this.$emit('event', payload)`
- **Vue 3**：
    - 在 `setup(props, { emit })` 中使用 `emit('event', payload)`
    - 或在 `<script setup>` 中用 `const emit = defineEmits(['event'])`

---

 ✅ 8. **生命周期钩子**

- **Vue 2**：使用选项如 `mounted()`, `created()` 等
- **Vue 3**：
    - 使用导入的函数：`onMounted(() => { ... })`
    - 在 `setup()` 中调用，可多次使用同一钩子
    - `setup()` 本身运行在 `beforeCreate` 和 `created` 之间

---

 ✅ 9. **监听数据变化（Watch）**

- **Vue 2**：在 `watch` 选项中定义，如 `watch: { count(newVal) { ... } }`
- **Vue 3**：使用 `watch(count, (newVal) => { ... })`，支持更灵活的源（如 getter 函数、数组）

---

 ✅ 10. **访问插槽（Slots）**

- **Vue 2**：通过 `this.$slots.default` 访问
- **Vue 3**：
    - 在 `setup(props, { slots })` 中使用 `slots.default?.()`
    - 或用 `useSlots()`（在 `<script setup>` 中）

---

 ✅ 11. **透传未声明的 Attributes**

- **Vue 2**：通过 `this.$attrs` 获取
- **Vue 3**：
    - 在 `setup(props, { attrs })` 中使用 `attrs`
    - 或用 `useAttrs()`（在 `<script setup>` 中）
    - 模板中仍可用 `$attrs`

---

 ✅ 12. **暴露方法给父组件（通过 ref 调用）**

- **Vue 2**：所有 `methods` 默认可通过 `$refs.child.method()` 调用（缺乏封装）
- **Vue 3**：
    - 使用 `context.expose({ method })` 显式暴露
    - 或在 `<script setup>` 中用 `defineExpose({ method })`
    - **未暴露的内容对外不可见**，封装性更强

---

✅ 13. **逻辑复用**

- **Vue 2**：使用 **Mixins**
    - 缺点：命名冲突、来源不透明、难以调试、类型推导差
- **Vue 3**：使用 **Composables（组合函数）**
    - 如 `function useCounter() { const count = ref(0); return { count }; }`
    - 优点：无命名冲突、逻辑清晰、可测试、天然支持 TypeScript

---

 ✅ 14. **TypeScript 支持**

- **Vue 2**：支持较弱，`this` 类型复杂，常需手动声明或 `@ts-ignore`
- **Vue 3**：
    - 框架用 TypeScript 重写
    - Composition API 天然函数式，类型推导精准
    - `defineProps`、`defineEmits` 支持泛型，开箱即用

---

 ✅ 15. **响应式系统底层**

- **Vue 2**：基于 `Object.defineProperty`
    - 无法监听新增/删除属性（需 `Vue.set`）
    - 数组索引赋值、`length` 修改无法触发更新
- **Vue 3**：基于 `Proxy`
    - 原生支持动态属性、数组操作、`delete` 等
    - 更细粒度依赖追踪，性能更好

---

 ✅ 16. **模板编译优化**

- **Vue 2**：运行时解析模板，diff 整个组件树
- **Vue 3**：
    - 编译时生成带 **PatchFlags** 的代码
    - 静态节点被提升，跳过 diff
    - 支持 **Block Tree**，更新更高效

---

 ✅ 17. **代码组织与可维护性**

- **Vue 2**：逻辑按“类型”分散（data/methods/computed/watch 各自独立）
- **Vue 3**：逻辑按“功能”聚合（一个功能的所有代码写在一起），易于抽离和复用

---

 ✅ 18. **语法简洁性（推荐写法）**

- **Vue 2**：必须写 `export default { ... }`，需手动 `return` 暴露数据
- **Vue 3（推荐）**：使用 `<script setup>`
    - 顶层变量/函数自动暴露给模板
    - 无需 `return`
    - 更少样板代码，开发体验更流畅

---

