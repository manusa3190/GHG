<script setup lang="ts">
import { HomeIcon, CircleStackIcon } from '@heroicons/vue/24/solid';

const pages = [
  {
    name:'BOM',
    to:'/bom',
    icon:HomeIcon
  },  {
    name:'データ',
    to:'/data',
    icon:CircleStackIcon
  }
]
</script>

<template>
<div class="drawer drawer-open h-screen w-screen">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <nav class="w-full flex items-center h-12 border-b bg-base-100">
      <div class="flex-1 px-2 mx-2 text-3xl">BOM管理</div>

    </nav>
    <!-- Page content here -->
    <main class="h-full w-full">
      <NuxtPage></NuxtPage>
    </main>
  </div>

  <div class="drawer-side ">
    <ul class=" w-12 min-h-full bg-indigo-900 py-3 space-y-3">
      <!-- Sidebar content here -->
      <li v-for="p of pages" >
        <NuxtLink :to="p.to" class="w-full flex justify-center ">
          <component :is="p.icon" class="w-6 text-white "></component>
        </NuxtLink>
      </li>
    </ul>
  </div>
</div>
</template>

<style>
input {
  @apply bg-transparent outline-none input-sm border-b border-b-gray-300
}
</style>
