import clsx from "clsx";
import lendsqr from "../../assets/lendsqr.svg";
import pabloIcon from "../../assets/pablo-sign-in.png";
import style from "./Login.module.scss";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loading";

type LoginProps = {
  loading: boolean;
};

const Login: React.FC<LoginProps> = ({ loading }) => {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlLoggin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const res = await fetch("/.netlify/functions/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/home/Dashboard");
    } else {
      setError(data.message);
    }
  };

  // input error class helper
  const inputClass = (hasError?: boolean) =>
    clsx(style.InputField, hasError ? style.InputFieldError : null);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <main className={style.LoginContainer}>
          <section className={style.Icons}>
            <img className={style.LendsqrLogo} src={lendsqr} alt="logo" />
            <img className={style.PabloIcon} src={pabloIcon} alt="pablo-icon" />
          </section>
          <section className={style.LoginWrapper}>
            <h1>Welcome!</h1>
            <h2>Enter details to login.</h2>

            {/* error message */}
            {error && (
              <div
                className={style.FormError}
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <form onSubmit={(e) => handlLoggin(e)} className={style.form}>
              <input
                className={inputClass(!!error)}
                type="email"
                name="email"
                placeholder="Email"
                required
                onChange={() => error && setError(null)}
              />
              <div className={style.inputWrapper}>
                <input
                  className={inputClass(!!error)}
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  onChange={() => error && setError(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className={style.ViewPass}
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
              <button
                type="button"
                onClick={() => alert("Section Not Implement")}
                className={style.ForgotPassButton}
              >
                FORGOT PASSWORD?
              </button>
              <button type="submit" className={style.LoginButton}>
                LOG IN
              </button>
            </form>
          </section>
        </main>
      )}
    </>
  );
};

export default Login;
