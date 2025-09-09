import { Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/ProtectRoute";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import TaskManager from "./pages/TaskManager/TaskManager";
import navigation from "./components/SideBar/SideNavData";
import { useEffect, useState } from "react";
import UserDetails from "./pages/UserDetails/UserDetalls";
import NonPage from "./components/NullPage/NonPage";
import type { storeData } from "./components/UsersType";
import Users from "./pages/Users/Users";

const App = () => {
  const [currentTask, setTask] = useState(navigation);
  const [storeUsers, setStoreUsers] = useState<storeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch("/.netlify/functions/fetchUser");
      const data = await response.json();

      localStorage.setItem("users", JSON.stringify(data));
      setStoreUsers(JSON.parse(localStorage.getItem("users") || "[]"));
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login loading={loading} />} />
      <Route
        path="home"
        element={
          <ProtectRoute>
            <Dashboard currentTask={currentTask} setTask={setTask} />
          </ProtectRoute>
        }
      >
        <Route path="" element={<TaskManager />}>
          <Route path=":navId" element={<NonPage setTask={setTask} />} />
          <Route
            index
            element={
              <Users
                userData={storeUsers.map((user) => user.Users)}
                currentTask={currentTask
                  .map((item) => item.subItems)
                  .map((subItem) => subItem.find((it) => it.nav === "Users"))
                  ?.filter(Boolean)}
                fetchData={fetchData}
                loading={loading}
                error={error}
              />
            }
          />
          <Route
            path="users"
            element={
              <Users
                userData={storeUsers.map((user) => user.Users)}
                currentTask={currentTask
                  .map((item) => item.subItems)
                  .map((subItem) => subItem.find((it) => it.nav === "Users"))
                  ?.filter(Boolean)}
                fetchData={fetchData}
                loading={loading}
                error={error}
              />
            }
          />
          <Route
            path="users/:details"
            element={
              <UserDetails
                userData={storeUsers.map((user) => user.UserDetails)}
              />
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Login loading={loading} />} />
    </Routes>
  );
};

export default App;
