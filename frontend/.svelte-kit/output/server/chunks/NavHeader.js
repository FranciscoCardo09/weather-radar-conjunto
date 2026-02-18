import { g as getContext, s as sanitize_props, d as rest_props, f as fallback, i as attributes, j as clsx, k as ensure_array_like, l as element, b as slot, m as bind_props, a as spread_props, n as store_get, o as attr_style, p as attr_class, u as unsubscribe_stores } from "./root.js";
import "clsx";
import "@sveltejs/kit/internal";
import { w as writable } from "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Icon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "name",
    "color",
    "size",
    "strokeWidth",
    "absoluteStrokeWidth",
    "iconNode"
  ]);
  $$renderer.component(($$renderer2) => {
    let name = fallback($$props["name"], void 0);
    let color = fallback($$props["color"], "currentColor");
    let size = fallback($$props["size"], 24);
    let strokeWidth = fallback($$props["strokeWidth"], 2);
    let absoluteStrokeWidth = fallback($$props["absoluteStrokeWidth"], false);
    let iconNode = fallback($$props["iconNode"], () => [], true);
    const mergeClasses = (...classes) => classes.filter((className, index, array) => {
      return Boolean(className) && array.indexOf(className) === index;
    }).join(" ");
    $$renderer2.push(`<svg${attributes(
      {
        ...defaultAttributes,
        ...$$restProps,
        width: size,
        height: size,
        stroke: color,
        "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        class: clsx(mergeClasses("lucide-icon", "lucide", name ? `lucide-${name}` : "", $$sanitized_props.class))
      },
      void 0,
      void 0,
      void 0,
      3
    )}><!--[-->`);
    const each_array = ensure_array_like(iconNode);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [tag, attrs] = each_array[$$index];
      element($$renderer2, tag, () => {
        $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
      });
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></svg>`);
    bind_props($$props, {
      name,
      color,
      size,
      strokeWidth,
      absoluteStrokeWidth,
      iconNode
    });
  });
}
function Cloud_sun($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }],
    ["path", { "d": "M15.947 12.65a4 4 0 0 0-5.925-4.128" }],
    [
      "path",
      { "d": "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "cloud-sun" },
    $$sanitized_props,
    {
      /**
       * @component @name CloudSun
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMnYyIiAvPgogIDxwYXRoIGQ9Im00LjkzIDQuOTMgMS40MSAxLjQxIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im0xOS4wNyA0LjkzLTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMTUuOTQ3IDEyLjY1YTQgNCAwIDAgMC01LjkyNS00LjEyOCIgLz4KICA8cGF0aCBkPSJNMTMgMjJIN2E1IDUgMCAxIDEgNC45LTZIMTNhMyAzIDAgMCAxIDAgNloiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/cloud-sun
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
function Moon($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]];
  Icon($$renderer, spread_props([
    { name: "moon" },
    $$sanitized_props,
    {
      /**
       * @component @name Moon
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgM2E2IDYgMCAwIDAgOSA5IDkgOSAwIDEgMS05LTlaIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/moon
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
function Sun($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "4" }],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M12 20v2" }],
    ["path", { "d": "m4.93 4.93 1.41 1.41" }],
    ["path", { "d": "m17.66 17.66 1.41 1.41" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "M20 12h2" }],
    ["path", { "d": "m6.34 17.66-1.41 1.41" }],
    ["path", { "d": "m19.07 4.93-1.41 1.41" }]
  ];
  Icon($$renderer, spread_props([
    { name: "sun" },
    $$sanitized_props,
    {
      /**
       * @component @name Sun
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI0IiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTEyIDIwdjIiIC8+CiAgPHBhdGggZD0ibTQuOTMgNC45MyAxLjQxIDEuNDEiIC8+CiAgPHBhdGggZD0ibTE3LjY2IDE3LjY2IDEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJNMiAxMmgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIiAvPgogIDxwYXRoIGQ9Im02LjM0IDE3LjY2LTEuNDEgMS40MSIgLz4KICA8cGF0aCBkPSJtMTkuMDcgNC45My0xLjQxIDEuNDEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/sun
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
const dark = writable(false);
function NavHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { variant = "standard" } = $$props;
    const isHome = store_get($$store_subs ??= {}, "$page", page).url.pathname === "/";
    const isCompare = store_get($$store_subs ??= {}, "$page", page).url.pathname === "/compare";
    if (variant === "home") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<header class="flex items-center justify-between h-16 px-12 w-full" style="background-color: var(--home-header-bg);"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg flex items-center justify-center" style="background-color: rgba(255,255,255,0.12);">`);
      Cloud_sun($$renderer2, { size: 18, color: "white" });
      $$renderer2.push(`<!----></div> <span class="font-display font-bold text-lg text-white">Weather Radar</span></div> <div class="flex items-center gap-2"><a href="/" class="font-body text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors"${attr_style(isHome ? "background-color: rgba(255,255,255,0.12);" : "")}>Ciudades</a> <a href="/compare" class="font-body text-sm font-medium text-white px-4 py-2 rounded-lg transition-colors"${attr_style(isCompare ? "background-color: rgba(255,255,255,0.12);" : "")}>Comparar</a> <button class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors" style="background-color: rgba(255,255,255,0.08);" aria-label="Cambiar tema" type="button">`);
      if (store_get($$store_subs ??= {}, "$dark", dark)) {
        $$renderer2.push("<!--[-->");
        Sun($$renderer2, { size: 16, color: "white" });
      } else {
        $$renderer2.push("<!--[!-->");
        Moon($$renderer2, { size: 16, color: "white" });
      }
      $$renderer2.push(`<!--]--></button></div></header>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<header class="flex items-center justify-between h-[72px] px-12 w-full border-b border-[var(--border-standard)] bg-[var(--bg-page)]"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-[10px] bg-[var(--accent-primary)] flex items-center justify-center">`);
      Cloud_sun($$renderer2, { size: 18, color: "white" });
      $$renderer2.push(`<!----></div> <span class="font-display font-bold text-[20px] text-[var(--text-primary)]">Weather Radar</span></div> <div class="flex items-center gap-2"><a href="/"${attr_class("font-body text-sm font-medium text-[var(--text-secondary)] px-4 py-2 rounded-[10px] transition-colors hover:bg-[var(--bg-card)]", void 0, {
        "bg-[var(--bg-card)]": isHome,
        "text-[var(--text-primary)]": isHome
      })}>Ciudades</a> <a href="/compare"${attr_class("font-body text-sm font-medium text-[var(--text-secondary)] px-4 py-2 rounded-[10px] transition-colors hover:bg-[var(--bg-card)]", void 0, {
        "bg-[var(--accent-primary-soft)]": isCompare,
        "text-[var(--accent-primary)]": isCompare
      })}>Comparar</a> <button class="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-colors" aria-label="Cambiar tema" type="button">`);
      if (store_get($$store_subs ??= {}, "$dark", dark)) {
        $$renderer2.push("<!--[-->");
        Sun($$renderer2, { size: 16, class: "text-[var(--text-secondary)]" });
      } else {
        $$renderer2.push("<!--[!-->");
        Moon($$renderer2, { size: 16, class: "text-[var(--text-secondary)]" });
      }
      $$renderer2.push(`<!--]--></button></div></header>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  Icon as I,
  NavHeader as N
};
