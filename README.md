# Portfolio (React + Vite)

## Patakbuhin

```bash
npm install
npm run dev      # development, http://localhost:5173
npm run build    # production build sa dist/
```

## Mga larawan

Ilagay sa folder na `public/` ang mga image na ito (mga dating nasa tabi ng index.html):

- `me.png`
- `introduction-to-cybersecurity.png`
- `networking-basics.png`

## Structure

```
src/
  data/portfolio.js   <- dito i-edit ang projects, tech stack, links, atbp.
  components/         <- Hero, About, Experience, TechStack, Projects, ...
  hooks/useTheme.js   <- dark/light mode
  index.css           <- ang orihinal mong style.css (walang binago)
  App.jsx, main.jsx
```
