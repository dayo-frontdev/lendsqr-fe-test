import { useNavigate } from "react-router-dom";
import Org from "../../assets/briefcase.png";
import style from "./SideBar.module.scss";
import { nanoid } from "nanoid/non-secure";
import { useEffect } from "react";
import type { SideBarTaskType } from "../NavigatinonType";
import clsx from "clsx";

const SideBar: React.FC<SideBarTaskType> = ({
  currentTask,
  setTask,
  Mobilehamburger,
  isMobile,
}) => {
  const navigate = useNavigate();

  const handleTask = (id: string, nav: string) => {
    setTask((pre) =>
      pre.map((ele) => ({
        ...ele,
        subItems: ele.subItems.map((el) => ({
          ...el,
          isRunning: id === el.id,
        })),
      })),
    );
    navigate(`/home/${nav}`);
  };

  const SideBarNav = currentTask.map((element) => {
    const subItem = element.subItems.map((el) => {
      const taskHieldStyle = clsx({ [style.NavItemWrapper]: el.isRunning });
      const itemHeld = clsx(style.NavItem, {
        [style.textOpacity]: el.isRunning,
      });
      if (el.isRunning)
        useEffect(() => {
          navigate(`/home/${el.nav}`);
        }, []);
      return (
        <div key={nanoid()} className={taskHieldStyle}>
          <button
            onClick={() => handleTask(el.id, el.nav)}
            className={itemHeld}
            aria-label={el.nav}
          >
            <img src={el.img} alt={`${el.nav}-icon`} />
            <span>{el.nav}</span>
          </button>
        </div>
      );
    });

    return (
      <ul className={style.NavList} key={nanoid()}>
        <li>
          {element.category !== "" && (
            <h1 className={style.NavCategory}>{element.category}</h1>
          )}
          {subItem}
        </li>
      </ul>
    );
  });

  return (
    <main className={style.SideMenu}>
      {isMobile && (
        <div className={style.closeHamburger}>{Mobilehamburger}</div>
      )}
      <div>
        <p className={style.SwitchOrg}>
          <img className={style.Org} src={Org} alt="navigation-icon" />
          <select className={style.SelectOrg}>
            <option>Switch Organization</option>
          </select>
        </p>
        {SideBarNav}
      </div>
    </main>
  );
};

export default SideBar;
