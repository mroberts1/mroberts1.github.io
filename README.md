# mroberts1.github.io

Personal site of Martin Roberts: papers, writing, conference talks, courses, and
project pages.

It is an Obsidian vault published as a static site with
[Quartz 5](https://quartz.jzhao.xyz/). The notes in `content/` are the site; the
`.quartz/` directory is the generator. Everything else is scaffolding.

The site was a [Quarto](https://quarto.org/) project until September 2026. It now
shares its design and toolchain with the four teaching vaults
(`digital-culture-fa26`, `marlboro-digital-culture`, `lang-media-arts`,
`fsu-interactive-media-fa26`): Helvetica Neue throughout, a folder-driven
sidebar, and the same light and dark palettes.

## Getting started

Requires Node 22 or later.

```sh
cd .quartz && npm ci && cd ..
./dev.sh
```

That serves the site with hot reload and prints the port it took. Edit anything
under `content/` and the page refreshes.

To open it as a vault, point Obsidian at the repository root, not at `content/`.

`./build.sh` writes the static site to `public/`. You rarely need to: pushing to
`main` builds and deploys through GitHub Actions.

## Layout

```
content/        the notes that become pages, plus their images and video
  projects/     the project and conference-paper pages
  writing/      books, chapters, articles
  conferences/  invited lectures, conference papers
.quartz/        the Quartz 5 install and its config
public/         build output, gitignored
```

Technical notes, conventions, and the things that have already gone wrong are in
[AGENTS.md](AGENTS.md).
