import pabloIcon from "../assets/pablo-sign-in.png";
import style from "./NullPage/NonPage.module.scss";

const ErrorPage = () => {
  return (
    <main>
      <p className={style.NullPageDecribe}>
        !oops Unable to load check you internet and try again
      </p>
      <button className={style.goto} onClick={() => window.location.reload()}>
        Refresh
      </button>
      <main className={style.LoginContainer}>
        <img className={style.PabloIcon} src={pabloIcon} alt="pablo-icon" />
      </main>
    </main>
  );
};

export default ErrorPage;
