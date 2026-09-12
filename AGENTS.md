# AGENTS.md

Technical notes for agents working on this Obsidian vault, which is published as
a static site with Quartz 5. Human-facing orientation lives in `README.md`.

The vault was converted from the Quarto site that previously lived in this repo
(commit `b470d8a` and earlier). The Quartz install, scripts, workflow and theme
were copied from `~/Obsidian/digital-culture-fa26`, so most of the structural
notes below carry over from that vault's `AGENTS.md` and its siblings
(`marlboro-digital-culture`, `lang-media-arts`, `fsu-interactive-media-fa26`).

## Layout

```
./              Obsidian vault root (this is what Obsidian actually opens)
  content/      what Quartz builds from. Notes and their assets go here
  .quartz/      the Quartz 5 install, hidden from Obsidian
  public/       build output, gitignored, safe to delete
```

## Page mapping from the Quarto site

| Quartz page                            | Quarto source          |
| -------------------------------------- | ---------------------- |
| `index.md`                             | `index.qmd`            |
| `projects/*.md`                        | the 11 project `.qmd`s |
| `writing/{books,book-chapters,articles,other-publications}.md` | same-named `.qmd`s |
| `conferences/{invited,conference-papers}.md` | `invited.qmd`, `conferences.qmd` |
| `papers.md` `courses.md` `blogs.md` `events.md` `bio.md` `contact.md` | same-named `.qmd`s |

Two pages were renamed so the explorer label reads as the page rather than the
conference: `jaspm-2012.qmd` became `projects/videogame-subcultures.md`, and
`other-articles.qmd` became `writing/other-publications.md` (its title was
already "Other Publications").

The Quarto sidebar's three groups (Selected Projects, Writing, Conferences)
became the three folders. Quartz's explorer builds nav from the folder tree, so
grouping is structural here, not configured.

Quarto constructs that had no Quartz equivalent:

- `::: {layout="[[60, 40]]"}` column layouts in `blogs.md` and `books.md`.
  Quartz has no column layout; the image and its caption now stack, separated
  by `---` rules.
- `{{< fa brands github >}}` shortcodes became `<i class="fa-brands fa-github">`,
  matching the sibling vaults. Codepoints live in `custom.scss`; see below.
- `{width=100%}` image attributes became raw `<img width>`, because these are
  images wrapped in links and the Obsidian `![[file|500]]` sizing form cannot
  nest inside a link.
- `{.lightbox}` on `tropical-dandies.md`. The `quartz-image-zoom` plugin gives
  every image click-to-zoom, so the attribute was dropped; the `description=`
  text became a `<small>` caption below the image.

## Assets are folder-local

Everything the site serves must live under `content/`; Quartz only globs the
directory passed via `-d`, and `../` does not escape it (Quartz normalises it
away, so the path emits as `././img/x.jpg` and 404s).

Because markdown image paths resolve relative to the page, each folder keeps its
own `img/`: `content/img/`, `content/projects/img/`, `content/projects/video/`,
`content/writing/img/`. `twilighting8.png` and `imagine.jpg` are deliberately
duplicated between `content/img/` and `content/projects/img/` — both folders use
them, and a copy costs less than a fragile relative path.

`content/pdf/113067eng.pdf` came over from the Quarto site and is not linked
from any page. Left in place rather than deleted.

## Running it

Use the scripts, never `npx quartz`. The repo's own bin is not linked into
`node_modules/.bin`, so npx falls through to an unrelated `quartz` package on
the registry (v0.0.1, a transmission-daemon client).

| Task            | Command                           |
| --------------- | --------------------------------- |
| Serve with HMR  | `./dev.sh` (8080, ws 3003)        |
| Build to public | `./build.sh`                      |
| Override ports  | `PORT=8081 WS_PORT=3004 ./dev.sh` |

Both scripts work from any directory.

`.quartz/.node-version` pins `v22.16.0`, which nodenv here does not have
installed. `./dev.sh` then dies with `nodenv: version 'v22.16.0' is not
installed` before reaching Quartz. Work around it per-run with
`NODENV_VERSION=22.23.2 ./dev.sh`. That file belongs to the vendored Quartz
tree, so prefer the env var over editing it. Quartz only requires node >= 22.

Quartz does not fail when its requested port is busy; it increments and prints
the port it actually took. Read the "Started a Quartz server listening at" line
rather than assuming 8080.

## Gotchas that cost real time

Adding a new asset file needs a server restart. Incremental rebuilds pick up
markdown edits but do not copy newly added non-markdown files. The symptom is an
`<img>` that renders while the file itself 404s.

A YAML frontmatter error kills the whole dev server, not just the page. It
prints `Failed to process markdown` and exits, so the port goes dead. Body-text
errors do not do this. The recurring trigger is an unquoted colon in a title,
which YAML reads as a nested mapping — quote it.

The hot-reload client never reconnects. Quartz's injected websocket has no
`onclose` handler, so a tab open across a server restart holds a dead socket
forever and never refreshes. Hard-reload after restarting.

Deleting a file while the server runs can poison the rebuild: the pending delete
is retried every rebuild and fails with `ENOENT ... unlink '../public/...'`,
blocking all further rebuilds. Restart to clear it.

Never run `build.sh` while `dev.sh` is running. Both write to `public/` and
`build.sh` cleans it first. The symptom is a server that still answers 200 with
stale content but silently stops picking up edits.

Open Obsidian on the project root, not on `content/`, matching the sibling
vaults.

`.obsidian/` is tracked here (unlike the sibling vaults, which gitignore it)
minus the plugins carrying credentials. It was copied from
`digital-culture-fa26` so the editor matches: Plastic Labs theme, Departure Mono
for interface, text and monospace, and the `minimal`, `videoContainer` and
`banner-image` snippets. `attachmentFolderPath` is `content/img` and
`newFileFolderPath` is `content`, so new notes and pasted images land where
Quartz can see them rather than at the vault root.

Three plugins were deliberately not copied and must be installed and configured
per-vault if wanted:

- `readwise-official` and `obsidian-local-rest-api`, whose `data.json` files in
  the source vault hold a live Readwise token and an API key plus a keypair.
- `mcp-tools`, a 58MB binary that would need its own reconfiguration here.

`smart-connections` was also skipped; it pairs with the gitignored `.smart-env/`
embeddings cache.

## Configuration

Prefer `.quartz/quartz.config.yaml` over patching vendored Quartz source, since
config survives an upgrade. Everything the YAML cannot express lives in
`.quartz/quartz/styles/custom.scss`: the self-hosted fonts, a tighter heading
scale, wrapped code blocks, a card grid for folder listings, the `[!custom]`
callout, underlined body links, and the print stylesheet.

Departure Mono is the header, body and code face. It is not on Google Fonts, so
every build logs a failed fetch for it. That is expected and harmless; the
`@font-face` in `custom.scss` is what actually loads it, from
`.quartz/quartz/static/fonts/`. The paths there are relative, not
root-absolute, and must stay that way.

Font Awesome is self-hosted the same way, with only the two subsets used.
Codepoints are read from a real Font Awesome `all.css`, not guessed. Currently
declared: envelope, mastodon, github, twitter, facebook.

Deviations from the sibling vaults' stock config, all in `quartz.config.yaml`:

- `baseUrl` is `mroberts1.github.io` with no subpath. This is a GitHub user
  site served from the domain root, unlike the course sites, which are project
  sites under `/<repo>/`.
- `citations` is disabled. There is no bibliography here, and left enabled it
  aborts every build with `Cannot read non valid bibliography URL in node env`.
- `footer.links` point at the personal accounts rather than the Quartz project
  defaults.
- Inherited from `digital-culture-fa26` and worth revisiting for a personal
  site: `backlinks`, `graph`, `page-title` and `og-image` are all disabled.
  `backlinks` was turned off there because course week pages all linked back to
  the syllabus; that reason does not apply here.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every
push to `main`. It runs `npm ci` in `.quartz/`, then `npm run install-plugins`
(git-sourced plugins land in the gitignored `.quartz/.quartz/plugins/` and the
build command does not fetch them; dropping this step yields a green build with
the plugin silently missing), then the same build command as `build.sh`, then
`upload-pages-artifact` on `public/`.

**This is not yet live.** GitHub Pages for this repo is still set to
`build_type: legacy` from the `gh-pages` branch, left over from the Quarto site.
The workflow will not deploy until the Pages source is switched to GitHub
Actions:

```
gh api -X PUT repos/mroberts1/mroberts1.github.io/pages -f build_type=workflow
```

Once switched, the stale `gh-pages` branch can be deleted.

Because a push is a deploy, do not commit or push while iterating. Work locally
against `./dev.sh` and let the user decide when to publish.

Live at https://mroberts1.github.io/
Repo: https://github.com/mroberts1/mroberts1.github.io

## Plugins installed from git

`quartz-image-zoom` (lightbox on click) is installed from
`github:vazome/quartz-image-zoom`, pinned in `.quartz/quartz.lock.json`.

Install with the bootstrap CLI, not npx:
`node ./quartz/bootstrap-cli.mjs plugin add github:<owner>/<repo>` from
`.quartz/`. Git plugins install to `.quartz/.quartz/plugins/`, not
`.quartz/plugins/`: the loader joins `process.cwd()` with `.quartz/plugins` and
the CLI already runs from `.quartz/`, so the path doubles up.

## Keeping this file current

Update it when the structure, the build, the deploy path or a hard-won gotcha
changes. Content edits under `content/` do not need an entry here.
