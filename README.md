# tanushree_portfolio

This repo contains the source for Tanushree Nepal’s personal portfolio. The landing page is `index.html`, which assembles content from several HTML partials so that individual sections can be updated without editing the main layout.

## Structure

```
├── assets/                 # Images, icons, and downloadable assets
├── css/style.css           # Global styling for the site
├── js/main.js              # Theme toggle + HTML include loader
├── sections/
│   ├── experience.html     # Work experience timeline
│   ├── education.html      # Academic history timeline
│   └── skills.html         # Skills overview cards
├── posts/                  # Long-form blog/articles (e.g., GDP analysis)
└── projects/               # Individual project case-study pages
```

## Editing content

- **Experience / Education / Skills:** Update the corresponding file inside `sections/`. Changes are loaded automatically into `index.html` on page load.
- **Projects section:** Edit the cards in `index.html` for summaries. Detailed write-ups live in `projects/` as standalone HTML pages.
- **Blog posts:** Add or edit HTML files in `posts/` and link them from the Blog / Articles section.

## Development

This is a static site—open `index.html` in a browser or serve the directory with your preferred static file server for local previews.
