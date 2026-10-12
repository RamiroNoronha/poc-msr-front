import styled from '@emotion/styled'

export const Wrapper = styled.div`
  display: grid;
  gap: 0.75rem;
`

export const Breadcrumb = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  min-height: 2rem;
  padding-right: 8rem;
  font-size: 0.875rem;

  i { margin-right: 0.25rem; color: var(--text-muted); font-style: normal; }

  button {
    padding: 0.2rem 0.5rem;
    border: 0;
    border-radius: 0.4rem;
    color: var(--text);
    background: transparent;
    cursor: pointer;
  }

  button:hover:not(:disabled) { background: var(--surface-strong); }
  button:disabled { color: var(--text-muted); cursor: default; }
`

export const UpButton = styled.button`
  margin-left: 0.5rem;
  border: 1px solid var(--border) !important;
`

export const Svg = styled.svg`
  display: block;
  width: 100%;
  max-height: var(--chart-max-height, 80vh);
  height: auto;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.25);
  cursor: zoom-out;
`

export const Folder = styled.circle`
  fill: rgba(255, 255, 255, 0.025);
  stroke: rgba(255, 255, 255, 0.16);
  cursor: inherit;
  transition: stroke 0.15s;

  &[data-zoomable] { cursor: zoom-in; }
  &:hover { stroke: rgba(196, 181, 253, 0.8); }
`

export const Leaf = styled.circle`
  cursor: inherit;

  &[data-zoomable] { cursor: zoom-in; }
`

export const Label = styled.text`
  fill: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  paint-order: stroke;
  stroke: rgba(7, 9, 18, 0.55);
  stroke-width: 2px;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`

export const FolderLabel = styled.text`
  fill: var(--text);
  font-size: 12px;
  font-weight: 600;
  paint-order: stroke;
  stroke: rgba(7, 9, 18, 0.85);
  stroke-width: 3px;
  text-anchor: middle;
  pointer-events: none;
`

export const Details = styled.p`
  display: grid;
  gap: 0.15rem;
  min-height: 3.6rem;
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8125rem;

  strong { color: var(--text); font-weight: 600; word-break: break-all; }
`
