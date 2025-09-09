import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { it, vi } from "vitest";
import Login from "./Login";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock useNavigate
  };
});

it("renders, shows forgot-password alert, shows inline error for wrong credentials and navigates on success", async () => {
  const user = userEvent.setup();
  const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

  render(
    <MemoryRouter>
      <Login loading={false} />
    </MemoryRouter>,
  );

  const inputEmail = screen.getByPlaceholderText("Email");
  const inputPass = screen.getByPlaceholderText("Password");
  const img = screen.getByAltText("pablo-icon");

  expect(inputEmail).toBeRequired();
  expect(inputPass).toBeRequired();
  expect(img).toBeInTheDocument();

  // forgot password still uses alert
  await user.click(screen.getByText(/FORGOT PASSWORD\?/i));
  expect(alertMock).toHaveBeenCalledWith("Section Not Implement");

  // wrong credentials -> inline error banner (role="alert")
  await user.type(inputEmail, "test@example.com");
  await user.type(inputPass, "password");
  await user.click(screen.getByRole("button", { name: /LOG IN/i }));

  const errorBanner = await screen.findByRole("alert");
  expect(errorBanner).toHaveTextContent("Wrong username or password");

  // correct credentials -> navigate
  await user.clear(inputEmail);
  await user.clear(inputPass);
  await user.type(inputEmail, "admin@admin.com");
  await user.type(inputPass, "Test");
  await user.click(screen.getByRole("button", { name: /LOG IN/i }));

  expect(mockNavigate).toHaveBeenCalledWith("/home/Dashboard");

  alertMock.mockRestore();
});
