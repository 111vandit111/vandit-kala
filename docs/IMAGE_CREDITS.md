# Image credits

Every skill, project, experience and education image is a file in `public/img/<folder>/<slug>.<ext>` and is served from the site itself; nothing is hot-linked from third parties. Only the two personal profile photos (hero and playful portraits) are not in the repo: they are hosted in the owner's Cloudinary account (`vandit-portfolio/profile/`), uploaded with `npm run images:cloudinary -- --file <path> --folder profile`, and their URLs are built in `lib/imageUtils.ts`. Skill, company and school logos are trademarks of their owners and are used only to identify the technology, employer or school. To replace one, overwrite the file with the same name (the file names below are the slugs) and the database and seed keep working.

## Skills (`public/img/skills/<slug>.svg`)

Sources and licences:

- devicon v2.17.0, MIT licence, https://github.com/devicons/devicon (`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/<name>/<name>-original.svg`), used unmodified.
- Simple Icons v16.35.0, CC0 1.0 (icon artwork), https://github.com/simple-icons/simple-icons (`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/<name>.svg`); only a `fill` colour was added and the `<title>` removed. Brand trademarks belong to their owners.
- Generic glyphs: drawn for this project (no logo exists), CC0 / public domain, stroke `#1A98FF`.

| Skill file | Source | Licence |
|---|---|---|
| typescript.svg | devicon `typescript-original` | MIT |
| javascript.svg | devicon `javascript-original` | MIT |
| html5.svg | devicon `html5-original` | MIT |
| css3.svg | devicon `css3-original` | MIT |
| java.svg | devicon `java-original` | MIT |
| python.svg | devicon `python-original` | MIT |
| react-19.svg | devicon `react-original` | MIT |
| redux-toolkit.svg | devicon `redux-original` | MIT |
| rxjs.svg | devicon `rxjs-original` | MIT |
| vite.svg | devicon `vitejs-original` | MIT |
| tailwind-css.svg | devicon `tailwindcss-original` | MIT |
| material-ui.svg | devicon `materialui-original` | MIT |
| scss.svg | devicon `sass-original` | MIT |
| node-js.svg | devicon `nodejs-original` | MIT |
| nest-js.svg | devicon `nestjs-original` | MIT |
| mongodb.svg | devicon `mongodb-original` | MIT |
| gcp.svg | devicon `googlecloud-original` | MIT |
| docker.svg | devicon `docker-original` | MIT |
| git.svg | devicon `git-original` | MIT |
| webpack.svg | devicon `webpack-original` | MIT |
| postman.svg | devicon `postman-original` | MIT |
| jira.svg | devicon `jira-original` | MIT |
| next-js.svg | Simple Icons `nextdotjs` (fill #FFFFFF) | CC0 |
| express-js.svg | Simple Icons `express` (fill #FFFFFF) | CC0 |
| vercel.svg | Simple Icons `vercel` (fill #FFFFFF) | CC0 |
| openai-api.svg | Simple Icons `openai` (fill #FFFFFF) | CC0 |
| algolia.svg | Simple Icons `algolia` (fill #5468FF) | CC0 |
| react-testing-library.svg | Simple Icons `testinglibrary` (fill #E33332) | CC0 |
| shadcn-radix.svg | Simple Icons `shadcnui` (fill #FFFFFF) | CC0 |
| ant-design.svg | Simple Icons `antdesign` (fill #1677FF) | CC0 |
| framer-motion.svg | Simple Icons `framer` (fill #FFFFFF) | CC0 |
| react-flow.svg | Simple Icons `xyflow` (fill #FF0072) | CC0 |
| tanstack-query.svg | Simple Icons `reactquery` (fill #FF4154) | CC0 |
| aws.svg | Simple Icons `amazonaws` (fill #FF9900) | CC0 |
| jest.svg | Simple Icons `jest` (fill #C21325) | CC0 |
| sql.svg | generated glyph | CC0 (own work) |
| zustand.svg | generated glyph | CC0 (own work) |
| html5-video.svg | generated glyph | CC0 (own work) |
| websockets.svg | generated glyph | CC0 (own work) |
| voice-streaming.svg | generated glyph | CC0 (own work) |
| hls-js.svg | generated glyph | CC0 (own work) |
| react-dnd.svg | generated glyph | CC0 (own work) |
| rest-apis.svg | generated glyph | CC0 (own work) |
| accessibility.svg | generated glyph | CC0 (own work) |
| code-reviews.svg | generated glyph | CC0 (own work) |
| agile-scrum.svg | generated glyph | CC0 (own work) |

## Projects (`public/img/projects/<slug>.webp`, 900x900)

| File | Source | Licence |
|---|---|---|
| dsa-visualizer.webp | og:image of https://dsa-visualizer-gamma-six.vercel.app (`/opengraph-image`), scaled and centred on a square canvas | Owner's own project |
| phanroa-ai.webp | screenshot (900x900) of https://phanroa-ai.vercel.app (no og:image published) | Owner's own project |
| the-work-board.webp | screenshot (900x900) of https://the-work-board.vercel.app (no og:image published) | Owner's own project |
| taskkar.webp | logo `public/taskkarLogo.png` from https://github.com/111vandit111/Taskkar centred on navy (live site https://taskkar.vercel.app currently returns HTTP 500 MIDDLEWARE_INVOCATION_FAILED, so no screenshot) | Owner's own project |
| ai-dev-team.webp | plugin icon `plugins/ai-dev-team/.claude-plugin/icon.png` from https://github.com/111vandit111/ai-dev-team centred on navy (no live site, README has no screenshot) | Owner's own project |
| vandit-kala.webp | `log-w.png` (the site's own og:image, https://vandit-kala.vercel.app/log-w.png) centred on navy | Owner's own artwork |

## Experience (`public/img/experience/<slug>.svg`)

| File | Source | Licence |
|---|---|---|
| red-baton.svg | header logo from https://redbaton.digital (redbaton.in redirects there), `rb_header_logo_5796ba71f2.svg` | (c) Red Baton, used to identify the employer |
| northstarz-ai.svg | generated wordmark tile (no downloadable logo file on https://northstarz.ai; its og:image is a product screenshot) | Own work, not the official logo |

## Education (`public/img/education/<slug>.svg`)

| File | Source | Licence |
|---|---|---|
| jain-university.svg | https://www.jainuniversity.ac.in/jain/home/assets/images/jain-logo.png (250x62 PNG) embedded in a white SVG tile | (c) Jain (Deemed-to-be) University, used to identify the school |

