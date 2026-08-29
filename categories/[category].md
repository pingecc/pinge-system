---
layout: page
sidebar: false
---

<script setup>
import { useData } from "vitepress"
import CategoryPage from "../.vitepress/theme/components/CategoryPage.vue"

const { params } = useData()
</script>

<CategoryPage :categoryName="params.category" />
