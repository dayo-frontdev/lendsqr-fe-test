import SearchBar from "../../assets/Search-icon.png";
import lendsqrLogo from "../../assets/lendsqr.svg";
import unionLogo from "../../assets/Unionlogo.png";
import NoticeBell from "../../assets/bell.png";
import Avatar from "../../assets/avatar.png";
import dropdown from "../../assets/np_dropdown.png";
import style from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import type { DashboardType } from "../../components/NavigatinonType";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";

const Dashboard: React.FC<DashboardType> = ({ currentTask, setTask }) => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState(false);
  const [sideBarDrop, setDrop] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    !isMobile ? setDrop(true) : setDrop(false);
  }, [isMobile]);

  const dropDownIcon = clsx({
    [style.rotate]: openMenu,
    [style.dropIcon]: true,
  });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };
  const hamburgerStyle = clsx(style.hamburgerBtn, {
    [style.hamburger]: !sideBarDrop,
    [style.closeBar]: sideBarDrop,
  });
  const Mobilehamburger = (
    <button
      aria-label="mobile sidebar"
      onClick={(e) => {
        e.preventDefault();
        setDrop((prev) => !prev);
      }}
      className={hamburgerStyle}
    >
      <span className={style.line}></span>
      <span className={style.line}></span>
      <span className={style.line}></span>
    </button>
  );

  const styleLeft = clsx({
    [style.LeftContainer]: sideBarDrop || !isMobile,
    [style.LeftContainerMobile]: isMobile,
  });

  return (
    <main className={style.DashboardStyle}>
      <header className={style.Header}>
        <section className={styleLeft}>
          {isMobile && !sideBarDrop && Mobilehamburger}
          {isMobile && !sideBarDrop ? (
            <img
              className={style.mobileLogo}
              src={unionLogo}
              alt="mobile-logo"
            />
          ) : (
            <img className={style.Logo} src={lendsqrLogo} alt="desktop-logo" />
          )}
          <form id="search" className={style.SearchWrapper}>
            <input
              className={style.SearchField}
              name="search"
              id="search"
              placeholder="Search for anything"
              type="text"
            />
            <button aria-label="search button" className={style.SearchButton}>
              <img
                className={style.SearchIcon}
                src={SearchBar}
                alt="search-icon"
              />
            </button>
          </form>
        </section>
        <section>
          <p className={style.Doc}>Docs</p>
          <img
            className={style.Notification}
            src={NoticeBell}
            alt="Notice-icon"
          />
          <button
            aria-label="Profile-picture"
            onClick={() => setOpenMenu((prev) => !prev)}
            className={style.AvatarButton}
          >
            <img className={style.Avatar} src={Avatar} alt="avater-icon" />
          </button>
          <div className={style.MenuWrapper}>
            <button
              aria-label="Profile-name"
              onClick={() => setOpenMenu((prev) => !prev)}
              className={style.MenuButton}
            >
              <span className={style.MenuNameSpanFull}>Adedeji</span>
              <span className={style.MenuNameSpanShort}>A</span>
              <img className={dropDownIcon} src={dropdown} alt="drop-arrow" />
            </button>
            {openMenu && (
              <ul className={style.MenuList}>
                <li className={style.ProfileMenu}>
                  <button aria-label="Logout" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </section>
      </header>

      {sideBarDrop && isMobile && (
        <section className={style.mobileSideBar}>
          <SideBar
            currentTask={currentTask}
            setTask={setTask}
            Mobilehamburger={Mobilehamburger}
            isMobile={isMobile}
          />
        </section>
      )}
      <section className={style.GridView}>
        {sideBarDrop && !isMobile && (
          <SideBar
            currentTask={currentTask}
            setTask={setTask}
            Mobilehamburger={Mobilehamburger}
            isMobile={isMobile}
          />
        )}

        <Outlet />
      </section>
    </main>
  );
};

export default Dashboard;
