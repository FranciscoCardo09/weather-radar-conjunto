import { h as head, e as escape_html } from "../../../../chunks/root.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { N as NavHeader } from "../../../../chunks/NavHeader.js";
import { B as BackLink } from "../../../../chunks/BackLink.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head("4k4uat", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html("Clima – Weather Radar")}</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen flex flex-col bg-[var(--bg-page)]">`);
    NavHeader($$renderer2, { variant: "standard" });
    $$renderer2.push(`<!----> <main class="flex flex-col gap-8 px-12 py-10">`);
    BackLink($$renderer2, { href: "/" });
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-24"><div class="w-8 h-8 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin"></div></div>`);
    }
    $$renderer2.push(`<!--]--></main></div>`);
  });
}
export {
  _page as default
};
