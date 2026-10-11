<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from "vue-router";
import { Wallet } from "lucide-vue-next";

const route = useRoute();
const tabs = [
  { to: "/auth/login", label: "Masuk Akun" },
  { to: "/auth/register", label: "Daftar Baru" },
];
</script>
<template>
  <main
    id="main"
    class="relative grid min-h-screen place-items-center overflow-hidden p-4"
  >
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-indigo-100"></div>
    <div class="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-indigo-400/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-violet-400/20 blur-3xl"></div>

    <div class="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl sm:p-8">
      <div class="flex flex-col items-center text-center">
        <div class="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/40">
          <Wallet class="size-7" aria-hidden="true" />
        </div>
        <p class="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">Delcom Cash Flow</p>
        <p class="mt-1 text-sm text-slate-600">Aplikasi Pencatat Arus Kas &amp; Keuangan Pribadi</p>
      </div>

      <div class="mt-6 rounded-3xl bg-slate-50/90 p-5 ring-1 ring-slate-200/80 sm:p-6">
        <nav aria-label="Pilih halaman akun" class="grid grid-cols-2 gap-1 rounded-2xl bg-slate-200/80 p-1">
          <RouterLink
            v-for="t in tabs"
            :key="t.to"
            :to="t.to"
            :aria-current="route.path === t.to ? 'page' : undefined"
            class="rounded-xl px-3 py-2.5 text-center text-sm font-bold transition"
            :class="route.path === t.to ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-600 hover:bg-white/60'"
          >{{ t.label }}</RouterLink>
        </nav>
        <div class="mt-5"><RouterView /></div>
      </div>
    </div>
  </main>
</template>
