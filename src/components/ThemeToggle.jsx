export default function ThemeToggle({ theme, onToggle }) {
  return (
    <div className="theme-toggle-wrapper">
      <div
        className="theme-toggle"
        id="themeToggle"
        onClick={onToggle}
        role="button"
        aria-label="Toggle dark mode"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="theme-toggle-slider">
          <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
        </div>
      </div>
    </div>
  );
}