import style from "./TaskManager.module.scss";
import { Outlet } from "react-router-dom";

const TaskManager = () => {
  return (
    <main className={style.CurrentTask}>
      <Outlet />
    </main>
  );
};

export default TaskManager;
