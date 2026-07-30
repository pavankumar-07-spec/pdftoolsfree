# FreeToolsPDF

407 free, client-side browser tools (PDF, image, text, calculators, converters, generators, math) — pure static HTML/CSS/JS, no backend, no build step required to run.

## Status
✅ All 407 tools pass structural audit (every HTML id the JS looks for actually exists on the page)
✅ No duplicate ids, no JS syntax errors
✅ External libraries (pdf-lib, JSZip, jsPDF, QRCode, JsBarcode, XLSX, mammoth) are loaded via CDN on the pages that need them
✅ Domain references (CNAME, robots.txt, canonical tags, sitemap) are consistent: **pdftoolsfree.in**

See `FIX_SUMMARY.md` (in the chat deliverables, not part of this repo) for the full history of what was fixed and known polish items still worth a manual pass.

## Deploying (Cloudflare Pages — canonical path)

This project is deployed via **Cloudflare Pages**, connected to this GitHub repo.
Full step-by-step instructions (one-time setup + the ongoing GitHub Desktop
commit/push workflow) are in **[`DEPLOY_CLOUDFLARE.md`](./DEPLOY_CLOUDFLARE.md)**.

Short version: edit locally → commit & push via GitHub Desktop → Cloudflare Pages
auto-redeploys on every push. No manual upload, no separate build step.

The `_headers` and `_redirects` files in the repo root are Cloudflare Pages
conventions, picked up automatically on deploy — see `DEPLOY_CLOUDFLARE.md` for
what each one does.

### Alternative: GitHub Pages
This repo *can* also be deployed via GitHub Pages instead of/in addition to
Cloudflare, though that isn't the current setup:
1. Push this repo's contents to your GitHub repo's default branch (e.g. `main`).
2. In GitHub: **Settings → Pages → Build and deployment → Source → Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`.
4. The `CNAME` file (containing `pdftoolsfree.in`) is a GitHub Pages convention —
   it's ignored by Cloudflare Pages, so it's only relevant if you switch to this
   option. If deploying to a GitHub *project* page (`username.github.io/repo`)
   without a custom domain, delete `CNAME` first, since the root-absolute asset
   paths (`/icons/...`, `/_assets/...`) won't resolve correctly without either a
   custom domain or path rewriting.

## Important: root-absolute paths
Every page references assets with root-absolute paths (`/_assets/page.*.js`, `/icons/*`, `/fonts/*`, `/css/*`). This works cleanly when:
- Deployed at a domain root (custom domain via `CNAME`, or a GitHub user/org page `username.github.io`), **or**
- Deployed behind a reverse proxy that serves the repo at `/`.

It will **not** resolve correctly out of the box on a GitHub *project* page served at `username.github.io/repo-name/` without either a custom domain or rewriting every root-absolute path to be repo-relative. If you don't plan to use `pdftoolsfree.in` (or another custom domain), let me know and I can rewrite the paths to be relative.

## Local preview
No build step needed — just serve the folder statically, e.g.:
```bash
npx serve .
# or
python3 -m http.server 8000
```
Then open `http://localhost:8000` (or the port `serve` gives you).

## Dev scripts
`dev-scripts/` (gitignored, not deployed) contains the audit/fix tooling used to bring every tool up to a working state:
- `full_audit.js` — re-run any time to confirm every tool's HTML/JS wiring is intact (`node dev-scripts/full_audit.js`)
- `auto_fix.js` — the heuristic field-generator that wired up previously-broken tools
- `polish_numeric.js` — upgrades number-like text inputs to `type="number"`
- `patch_cdn_libs.js` — injects missing CDN `<script>` tags for pdf-lib/JSZip/jsPDF/QRCode/JsBarcode/XLSX/mammoth where a tool's JS needs them
- `check_links.js`, `classify_stubs.js`, `unify_footer.js`, etc. — earlier one-off maintenance scripts, kept for reference

## Known remaining polish items (not blocking, worth a manual pass)
- A handful of numeric fields (password length/count, QR error-correction level) render as plain text inputs instead of number spinners / dropdowns because the source JS reads their value through a defensive fallback pattern the auto-fixer didn't parse. They work correctly; the UX is just a notch less polished.
- Auto-generated field labels are derived from element ids (e.g. `card-name` → "Card Name") — clear but generic; consider a copy pass on your highest-traffic tools.
- No automated *runtime* (headless browser) testing was performed — this audit is static analysis (confirms every element referenced by JS exists in the DOM, libraries are loaded, no syntax errors). A spot-check pass in an actual browser across categories is recommended before a big traffic push.
