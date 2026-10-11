import { useEffect, useState } from 'react'

// Alterna um painel entre o tamanho normal e "tela cheia"; Esc sai e a rolagem da página fica travada.
export function useExpandable() {
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (!isExpanded) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsExpanded(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded])

  return { isExpanded, toggle: () => setIsExpanded((current) => !current) }
}
