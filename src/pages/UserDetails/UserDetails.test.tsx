import { screen, render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserDetails from "./UserDetalls";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("react-responsive", () => ({
  useMediaQuery: vi.fn(),
}));

// mockUserData as provided
const mockUserData = [
  {
    Table: {
      Name: "Vega Dorsey",
      Tier: "₦171153,000.00",
      Status: "Inactive",
      UserID: "LSQFf495g97",
      BankAccount: "74175402/Access Bank",
    },
    fields: [
      {
        fields: [
          { label: "Full Name", value: "Vega Dorsey" },
          { label: "Phone Number", value: "0843035430" },
          { label: "Email Address", value: "vega_dorsey@irorun.com" },
          { label: "BVN", value: "79322999042" },
          { label: "Gender", value: "Female" },
          { label: "Marital Status", value: "Single" },
          { label: "Children", value: "1" },
          { label: "Type of Residence", value: "Parent's Apartment" },
        ],
        category: "Personal Information",
      },
      {
        fields: [
          { label: "Level of Education", value: "OND" },
          { label: "Employment Status", value: "Unemployed" },
          { label: "Sector of Employment", value: "Healthcare" },
          { label: "Duration of Employment", value: "1 year" },
          { label: "Office Email", value: "vega_dorsey@lendsqr.com" },
          { label: "Monthly Income", value: "₦100,000 - ₦200,000" },
        ],
        category: "Education & Employment",
      },
      {
        fields: [
          { label: "Twitter", value: "@vega_dorsey" },
          { label: "Facebook", value: "Vega Dorsey" },
          { label: "Instagram", value: "@vega_dorsey" },
        ],
        category: "Socials",
      },
      {
        fields: [
          { label: "Full Name", value: "Dina Gentry" },
          { label: "Phone Number", value: "0843035430" },
          { label: "Email Address", value: "dina_gentry@gmail.com" },
          { label: "Relationship", value: "Parent" },
        ],
        category: "Guarantor",
      },
      {
        fields: [
          { label: "User Tier", value: "₦289236,000.00" },
          { label: "Bank Account", value: "57003720/GT Bank" },
          { label: "Loan Repayment", value: "₦47,979" },
        ],
        category: "Financial Details",
      },
    ],
    system: {
      userId: "LSQFf593g50",
      createdAt: "Jun 9, 2025",
      updatedAt: "Jun 10, 2025",
    },
    profileName: "Vega Dorsey",
  },
];

describe("UserDetails", () => {
  it("renders correct details for a valid user (positive scenario)", async () => {
    // Render UserDetails for Vega Dorsey
    render(
      <MemoryRouter initialEntries={["/user/Vega Dorsey"]}>
        <Routes>
          <Route
            path="/user/:details"
            element={<UserDetails userData={mockUserData} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    // Personal Information category
    const personalInfoCategory = screen
      .getByText("Personal Information")
      .closest("section"); // Find the section for Personal Information
    const personalInfo = within(personalInfoCategory as HTMLElement);

    expect(personalInfo.getByText("Full Name")).toBeInTheDocument(); // Full Name label in Personal Information
    expect(personalInfo.getByText("Vega Dorsey")).toBeInTheDocument(); // Full Name value in Personal Information
    expect(personalInfo.getByText("Email Address")).toBeInTheDocument(); // Email Address label in Personal Information
    expect(
      personalInfo.getByText("vega_dorsey@irorun.com"),
    ).toBeInTheDocument(); // Email Address value in Personal Information

    // Guarantor category
    const guarantorCategory = screen.getByText("Guarantor").closest("section"); // Find the section for Guarantor

    expect(
      within(guarantorCategory as HTMLElement).getByText("Full Name"),
    ).toBeInTheDocument(); // Full Name label in Guarantor
    expect(
      within(guarantorCategory as HTMLElement).getByText("Dina Gentry"),
    ).toBeInTheDocument(); // Full Name value in Guarantor

    // Financial Details category
    const financialCategory = screen
      .getByText("Financial Details")
      .closest("section"); // Find the section for Financial Details
    const financial = within(financialCategory as HTMLElement); // Type assertion

    expect(financial.getByText("User Tier")).toBeInTheDocument(); // User Tier label in Financial Details
    expect(financial.getByText("₦289236,000.00")).toBeInTheDocument(); // User Tier value in Financial Details
  });

  it("shows exclude section message for non-General Details nav (negative scenario)", async () => {
    // Render UserDetails for Vega Dorsey
    render(
      <MemoryRouter initialEntries={["/user/Vega Dorsey"]}>
        <Routes>
          <Route
            path="/user/:details"
            element={<UserDetails userData={mockUserData} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    // Click on "Documents" nav button
    const documentsBtn = screen.getByRole("button", { name: /Documents/i }); // Documents nav button
    await userEvent.click(documentsBtn); // Click Documents nav
    // Exclude section message
    expect(
      screen.getByLabelText("exclude section message"),
    ).toBeInTheDocument(); // Exclude section message
    expect(
      screen.getByText(/!oops this page is not part of the assessment/i),
    ).toBeInTheDocument(); // Message text
    // Goto General Details button
    const gotoBtn = screen.getByRole("button", {
      name: /Goto General Details/i,
    }); // Goto General Details button
    expect(gotoBtn).toBeInTheDocument(); // Button present
    await userEvent.click(gotoBtn); // Click Goto General Details
    // Should return to General Details
    expect(screen.getByText("Personal Information")).toBeInTheDocument(); // Personal Information category
  });

  it("renders nothing if user does not exist (negative scenario)", async () => {
    // Render UserDetails for unknown user
    render(
      <MemoryRouter initialEntries={["/user/Unknown"]}>
        <Routes>
          <Route
            path="/user/:details"
            element={<UserDetails userData={mockUserData} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    // Should not render user info
    expect(screen.queryByText("Vega Dorsey")).not.toBeInTheDocument(); // User name not present
    expect(screen.queryByText("Personal Information")).not.toBeInTheDocument(); // Personal Information not present
    // Should still show page title
    expect(screen.getByLabelText("page title")).toBeInTheDocument(); // Page title present
  });
});
