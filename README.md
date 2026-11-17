# Bishal Khand Thakuri — Personal Website

A personal introduction / CV / portfolio site with a blog, built with **Jekyll**
(GitHub Pages builds it for you — no tools to install) and plain HTML, CSS, and
JavaScript. No frameworks, no dependencies.

---

## 1. Publish it on GitHub (one time)

> **Repo rule:** this folder is the *entire* website project. Only website files go
> into the repository — no `main.tex`, no `me.txt`, no stray photos.

1. Create a new repository on GitHub named exactly:
   **`Bishalai.github.io`** (Public).
   - This makes the site live at `https://bishalai.github.io`.
   - *(If you prefer a project repo like `portfolio`, the site will live at
     `https://bishalai.github.io/portfolio` — in that case open `_config.yml` and set
     `baseurl: "/portfolio"`.)*
2. Do **not** add a README, `.gitignore`, or license on GitHub — leave the repo empty.
3. Push this folder from your computer:

   ```bash
   cd "D:\Programming\projects\github website\website"
   git init -b main
   git add .
   git commit -m "Initial site commit"
   git remote add origin https://github.com/Bishalai/Bishalai.github.io.git
   git push -u origin main
   ```

4. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → Branch: `main` / `(root)` → Save.**
5. Wait ~1 minute, then open **https://bishalai.github.io**.

---

## 2. How to update and edit

### Easiest: edit directly in the browser (no tools needed)

Open your repo on GitHub → navigate to the file → click the **pencil icon** →
edit → **Commit changes**. The site rebuilds itself in under a minute.

### From your computer

```bash
git add .
git commit -m "Describe what you changed"
git push
```

### Where things live

| What you want to change        | File                                        |
| ------------------------------ | ------------------------------------------- |
| Name / intro / projects / CV   | `index.html`                                |
| Skills list                    | `index.html` → section `Skills`             |
| Portrait photo                 | `assets/img/portrait.jpg`                   |
| Contact email / GitHub / LinkedIn | `index.html`, `_layouts/default.html`    |
| Colours, fonts, spacing        | `assets/css/style.css` (the `:root` block)  |
| Blog listing page              | `blog/index.html`                           |
| Footer, header, nav            | `_layouts/default.html`                     |
| Site title, URL, description   | `_config.yml`                               |

**Colour themes:** the palette is defined twice at the top of
`assets/css/style.css` — `:root` (light "paper") and `[data-theme="ink"]` (dark).
Edit those values to rebrand the whole site.

---

## 3. Writing a blog post

1. On GitHub: **Add file → Create new file**.
2. Name it `_posts/YYYY-MM-DD-your-title-slug.md`
   (example: `_posts/2026-11-17-my-first-note.md`).
3. Paste this template and write:

   ```markdown
   ---
   layout: post
   title: "Your post title"
   date: 2026-11-17
   tags: [topic, another-topic]
   description: One sentence shown in the listing.
   ---

   Your first paragraph — it becomes the excerpt.

   ## Subheading

   Write in **Markdown**: `**bold**`, `*italic*`, `# headings`, `- lists`,
   `> quotes`, and fenced code blocks with ```` ``` ````.
   ```

4. Commit. The post appears at `https://bishalai.github.io/blog/your-title-slug/`
   and on the homepage automatically.

Two sample posts are already in `_posts/` — edit them or delete them.

---

## 4. Design notes

- **Type:** Fraunces (display serif), Inter (body), IBM Plex Mono (labels).
- **Palette:** warm paper `#f5f3ee` / ink `#0f1216`, accent navy `#004f90`.
- **Interactions:** animated contour-line hero that reacts to the cursor,
  light/dark theme toggle, project accordions, scroll-drawn education timeline,
  scroll reveals, copy-email button, reading progress bar.
- **Accessibility:** keyboard-friendly, `prefers-reduced-motion` respected,
  semantic landmarks, visible focus rings.
- **Contact:** email, GitHub, and LinkedIn only — no phone number is published.

## Local preview (optional)

Requires Ruby + Bundler:

```bash
bundle install
bundle exec jekyll serve
# → http://localhost:4000
```

You never need this — GitHub builds the site for you on every push.
