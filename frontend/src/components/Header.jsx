import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const sunIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>;
const moonIcon = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>;

function Header() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <header className="app-header">
        <div className="header-brand">
            <div 
              className="brand-icon"
            >
              ⛓️
            </div>
            <div className="brand-text">
                <h1>Supply Chain Guardian</h1>
                <span className="subtitle">Multi-Agent Intelligence</span>
            </div>
        </div>
        <div className="header-agents">
            <button 
              id="theme-toggle" 
              className="theme-btn" 
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? moonIcon : sunIcon}
            </button>
            <div className="agent-indicator" data-tooltip="Inventory Agent Online">
                <span className="dot inventory-dot"></span> <span className="agent-label">Inventory Agent</span>
            </div>
            <div className="agent-indicator" data-tooltip="Strategy Agent Online">
                <span className="dot strategy-dot"></span> <span className="agent-label">Strategy Agent</span>
            </div>
            <div className="agent-indicator" data-tooltip="Market Agent Online">
                <span className="dot market-dot"></span> <span className="agent-label">Market Agent</span>
            </div>
        </div>
    </header>
  );
}

export default Header;
