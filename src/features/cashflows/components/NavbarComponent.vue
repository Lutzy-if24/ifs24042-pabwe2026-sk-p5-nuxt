<script setup lang="ts">
import { Menu, LogOut, Wallet } from "lucide-vue-next";
import { initialOf } from "../../../helpers/toolsHelper";

defineProps({
  name: { type: String, default: "Pengguna" },
  username: { type: String, default: "" },
  open: Boolean,
});
defineEmits(["toggle", "logout"]);
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="btn btn-light lg:hidden"
          aria-controls="sidebar"
          :aria-expanded="open"
          @click="$emit('toggle')"
        >
          <Menu class="size-5" aria-hidden="true" />
          <span class="sr-only">Buka menu navigasi</span>
        </button>
        <span
          class="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
        >
          <Wallet class="size-5" aria-hidden="true" />
        </span>
        <div class="hidden sm:block">
          <p class="text-sm font-extrabold tracking-tight text-slate-900">Delcom Cash Flow</p>
          <p class="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Keuangan Pribadi</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-1.5 sm:flex">
          <span
            class="grid size-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-extrabold text-white shadow"
            aria-hidden="true"
          >{{ initialOf(name) }}</span>
          <div class="text-left leading-tight">
            <p class="max-w-36 truncate text-sm font-bold text-slate-900">{{ name }}</p>
            <p v-if="username" class="max-w-36 truncate text-xs text-slate-500">{{ username }}</p>
          </div>
        </div>
        <button type="button" class="btn btn-light" @click="$emit('logout')">
          <LogOut class="size-4" aria-hidden="true" />
          <span class="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </div>
  </header>
</template>
