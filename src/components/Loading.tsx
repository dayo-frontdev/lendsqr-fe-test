import style from "../pages/Login/Login.module.scss";

const Loader = () => {
  return (
    <main className={style.MainLoad}>
      <div aria-label="loader" className={style.boxLoader}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </main>
  );
};

export default Loader;
