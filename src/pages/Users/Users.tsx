import type React from "react";
import { useEffect, useState } from "react";
import style from "./Users.module.scss";
import backButton from "../../assets/PagebackButton.png";
import frontButton from "../../assets/frontButton.png";
import viewdetail from "../../assets/viewdetail.png";
import blacklist from "../../assets/blacklist.png";
import activate from "../../assets/activate.png";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import Card from "../../components/CardDetails";
import type { UserlistProps } from "../../components/UsersType";
import { nanoid } from "nanoid";
import ErrorPage from "../../components/ErrorPage";
import Loader from "../../components/Loading";

const Users: React.FC<UserlistProps> = ({
  userData,
  currentTask,
  fetchData,
  loading,
  error,
}) => {
  useEffect(() => {
    fetchData();
  }, []);

  const [rowPerPage, setRowPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = Math.ceil(userData.length / rowPerPage);
  const [isFilter, setIsfilter] = useState(false);
  const [type, setType] = useState<"text" | "date">("text");
  const [toggle, setToggle] = useState(false);
  const [select, setSelect] = useState("");
  const [selectStat, setSelectStat] = useState("");
  const [filterData, setFilter] = useState<string[]>([]);
  const [manageUser, setManager] = useState(userData);
  const tHead = [
    "ORGANIZATION",
    "USERNAME",
    "EMAIL",
    "PHONE NUMBER",
    "DATE JOINED",
    "STATUS",
  ];

  const navigate = useNavigate();

  const cleanDate = (dateStr: string) => {
    const date = new Date(dateStr).toLocaleDateString("en-Us", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return date;
  };

  const filterBtn = (
    <button
      aria-label="Filter users"
      className={style.filtIconBtn}
      onClick={() => setIsfilter((prev) => !prev)}
    >
      <div className={style.filterIcon}>
        <span className={style.line1}></span>
        <span className={style.line2}></span>
        <span className={style.line3}></span>
      </div>
    </button>
  );
  const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formData.get("date") as string;
    const reFormatDate = date !== "" ? cleanDate(date) : "";
    const formValue = {
      org: formData.get("organization") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      date: reFormatDate,
      phone: formData.get("phone") as string,
      status: formData.get("status") as string,
    };

    const filledForm = Object.values(formValue).filter((val) => val !== "");

    // pass fill data to filter
    setFilter(filledForm);
  };

  useEffect(() => {
    if (filterData.length > 0) {
      const filt = userData.filter((list) => {
        const table = list.Table;
        const compValue = Object.values({
          ...table,
          DateJoined: cleanDate(table.DateJoined),
        });
        return filterData.every((value) => {
          return compValue.some((val) =>
            val.trim().includes(String(value).trim()),
          );
        });
      });
      // form filter update the table
      setManager(filt);
    }
  }, [filterData]);

  // Array for filter form organization select menu
  const selectOrg = Array.from(
    new Set(userData.map((list) => list.Table.Organization)),
  ).map((ops) => (
    <option key={nanoid()} value={`${ops}`}>
      {ops}
    </option>
  ));

  //Array for filter form status select menu
  const selectSts = Array.from(
    new Set(userData.map((list) => list.Table.Status)),
  ).map((ops) => (
    <option key={nanoid()} value={`${ops}`}>
      {ops}
    </option>
  ));

  // filter form element
  const FilterForm = isFilter && (
    <div className={style.Filter} aria-label="filter form">
      <form onSubmit={handleFilter} className={style.FilterForm}>
        <div>
          <label htmlFor="organization">Organization</label>
          <select
            value={select}
            onChange={(e) => setSelect(e.target.value)}
            name="organization"
            id="organization"
          >
            <option value="">Select</option>
            {selectOrg}
          </select>
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="username"
            id="username"
            name="username"
            placeholder="User Name"
          />{" "}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" type="email" id="email" placeholder="Email" />
        </div>
        <div>
          <label htmlFor="date">Date</label>
          <input
            type={type}
            id="date"
            name="date"
            placeholder="Date"
            onFocus={() => setType("date")}
            onBlur={(e) => {
              if (!e.target.value) setType("text");
            }}
          />
        </div>
        <div>
          <label htmlFor="tel">Phone Number</label>
          <input
            name="phone"
            type="tel"
            id="tel"
            pattern="[0-9]{10,}"
            placeholder="Phone Number"
            inputMode="numeric"
          />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={selectStat}
            onChange={(e) => setSelectStat(e.target.value)}
          >
            <option value="">Select</option>
            {selectSts}
          </select>
        </div>
        <footer>
          <button
            aria-label="reset button"
            type="button"
            className={style.ResetButton}
            onClick={() => {
              fetchData();
              setManager(userData);
              setIsfilter(false);
            }}
          >
            Reset
          </button>
          <button type="submit" className={style.FilterButton}>
            Filter
          </button>
        </footer>
      </form>
    </div>
  );
  const thElement = tHead.map((head) => (
    <th key={nanoid()} className={style.FilterPosition}>
      {" "}
      <span className={style.thContent}>
        {head}
        {filterBtn}
      </span>
      <span>{head === "ORGANIZATION" && FilterForm}</span>
    </th>
  ));

  // Card and Page title Section
  const currentRunning = currentTask.map((ele) => {
    const cardsElement = Card.map((cards, i) => {
      const icon = clsx({
        [style.Users]: cards.action === "Users",
        [style.actUser]: cards.action === "Active Users",
        [style.LoanUser]: cards.action === "Users with Loans",
        [style.SaveUser]: cards.action === "Users with Savings",
      });

      return (
        <div className={style.Card} key={i}>
          <span className={icon}>
            <img src={cards.icon} alt="icons" />
          </span>
          <h1 className={style.action}>{cards.action}</h1>
          <p aria-label={`${cards.action} status`} className={style.status}>
            {cards.status}
          </p>
        </div>
      );
    });

    return (
      <section className={style.CurrentRunning} key={ele?.id}>
        <h1 aria-label={`${ele?.nav} page`} className={style.TaskName}>
          {ele?.nav}
        </h1>
        <section aria-label="Users Overview" className={style.CardWrapper}>
          {cardsElement}
        </section>
      </section>
    );
  });

  // Pagenation Button
  const handlePage = (page: number) => {
    let newPage = currentPage;
    if (page === -1) {
      newPage = Math.max(1, currentPage - 1);
    } else if (page === 1) {
      newPage = Math.min(totalPage, currentPage + 1);
    } else if (typeof page === "number" && page > 0 && page <= totalPage) {
      newPage = page;
    }
    setCurrentPage(newPage);
  };

  // pagination numbers with jumper bridge (ellipsis)
  const getPageList = (current: number, total: number) => {
    const pages: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 4) pages.push("...");
      for (
        let i = Math.max(2, current - 1);
        i <= Math.min(total - 1, current + 1);
        i++
      ) {
        pages.push(i);
      }
      if (current < total - 3) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  const paginationElement = getPageList(currentPage, totalPage).map(
    (item, idx) =>
      item === "..." ? (
        <li className={style.pagination} key={`ellipsis-${idx}`}>
          <span className={style.paginationEllipsis}>...</span>
        </li>
      ) : (
        <li className={style.pagination} key={item}>
          <button
            className={currentPage === item ? style.activePage : ""}
            onClick={() => handlePage(item as number)}
            disabled={currentPage === item}
          >
            {item}
          </button>
        </li>
      ),
  );

  const startIdx = (currentPage - 1) * rowPerPage;
  const endIdx = startIdx + rowPerPage;

  // If No User found (empty array) Error Display
  const notFoundError = (
    <tr className={style.noUser}>
      <td className={style.notFound} colSpan={6}>
        <span>
          No user found please reload you web browser or Reset filter form
        </span>
      </td>
    </tr>
  );

  // Table element
  const usersTable = manageUser.slice(startIdx, endIdx).map((list, i, arr) => {
    const rowStatus = list.Table.Status;
    const rowUser = list.Table.Username;
    const status = clsx({
      [style.active]: rowStatus === "Active",
      [style.inactive]: rowStatus === "Inactive",
      [style.blacklist]: rowStatus === "Blacklisted",
      [style.pending]: rowStatus === "Pending",
    });

    const rowLine = clsx({
      [style.tableRow]: arr.length - 1 !== i,
      [style.lastRow]: arr.length - 1 === i,
    });
    return (
      <tr className={rowLine} key={nanoid()}>
        <td data-label="ORGANIZATION">{list.Table.Organization}</td>
        <td data-label="USERNAME">{list.Table.Username}</td>
        <td data-label="EMAIL">{list.Table.Email}</td>
        <td data-label="PHONE NUMBER">{list.Table.PhoneNumber}</td>
        <td data-label="DATE JOINED" className={style.Date}>
          {list.Table.DateJoined}
        </td>
        <td data-label="STATUS">
          <span className={status}>{rowStatus}</span>
        </td>
        <td data-label="ACTIONS" className={style.Menubutton}>
          <button
            aria-label="user toggle menu"
            onClick={(e) => {
              e.preventDefault();
              localStorage.setItem("name", rowUser);
              setToggle((prev) => !prev);
            }}
          >
            <div className={style.threeDots}>
              <span></span> <span></span> <span></span>
            </div>
          </button>

          {/* User menu toggle */}
          {toggle && localStorage.getItem("name") === rowUser && (
            <section aria-label="user menu" className={style.threeDotsMenu}>
              <div>
                <button
                  aria-label="view user details"
                  onClick={() => {
                    navigate(`/home/users/${rowUser}`);
                  }}
                >
                  <img src={viewdetail} alt="detail-Icon" />{" "}
                  <span> View Details</span>
                </button>
                <button aria-label="blacklist user">
                  <img src={blacklist} alt="blacklist-icon" />{" "}
                  <span>Blacklist User</span>
                </button>
                <button aria-label="activate user">
                  <img src={activate} alt="activate" />{" "}
                  <span>Activate User</span>
                </button>
              </div>
            </section>
          )}
        </td>
      </tr>
    );
  });

  const loadStyle = clsx({
    [style.MainLoad]: loading || error,
  });

  // render to DOM
  return (
    <main className={loadStyle}>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorPage />
      ) : (
        <>
          <main className={style.CurrentTask}>{currentRunning}</main>
          <section className={style.userList}>
            <section className={style.listSection}>
              <div className={style.filterRow}>
                <span className={style.thContent}>
                  <span className={style.filterRow}>Filter</span>
                  {filterBtn}
                </span>
                <span>{FilterForm}</span>
              </div>
              <table className={style.FilterPosition}>
                <thead>
                  <tr>{thElement}</tr>
                </thead>
                <tbody>
                  {manageUser.length < 1 ? notFoundError : usersTable}
                </tbody>
              </table>
            </section>
          </section>
          {!isFilter && (
            <section aria-label="table page set" className={style.tableAdjust}>
              <div className={style.currentPage}>
                <label htmlFor="show-page">Showing</label>
                <select
                  id="show-page"
                  onChange={(e) => setRowPerPage(Number(e.currentTarget.value))}
                >
                  <option value={9}>9</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                  <option value={userData.length}>{userData.length}</option>
                </select>
                <span>out of {userData.length}</span>
              </div>
              <div className={style.numberListWrapper}>
                <button
                  className={style.countPage}
                  onClick={() => handlePage(-1)}
                  disabled={currentPage === 1}
                >
                  <img src={backButton} alt="back-button" />
                </button>
                <ol>{paginationElement}</ol>
                <button
                  className={style.countPage}
                  onClick={() => handlePage(1)}
                  disabled={currentPage === totalPage}
                >
                  <img src={frontButton} alt="front-button" />
                </button>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default Users;
