import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <div className="app-header__logo-wrapper">
          <img src="/logo.svg" alt="Tecnimatica" className="app-header__logo" />
        </div>
        <span className="app-header__title">Monitoreo de Sensores</span>
      </Link>
    </header>
  );
}
