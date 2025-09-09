import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SideBar from "./SideBar";
import navigation from "./SideNavData";
import styles from "./SideBar.module.scss";
import { useState } from "react";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const TestNavHarness = () => {
  const [currentTask, setTask] = useState(navigation);

  return (
    <SideBar
      currentTask={currentTask}
      setTask={setTask}
      Mobilehamburger={<span>X</span>}
      isMobile={false}
    />
  );
};

describe("SideBar", () => {
  it("renders correctly", async () => {
    render(
      <MemoryRouter>
        <TestNavHarness />
      </MemoryRouter>,
    );

    const allButtons = screen.getAllByRole("button");
    expect(allButtons.length).toBe(
      navigation.reduce((acc, section) => acc + section.subItems.length, 0),
    );

    const DashboardBtn = screen.getByRole("button", { name: "Dashboard" });
    const UsersBtn = screen.getByRole("button", { name: "Users" });
    expect(DashboardBtn).toHaveClass(styles.textOpacity);
    expect(UsersBtn).not.toHaveClass(styles.textOpacity);

    await userEvent.click(UsersBtn);
    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/home/Users");
    });
    const updateUsersBtn = screen.getByRole("button", { name: "Users" });
    const updateDashboardBtn = screen.getByRole("button", {
      name: "Dashboard",
    });
    expect(updateUsersBtn).toHaveClass(styles.textOpacity);
    expect(updateDashboardBtn).not.toHaveClass(styles.textOpacity);
  });

  it("navigate correctly (static checks for every nav item)", async () => {
    render(
      <MemoryRouter>
        <TestNavHarness />
      </MemoryRouter>,
    );

    const user = userEvent.setup();

    // helper to assert navigation and active class with explicit waiting
    const assertNav = async (label: string) => {
      vi.clearAllMocks(); // clear previous navigate calls
      const btn = screen.getByRole("button", { name: label });
      expect(btn).toBeInTheDocument();
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByAltText(`${label}-icon`)).toBeInTheDocument();

      await user.click(btn);

      // wait for navigate to be called with expected path
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith(`/home/${label}`);
      });

      // wait for the clicked button to receive the active class
      await waitFor(() => {
        const updated = screen.getByRole("button", { name: label });
        expect(updated).toHaveClass(styles.textOpacity);
      });
    };

    // --- Static assertions for every nav item ---
    await assertNav("Dashboard");
    await assertNav("Users");
    await assertNav("Guarantors");
    await assertNav("Loans");
    await assertNav("Decision Models");
    await assertNav("Savings");
    await assertNav("Loan Requests");
    await assertNav("Whitelist");
    await assertNav("Karma");

    await assertNav("Organization");
    await assertNav("Loan Products");
    await assertNav("Savings Products");
    await assertNav("Fees and Charges");
    await assertNav("Transactions");
    await assertNav("Services");
    await assertNav("Service Account");
    await assertNav("Settlements");
    await assertNav("Reports");

    await assertNav("Preferences");
    await assertNav("Fees and Pricing");
    await assertNav("Audit Logs");
  }, 20000);
});
