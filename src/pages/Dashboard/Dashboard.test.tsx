import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "./Dashboard";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

// Create mockNavigate
const mockNavigate = vi.fn();

// Mock react-router-dom and grab the mocked useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(), // Will be replaced in beforeEach
  };
});

// Now import AFTER mocking so this is the mocked one
import { useNavigate } from "react-router-dom";

vi.mock("react-responsive", () => ({
  useMediaQuery: vi.fn(),
}));

vi.mock("../../assets/Search-icon.png", () => ({
  default: "mocked-search-icon.png",
}));
vi.mock("../../assets/lendsqr.svg", () => ({ default: "mocked-lendsqr.svg" }));
vi.mock("../../assets/Unionlogo.png", () => ({
  default: "mocked-unionlogo.png",
}));
vi.mock("../../assets/bell.png", () => ({ default: "mocked-bell.png" }));
vi.mock("../../assets/avatar.png", () => ({ default: "mocked-avatar.png" }));
vi.mock("../../assets/np_dropdown.png", () => ({
  default: "mocked-np-dropdown.png",
}));

beforeEach(() => {
  vi.clearAllMocks(); // Clear all mocks before each test
  (useMediaQuery as unknown as Mock).mockReturnValue(false); // Default to desktop

  // Safe to mock now because it's already a vi.fn()
  (useNavigate as unknown as Mock).mockReturnValue(mockNavigate); // Mock useNavigate
});

describe("Dashboard", () => {
  it("render correctly Desktop", async () => {
    const user = userEvent.setup(); // Setup user event

    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<Dashboard currentTask={[]} setTask={vi.fn()} />}
          >
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    ); // Render Dashboard (desktop)

    const avatarBtn = screen.getByLabelText("Profile-picture"); // Avatar button
    const notificationBell = screen.getByAltText("Notice-icon"); // Notification bell
    const logo = screen.getByAltText("desktop-logo"); // Desktop logo
    const searchIcon = screen.getByAltText("search-icon"); // Search icon
    const dropArrow = screen.getByAltText("drop-arrow"); // Dropdown arrow
    const avatar = screen.getByAltText("avater-icon"); // Avatar image
    const mobileBtn = screen.queryByAltText("mobile-logo"); // Mobile logo (should not exist)
    const searchBtn = screen.getByLabelText("search button"); // Search button
    const logoutDrop = screen.queryByLabelText("Logout"); // Logout button (should not exist)

    expect(logo).toBeInTheDocument(); // Desktop logo present
    expect(searchIcon).toBeInTheDocument(); // Search icon present
    expect(dropArrow).toBeInTheDocument(); // Dropdown arrow present
    expect(avatar).toBeInTheDocument(); // Avatar image present
    expect(notificationBell).toBeInTheDocument(); // Notification bell present
    expect(searchBtn).toBeInTheDocument(); // Search button present
    expect(mobileBtn).not.toBeInTheDocument(); // Mobile logo not present
    expect(logoutDrop).not.toBeInTheDocument(); // Logout button not present

    await user.click(avatarBtn); // Click avatar button

    waitFor(() => {
      const logoutDrop = screen.getByLabelText("Logout"); // Logout button
      expect(logoutDrop).toBeInTheDocument(); // Logout button present after click
    });
  });

  it("logs out and navigates to '/' when Logout is clicked Desktop", async () => {
    const user = userEvent.setup(); // Setup user event

    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<Dashboard currentTask={[]} setTask={vi.fn()} />}
          >
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    ); // Render Dashboard (desktop)

    await user.click(screen.getByLabelText("Profile-picture")); // Click avatar button
    await user.click(screen.getByLabelText("Logout")); // Click logout button

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/"); // Should navigate to "/"
    });
  });

  it("render correctly (mobile)", async () => {
    (useMediaQuery as Mock).mockReturnValue(true); // Mobile
    const user = userEvent.setup(); // Setup user event
    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<Dashboard currentTask={[]} setTask={vi.fn()} />}
          >
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    ); // Render Dashboard (mobile)

    const HamburgarBtn = screen.getByLabelText("mobile sidebar"); // Hamburger button
    const avatarBtn = screen.getByLabelText("Profile-picture"); // Avatar button
    const notificationBell = screen.getByAltText("Notice-icon"); // Notification bell
    const logo = screen.queryByAltText("desktop-logo"); // Desktop logo (should not exist)
    const searchIcon = screen.getByAltText("search-icon"); // Search icon
    const dropArrow = screen.getByAltText("drop-arrow"); // Dropdown arrow
    const avatar = screen.getByAltText("avater-icon"); // Avatar image
    const logoutDrop = screen.queryByLabelText("Logout"); // Logout button (should not exist)
    const searchBtn = screen.getByLabelText("search button"); // Search button
    const mobileLogo = screen.getByAltText("mobile-logo"); // Mobile logo

    expect(HamburgarBtn).toBeInTheDocument(); // Hamburger button present
    expect(avatarBtn).toBeInTheDocument(); // Avatar button present
    expect(notificationBell).toBeInTheDocument(); // Notification bell present
    expect(logo).not.toBeInTheDocument(); // Desktop logo not present
    expect(searchIcon).toBeInTheDocument(); // Search icon present
    expect(dropArrow).toBeInTheDocument(); // Dropdown arrow present
    expect(avatar).toBeInTheDocument(); // Avatar image present
    expect(logoutDrop).not.toBeInTheDocument(); // Logout button not present
    expect(searchBtn).toBeInTheDocument(); // Search button present
    expect(mobileLogo).toBeInTheDocument(); // Mobile logo present

    await user.click(HamburgarBtn); // Click hamburger button

    await waitFor(() => {
      const mobileLogoUpdate = screen.queryByAltText("mobile-logo"); // Mobile logo after click
      expect(mobileLogoUpdate).not.toBeInTheDocument(); // Mobile logo not present after click
      expect(screen.getByAltText("desktop-logo")).toBeInTheDocument(); // Desktop logo present after click
    });
  });

  it("logs out and navigates to '/' when Logout is clicked (mobile)", async () => {
    (useMediaQuery as Mock).mockReturnValue(true); // Mobile
    const user = userEvent.setup(); // Setup user event

    render(
      <MemoryRouter>
        <Routes>
          <Route
            path="/"
            element={<Dashboard currentTask={[]} setTask={vi.fn()} />}
          >
            <Route index element={<div>Home</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    ); // Render Dashboard (mobile)

    const HamburgarBtn = screen.getByLabelText("mobile sidebar"); // Hamburger button

    expect(HamburgarBtn).toBeInTheDocument(); // Hamburger button present

    // On mobile, maybe the logout button is in a burger menu
    await user.click(screen.getByLabelText("Profile-picture")); // Click avatar button
    await user.click(screen.getByLabelText("Logout")); // Click logout button

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/"); // Should navigate to "/"
    });
  });
});
