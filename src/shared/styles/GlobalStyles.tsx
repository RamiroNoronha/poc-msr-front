import { Global, css } from '@emotion/react'

export function GlobalStyles() {
  return (
    <Global
      styles={css`
        :root {
          --bg: #070912;
          --surface: rgba(255, 255, 255, 0.04);
          --surface-strong: rgba(255, 255, 255, 0.07);
          --border: rgba(255, 255, 255, 0.1);
          --text: #f2f4fa;
          --text-muted: #9aa3b8;
          --accent: #7c5cff;
          --accent-2: #22d3ee;
          --danger: #ff6b7a;

          color: var(--text);
          background: var(--bg);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          color-scheme: dark;
        }

        * { box-sizing: border-box; }
        body { min-width: 320px; min-height: 100vh; margin: 0; background: var(--bg); }
        button, input { font: inherit; }
        :focus-visible { outline: 2px solid var(--accent-2); outline-offset: 2px; }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}
    />
  )
}
