import { h as head, c as attr } from "../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { N as NavHeader } from "../../../chunks/NavHeader.js";
import { B as BackLink } from "../../../chunks/BackLink.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedIds = /* @__PURE__ */ new Set();
    let loading = false;
    const selectedCount = selectedIds.size;
    const canCompare = selectedCount >= 2 && selectedCount <= 50;
    head("1ez3k3s", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Comparar ciudades – Weather Radar</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex flex-col bg-[var(--bg-page)]">`);
    NavHeader($$renderer2, { variant: "standard" });
    $$renderer2.push(`<!----> <main class="flex flex-col gap-8 px-12 py-10">`);
    BackLink($$renderer2, { href: "/" });
    $$renderer2.push(`<!----> <div class="flex flex-col gap-1"><h1 class="font-display font-bold text-[28px] text-[var(--text-primary)]">Comparar ciudades</h1> <p class="font-body text-sm text-[var(--text-secondary)]">Seleccioná las ciudades que querés comparar</p></div> <div class="bg-[var(--bg-card)] rounded-[16px] p-6 flex flex-col gap-4 w-full"><span class="font-display font-bold text-base text-[var(--text-primary)]">Ciudades disponibles</span> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center gap-2"><div class="w-4 h-4 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"></div> <span class="font-body text-sm text-[var(--text-secondary)]">Cargando ciudades…</span></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="flex justify-end"><button${attr("disabled", !canCompare || loading, true)} type="button" class="flex items-center gap-2 text-white rounded-[10px] px-5 py-[10px] font-body text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style="background-color: var(--accent-primary);">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> Comparar</button></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></main></div>`);
  });
}
export {
  _page as default
};
