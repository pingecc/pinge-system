import { navCategories } from "../.vitepress/generated/site-data.mjs"

export default {
  paths() {
    return navCategories.map((cat) => ({ params: { category: cat.label } }))
  }
}
