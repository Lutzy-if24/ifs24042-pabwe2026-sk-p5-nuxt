<script setup lang="ts">
import { computed, onMounted, ref, defineAsyncComponent } from "vue";
import { RouterLink } from "vue-router";
import { Plus, Trash2, Wallet, TrendingUp, TrendingDown, Banknote, PiggyBank, Landmark } from "lucide-vue-next";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import type { CashFlow } from "../states/cashFlowsStore";
import { sourceLabel, typeLabel, SOURCES, TYPES } from "../constants";
import { formatDate, formatRupiah, showConfirmDialog, showErrorDialog, showSuccessDialog, toApiDate } from "../../../helpers/toolsHelper";

const AddModal = defineAsyncComponent(() => import("../modals/AddModal.vue"));
const ChangeModal = defineAsyncComponent(() => import("../modals/ChangeModal.vue"));

const store = useCashFlowsStore();
const filter = ref({ type: "", source: "", label: "", start: "", end: "" });
const showAdd = ref(false);
const editing = ref<CashFlow | null>(null);

const load = () =>
  store.asyncGetCashFlows({
    type: filter.value.type, source: filter.value.source, label: filter.value.label,
    start_date: toApiDate(filter.value.start), end_date: toApiDate(filter.value.end, true),
  });
onMounted(() => { load(); store.asyncGetLabels(); });

const n = (k: string) => store.stats[k] || 0;
const cards = computed(() => [
  { title: "Total Saldo Kas Bersih", value: n("cashflow"), icon: Wallet, tone: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30" },
  { title: "Total Pemasukan", value: n("total_inflow"), icon: TrendingUp, tone: "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-500/30" },
  { title: "Total Pengeluaran", value: n("total_outflow"), icon: TrendingDown, tone: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/30" },
  { title: "Saldo Kas Tunai", value: n("total_inflow_cash") - n("total_outflow_cash"), icon: Banknote, tone: "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-500/30" },
  { title: "Saldo Tabungan", value: n("total_inflow_savings") - n("total_outflow_savings"), icon: PiggyBank, tone: "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/30" },
  { title: "Saldo Pinjaman", value: n("total_inflow_loans") - n("total_outflow_loans"), icon: Landmark, tone: "bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-violet-500/30" },
]);

async function reload() { await load(); store.asyncGetLabels(); }
function resetFilter() { filter.value = { type: "", source: "", label: "", start: "", end: "" }; load(); }
async function remove(c: CashFlow) {
  if (!(await showConfirmDialog(`Transaksi "${c.label}" akan dihapus.`, "Ya, hapus"))) return;
  const res = await store.asyncDeleteCashFlow(c.id);
  if (res.ok) { await showSuccessDialog(res.message); reload(); } else showErrorDialog(res.message);
}
async function removeAll() {
  if (!(await showConfirmDialog("Seluruh transaksi akan dihapus permanen.", "Ya, reset semua"))) return;
  const res = await store.asyncDeleteAllCashFlows();
  if (res.ok) { await showSuccessDialog(res.message); reload(); } else showErrorDialog(res.message);
}
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-500/25 sm:p-8">
    <div class="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl"></div>
    <div class="pointer-events-none absolute -bottom-12 left-1/3 size-48 rounded-full bg-sky-400/20 blur-3xl"></div>
    <div class="relative flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">Dashboard Keuangan</p>
        <h1 class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Ringkasan Arus Kas</h1>
        <p class="mt-2 max-w-lg text-sm text-indigo-100">Pantau pemasukan, pengeluaran, dan saldo Anda dalam satu tampilan yang rapi.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur hover:bg-white/20" @click="removeAll">
          <Trash2 class="size-4" aria-hidden="true" /> Reset semua
        </button>
        <button type="button" class="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-lg hover:bg-indigo-50" @click="showAdd = true">
          <Plus class="size-4" aria-hidden="true" /> Tambah transaksi
        </button>
      </div>
    </div>
  </div>

  <section aria-labelledby="h-sum" class="mt-6">
    <h2 id="h-sum" class="sr-only">Ringkasan saldo</h2>
    <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <li v-for="c in cards" :key="c.title" class="stat-card">
        <span class="mb-3 grid size-11 place-items-center rounded-2xl shadow-lg" :class="c.tone">
          <component :is="c.icon" class="size-5" aria-hidden="true" />
        </span>
        <p class="text-sm font-semibold text-slate-600">{{ c.title }}</p>
        <p class="mt-1 text-2xl font-extrabold tracking-tight" :class="c.value < 0 ? 'text-red-700' : 'text-slate-900'">{{ formatRupiah(c.value) }}</p>
      </li>
    </ul>
  </section>

  <section aria-labelledby="h-filter" class="card mt-6 p-4">
    <h2 id="h-filter" class="text-lg font-bold">Filter transaksi</h2>
    <form class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" @submit.prevent="load">
      <div><label class="label" for="f-type">Jenis</label>
        <select id="f-type" v-model="filter.type" class="field"><option value="">Semua</option><option v-for="t in TYPES" :key="t.value" :value="t.value">{{ t.label }}</option></select></div>
      <div><label class="label" for="f-source">Sumber dana</label>
        <select id="f-source" v-model="filter.source" class="field"><option value="">Semua</option><option v-for="s in SOURCES" :key="s.value" :value="s.value">{{ s.label }}</option></select></div>
      <div><label class="label" for="f-label">Label</label>
        <select id="f-label" v-model="filter.label" class="field"><option value="">Semua</option><option v-for="l in store.labels" :key="l" :value="l">{{ l }}</option></select></div>
      <div><label class="label" for="f-start">Tanggal awal</label><input id="f-start" v-model="filter.start" type="date" class="field" /></div>
      <div><label class="label" for="f-end">Tanggal akhir</label><input id="f-end" v-model="filter.end" type="date" class="field" /></div>
      <div class="flex gap-2 sm:col-span-2 lg:col-span-5">
        <button type="submit" class="btn btn-primary">Terapkan filter</button>
        <button type="button" class="btn btn-light" @click="resetFilter">Atur ulang</button>
      </div>
    </form>
  </section>

  <section aria-labelledby="h-list" class="mt-6">
    <h2 id="h-list" class="text-lg font-bold">Daftar transaksi</h2>
    <p v-if="store.isCashFlow" class="mt-2" role="status">Memuat transaksi...</p>
    <p v-else-if="!store.cashFlows.length" class="mt-2 text-slate-700" role="status">Belum ada transaksi.</p>
    <div v-else class="card mt-2 overflow-x-auto" role="region" aria-label="Tabel transaksi">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <caption class="sr-only">Daftar transaksi arus kas</caption>
        <thead class="bg-slate-100 text-slate-800">
          <tr><th scope="col" class="p-3">Label</th><th scope="col" class="p-3">Jenis</th><th scope="col" class="p-3">Sumber</th><th scope="col" class="p-3">Nominal</th><th scope="col" class="p-3">Tanggal</th><th scope="col" class="p-3">Aksi</th></tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="c in store.cashFlows" :key="c.id">
            <th scope="row" class="p-3 font-bold">{{ c.label }}</th>
            <td class="p-3"><span class="rounded-full px-2 py-0.5 font-bold" :class="c.type === 'inflow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">{{ typeLabel(c.type) }}</span></td>
            <td class="p-3">{{ sourceLabel(c.source) }}</td>
            <td class="p-3 font-semibold">{{ formatRupiah(c.nominal) }}</td>
            <td class="p-3">{{ formatDate(c.created_at) }}</td>
            <td class="flex flex-wrap gap-2 p-3">
              <RouterLink :to="`/cash-flows/${c.id}`" class="btn btn-light">Detail<span class="sr-only"> transaksi {{ c.label }}</span></RouterLink>
              <button type="button" class="btn btn-light" @click="editing = c">Ubah<span class="sr-only"> transaksi {{ c.label }}</span></button>
              <button type="button" class="btn btn-danger" @click="remove(c)">Hapus<span class="sr-only"> transaksi {{ c.label }}</span></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <AddModal v-if="showAdd" @close="showAdd = false" @saved="reload" />
  <ChangeModal v-if="editing" :cash-flow="editing" @close="editing = null" @saved="reload" />
</template>