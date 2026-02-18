import { s as sanitize_props, a as spread_props, b as slot, e as escape_html, c as attr, h as head } from "../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { I as Icon, N as NavHeader } from "../../chunks/NavHeader.js";
function Arrow_right($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M5 12h14" }],
    ["path", { "d": "m12 5 7 7-7 7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-right" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowRight
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJtMTIgNSA3IDctNyA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-right
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Circle_check_big($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M21.801 10A10 10 0 1 1 17 3.335" }],
    ["path", { "d": "m9 11 3 3L22 4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-check-big" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleCheckBig
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuODAxIDEwQTEwIDEwIDAgMSAxIDE3IDMuMzM1IiAvPgogIDxwYXRoIGQ9Im05IDExIDMgM0wyMiA0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/circle-check-big
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function CompareBar($$renderer, $$props) {
  let { count } = $$props;
  const disabled = count < 2;
  $$renderer.push(`<div class="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-between px-12 bg-[var(--home-card-bg)]" style="border-top: 1px solid var(--home-border); z-index: 50;"><div class="flex items-center gap-[10px]">`);
  Circle_check_big($$renderer, { size: 18, class: "text-[var(--airforce-blue)]" });
  $$renderer.push(`<!----> <span class="font-body text-sm font-medium text-[var(--home-text-dark)]">${escape_html(count)} ${escape_html(count === 1 ? "ciudad seleccionada" : "ciudades seleccionadas")}</span></div> <button${attr("disabled", disabled, true)} type="button" class="flex items-center gap-2 text-white rounded-[10px] px-6 py-[10px] font-body text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed" style="background-color: var(--yale-blue);">`);
  Arrow_right($$renderer, { size: 16 });
  $$renderer.push(`<!----> <span>Comparar</span></button></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let cities = [];
    let selectedIds = /* @__PURE__ */ new Set();
    const selectedCount = selectedIds.size;
    const showCompareBar = selectedCount >= 1;
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Ciudades – Weather Radar</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex flex-col" style="background-color: var(--home-bg);">`);
    NavHeader($$renderer2, { variant: "home" });
    $$renderer2.push(`<!----> <main class="flex-1 flex flex-col gap-8 px-12 py-10 pb-24"><div class="flex items-end justify-between w-full"><div class="flex flex-col gap-2"><h1 class="font-display font-bold text-[32px] text-[var(--home-text-dark)]">Ciudades</h1> <p class="font-body text-sm text-[var(--home-text-light)]">Seleccioná ciudades para ver el clima o compararlas entre ellas</p></div> <div class="flex items-center gap-[6px] rounded-[20px] px-[14px] py-[6px]" style="background-color: var(--yale-blue-soft);"><span class="font-body text-sm font-medium text-[var(--airforce-blue)]">${escape_html(cities.length)} ciudades</span></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-24"><div class="w-8 h-8 rounded-full border-2 border-[var(--airforce-blue)] border-t-transparent animate-spin"></div></div>`);
    }
    $$renderer2.push(`<!--]--></main> `);
    if (showCompareBar) {
      $$renderer2.push("<!--[-->");
      CompareBar($$renderer2, { count: selectedCount });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
