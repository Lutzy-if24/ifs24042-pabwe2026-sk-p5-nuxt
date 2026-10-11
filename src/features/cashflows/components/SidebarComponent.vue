<script setup lang="ts">
import { RouterLink } from "vue-router";
import { LayoutDashboard, Users, UserRound } from "lucide-vue-next";

defineProps({ open: Boolean });
defineEmits(["navigate"]);

const links = [
  { to: "/", label: "Ringkasan Arus Kas", icon: LayoutDashboard, desc: "Dashboard & transaksi" },
  { to: "/users", label: "Direktori Pengguna", icon: Users, desc: "Daftar pengguna" },
  { to: "/profile", label: "Profil Saya", icon: UserRound, desc: "Pengaturan akun" },
];
</script>

<template>
  <nav
    id="sidebar"
    aria-label="Menu utama"
    :class="[
      open ? 'block' : 'hidden',
      'border-b border-slate-200/80 bg-white/90 p-4 backdrop-blur lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0 lg:p-5',
    ]"
  >
    <p class="mb-3 px-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Menu Utama</p>
    <ul class="space-y-1.5">
      <li v-for="l in links" :key="l.to">
        <RouterLink
          :to="l.to"
          class="group flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-indigo-50 aria-[current=page]:bg-gradient-to-r aria-[current=page]:from-indigo-600 aria-[current=page]:to-violet-600 aria-[current=page]:text-white aria-[current=page]:shadow-lg aria-[current=page]:shadow-indigo-500/25"
          @click="$emit('navigate')"
        >
          <span
            class="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-600 transition group-aria-[current=page]:bg-white/20 group-aria-[current=page]:text-white group-hover:bg-indigo-100 group-hover:text-indigo-700"
          >
            <component :is="l.icon" class="size-4.5" aria-hidden="true" />
          </span>
          <span class="min-w-0">
            <span class="block text-sm font-bold text-slate-800 group-aria-[current=page]:text-white">{{ l.label }}</span>
            <span class="block text-[11px] text-slate-500 group-aria-[current=page]:text-indigo-100">{{ l.desc }}</span>
          </span>
        </RouterLink>
      </li>
    </ul>
    <div class="mt-6 hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4 text-white shadow-lg shadow-indigo-500/20 lg:block">
      <p class="text-xs font-bold uppercase tracking-wider text-indigo-100">Praktikum 5</p>
      <p class="mt-1 text-sm font-extrabold">Delcom Cash Flow</p>
      <p class="mt-1 text-xs text-indigo-100/90">Pencatatan arus kas modern & responsif</p>
    </div>
  </nav>
</template>
