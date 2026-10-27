import { THEME_LABELS, type ThemeChoice } from '../lib/useTheme'

export function ThemeButton({ choice, onClick }: { choice: ThemeChoice; onClick: () => void }) {
  const label = THEME_LABELS[choice]
  const aria = `Tema: ${label}. Clique para trocar`
  return (
    <button type="button" className="theme-btn" onClick={onClick} aria-label={aria} title={aria}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {choice === 'auto' && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" />
            <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
          </>
        )}
        {choice === 'claro' && (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
        {choice === 'escuro' && <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
      </svg>
      <span>{label}</span>
    </button>
  )
}
