import { useNavigate, useParams } from "react-router-dom";
import pabloIcon from "../../assets/pablo-sign-in.png";
import style from "./NonPage.module.scss";
import type { NavigationCategory } from "../NavigatinonType";
import type React from "react";

type Props = {
  setTask: React.Dispatch<React.SetStateAction<NavigationCategory[]>>;
};

const NonPage: React.FC<Props> = ({ setTask }) => {
  const navigate = useNavigate();
  const handleGoto = () => {
    setTask((pre) =>
      pre.map((ele) => ({
        ...ele,
        subItems: ele.subItems.map((el) => ({
          ...el,
          isRunning: "Users" === el.nav,
        })),
      })),
    );
    navigate("/home/users");
  };
  const { navId } = useParams();

  return (
    <main>
      <h1 className={style.NullPageTaskHead}>{navId}</h1>
      {navId === "Dashboard" && (
        <section className={style.LoginWrapper}>
          <h1>Welcome! Adedji</h1>
        </section>
      )}
      <p className={style.NullPageDecribe}>
        !oops this page is not part of the assessment
      </p>
      <button className={style.goto} onClick={handleGoto}>
        Goto User
      </button>
      <main className={style.LoginContainer}>
        <img className={style.PabloIcon} src={pabloIcon} alt="pablo-icon" />
      </main>
    </main>
  );
};

export default NonPage;
