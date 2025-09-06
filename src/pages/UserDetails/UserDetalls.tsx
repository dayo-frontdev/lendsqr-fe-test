import type React from "react";
import profileIcon from "../../assets/profile.png";
import star from "../../assets/stardeep.png";
import transpa from "../../assets/transparentstar.png";
import backArrow from "../../assets/backButton.png";
import pabloIcon from "../../assets/pablo-sign-in.png";
import style from "./UserDetails.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import type { UserDetailsProp } from "../../components/UsersType";
import { nanoid } from "nanoid";
import clsx from "clsx";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const UserDetails: React.FC<UserDetailsProp> = ({ userData }) => {
  const NavButton = [
    "General Details",
    "Documents",
    "Bank Details",
    "Loans",
    "Savings",
    "App and System",
  ]; // Navigation buttons
  const navigate = useNavigate(); // Navigation hook
  const { details } = useParams(); // Get route param
  const isMobile = useMediaQuery({ maxWidth: 600 }); // Mobile check
  const exist = details || ""; // User identifier
  const [activeNav, setActiveNav] = useState("General Details"); // Active nav state
  const handleNav = (buttons: string) => {
    setActiveNav(buttons); // Change active nav
  };

  // Render navigation buttons
  const NavBut = NavButton.map((buttons) => {
    const holdActive = clsx({
      [style.activeButton]: activeNav === buttons,
    });
    return (
      <button
        className={holdActive}
        key={nanoid()}
        onClick={() => handleNav(buttons)}
      >
        {isMobile ? buttons.split(" ")[0] : buttons}
      </button>
    );
  });

  // Filter user profile by route param
  const UserProf = userData.filter(
    (user) =>
      user.profileName.toLocaleUpperCase() === exist.toLocaleUpperCase(),
  );

  // Render user details form
  const accountInfo = UserProf.map((user) => {
    // Render categories and fields
    const formElement = user.fields.map((categories, i, arr) => {
      const stylebioCategory = clsx({
        [style.bioCategory]: arr.length - 1 !== i,
        [style.lastIndex]: arr.length - 1 === i,
      });
      // Render fields in category
      const categoryFields = categories.fields.map((category) => {
        return (
          <section key={nanoid()} className={style.labelWrapper}>
            <h1>{category.label}</h1>
            <p>{category.value}</p>
          </section>
        );
      });
      // Render category section
      return (
        <section key={nanoid()}>
          <div
            aria-label={`${categories.category}`}
            className={stylebioCategory}
          >
            <h1 className={style.categories}>{categories.category}</h1>
            <div className={style.infoCategory}>{categoryFields}</div>
          </div>
        </section>
      );
    });

    // Render profile card and navigation
    return (
      <section key={nanoid()}>
        <div className={style.detailSection}>
          <div className={style.detailsCard}>
            <div className={style.profileCard}>
              <div className={style.profileIcon}>
                <img src={profileIcon} alt="profile-icon" />
              </div>
              <div className={style.cardsElementWrappers}>
                <h1 className={style.Name}>{user.Table.Name}</h1>
                <p className={style.id}>{user.Table.UserID}</p>
              </div>
              <div className={style.rateWrapper}>
                <h1 className={style.UserTier}>User Tier</h1>
                <p className={style.rate}>
                  <img src={star} alt="star-icon" />
                  <img src={transpa} alt="star-icon" />
                  <img src={transpa} alt="star-icon" />
                </p>
              </div>
              <div className={style.cardsElementWrappers}>
                <h1 className={style.balnce}>{user.Table.Tier}</h1>
                <p className={style.acc}>{user.Table.BankAccount}</p>
              </div>
            </div>
            <div className={`${style.detailsNav} ${style.showActive}`}>
              {NavBut}
            </div>
          </div>
          {activeNav === `General Details` ? (
            <section className={style.GeneralInfo}>{formElement}</section>
          ) : (
            <section
              aria-label="exclude section message"
              className={style.NullNav}
            >
              <p className={style.NullPageDecribe}>
                !oops this page is not part of the assessment
              </p>
              <button
                onClick={() => setActiveNav(`General Details`)}
                className={style.goto}
              >
                Goto General Details
              </button>
              <main className={style.LoginContainer}>
                <img
                  className={style.PabloIcon}
                  src={pabloIcon}
                  alt="pablo-icon"
                />
              </main>
            </section>
          )}
        </div>
      </section>
    );
  });

  // Render user details to DOM
  return (
    <main className={style.detail}>
      <section>
        <button
          aria-label="back button"
          className={style.goBack}
          onClick={(e) => {
            e.preventDefault();
            navigate("/home/Users"); // Back to Users button
          }}
        >
          <img className={style.backArrow} src={backArrow} alt="back-icon" />{" "}
          Back to Users
        </button>
        <section className={style.detailsHead}>
          <h1 aria-label="page title">User Details</h1>
          <div className={style.actionWrapper}>
            <button aria-label="blacklist button" className={style.blackList}>
              Blacklist User
            </button>
            <button aria-label="activate button" className={style.activate}>
              Activate User
            </button>
          </div>
        </section>
        <section>{accountInfo}</section>
      </section>
    </main>
  );
};

export default UserDetails;
