# GitProfileMaker

Generate a polished GitHub profile README and preview any public GitHub account in one place. Fork it, customize the templates, and share your profile in minutes.

## Features
- Search any GitHub username and view key profile stats, bio, join date, social links, and gists.
 - Inline rendering of the user's profile README (supports Markdown + HTML/badges via `remark-gfm` + `rehype-raw`).
- Repository browser with stars/forks, language, description, and last-updated badges.
- README generator with three badge-rich templates you can edit (`readme-templates/`), preview, and download.
- Modern UI built with Next.js, React Tabs, and React Markdown.

## Tech stack
- Next.js 14, React 18
- react-markdown + remark-gfm + rehype-raw
- react-tabs

## Getting started
1) Install deps
```bash
npm install
```
2) Run the dev server
```bash
npm run dev
```
3) Open http://localhost:3000 and search for any GitHub username.

### Scripts
- `npm run dev` – start Next.js in dev mode
- `npm run build` – production build
- `npm run start` – run the built app
- `npm run lint` – lint checks

## Templates
Editable Markdown templates live in `readme-templates/` with paired `*-preview.md` files. Available placeholders:
`{username}`, `{name}`, `{bio}`, `{repos}`, `{followers}`, `{following}`, `{languages}`, `{repoList}`

## Notes on GitHub API limits
The app uses public GitHub REST endpoints without a token. Heavy use can hit rate limits; if you need higher limits, wire up authentication in `pages/api/getProfile.js`.

## Contributing
1) Fork the repo  
2) Create a feature branch (`git checkout -b feature/my-change`)  
3) Commit with clear messages and open a PR  
4) Include screenshots for UI changes when possible  

## Roadmap ideas
- Optional authenticated GitHub requests for higher rate limits
- Language stats sourced per repo
- More starter templates and theming options
