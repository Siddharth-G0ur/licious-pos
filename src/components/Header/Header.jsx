import GridMenu from './GridMenu';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/icons/LiciousLogo.svg" style={{ height: 22, display: 'block' }} alt="Licious" />
        <div className="selected-store">
          <img src="/icons/SelectedStoreIcon.svg" style={{ width: 14, height: 14, display: 'block' }} alt="" />
          <span>OFLSGLI</span>
        </div>
      </div>
      <div className="header-right">
        <GridMenu />
        <div className="profile">
          <span className="username">Ramesh K.</span>
          <div className="profile-circle">RK</div>
        </div>
      </div>
    </header>
  );
}
