import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserList from "./Users";
import type { Users } from "../../components/UsersType";
import { MemoryRouter } from "react-router-dom";
import Card from "../../components/CardDetails";
import type { NavigationItem } from "../../components/NavigatinonType";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const data: Array<Users> = [
  {
    Table: {
      Email: "vega_dorsey@irorun.com",
      Status: "Pending",
      Username: "vega dorsey",
      DateJoined: "Jun 9, 2025 3:38 PM",
      PhoneNumber: "0843035430",
      Organization: "Irorun",
    },
  },
  {
    Table: {
      Email: "martina_espinoza@lendsqr.com",
      Status: "Blacklisted",
      Username: "martina espinoza",
      DateJoined: "Dec 18, 2019 6:31 AM",
      PhoneNumber: "0859274963",
      Organization: "Lendsqr",
    },
  },
];

const task: (NavigationItem | undefined)[] = [
  { nav: "Users", img: "", isRunning: false, id: "" },
];

describe("UserList", () => {
  it("renders user list page when data is successfully fetched", async () => {
    // Render UserList with mock data
    render(
      <MemoryRouter>
        <UserList
          userData={data}
          currentTask={task}
          fetchData={vi.fn()}
          loading={false}
          error={false}
        />
      </MemoryRouter>,
    );

    // Find Users page label
    const pageName = await screen.findByLabelText("Users page"); // Page label
    // Find Users Overview card
    const overviewCard = await screen.findByLabelText("Users Overview"); // Overview card
    // Loader should not be present
    const noLoading = screen.queryByLabelText("loader"); // Loader
    // Find table
    const userTable = await screen.findByRole("table"); // Table
    // Find all table headers
    const tableHeaders = await screen.findAllByRole("columnheader"); // Table headers
    // Find all table rows
    const tableRows = await screen.findAllByRole("row"); // Table rows
    // Expected table headers
    const expectedHeaders = [
      "Organization",
      "Username",
      "Email",
      "Phone Number",
      "Date Joined",
      "Status",
    ]; // Expected headers
    // Table page set label
    const tablePageSet = screen.queryByLabelText("table page set"); // Table page set

    expect(noLoading).not.toBeInTheDocument(); // Loader not present
    expect(pageName).toBeInTheDocument(); // Page label present
    expect(overviewCard).toBeInTheDocument(); // Overview card present

    Card.forEach((cards) => {
      expect(within(overviewCard).getByText(cards.action)).toBeInTheDocument(); // Card action text
      expect(
        within(overviewCard).getByLabelText(`${cards.action} status`),
      ).toBeInTheDocument(); // Card status label
    });

    expect(tableRows).toHaveLength(data.length + 1); // Table rows count
    expect(tableHeaders).toHaveLength(expectedHeaders.length); // Table headers count
    expectedHeaders.forEach((header, index) => {
      expect(tableHeaders[index]).toHaveTextContent(header.toLocaleUpperCase()); // Header text
    });
    // Row for first user (exact expected cell text)
    const row1 = tableRows[1]; // first data row (skip header)
    expect(
      within(row1).getByText("vega_dorsey@irorun.com"),
    ).toBeInTheDocument(); // Email cell for first user
    expect(within(row1).getByText("Pending")).toBeInTheDocument(); // Status cell for first user
    expect(within(row1).getByText("vega dorsey")).toBeInTheDocument(); // Username cell for first user
    expect(within(row1).getByText("Jun 9, 2025 3:38 PM")).toBeInTheDocument(); // Date Joined cell for first user
    expect(within(row1).getByText("0843035430")).toBeInTheDocument(); // Phone Number cell for first user
    expect(within(row1).getByText("Irorun")).toBeInTheDocument(); // Organization cell for first user

    // Row for second user (exact expected cell text)
    const row2 = tableRows[2]; // second data row
    expect(
      within(row2).getByText("martina_espinoza@lendsqr.com"),
    ).toBeInTheDocument(); // Email cell for second user
    expect(within(row2).getByText("Blacklisted")).toBeInTheDocument(); // Status cell for second user
    expect(within(row2).getByText("martina espinoza")).toBeInTheDocument(); // Username cell for second user
    expect(within(row2).getByText("Dec 18, 2019 6:31 AM")).toBeInTheDocument(); // Date Joined cell for second user
    expect(within(row2).getByText("0859274963")).toBeInTheDocument(); // Phone Number cell for second user
    expect(within(row2).getByText("Lendsqr")).toBeInTheDocument(); // Organization cell for second user

    expect(userTable).toBeInTheDocument(); // Table present
    expect(tablePageSet).toBeInTheDocument(); // Table page set present
  });

  it("renders user filter form, user menu and navigate to user details", async () => {
    // Render UserList with mock data
    render(
      <MemoryRouter>
        <UserList
          userData={data}
          currentTask={task}
          fetchData={vi.fn()}
          loading={false}
          error={false}
        />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    // Get filter buttons
    const filterBtn = screen.getAllByLabelText("Filter users"); // Filter buttons
    // Filter form should not be present initially
    const noFilterForm = screen.queryByLabelText("filter form"); // Filter form
    // Get user toggle menu buttons
    const viewdetail = screen.getAllByLabelText("user toggle menu"); // User menu buttons
    // User menu should not be present initially
    const noUserMenu = screen.queryByLabelText("user menu"); // User menu

    expect(noFilterForm).not.toBeInTheDocument(); // Filter form not present
    expect(noUserMenu).not.toBeInTheDocument(); // User menu not present

    // Toggle first user menu
    await user.click(viewdetail[0]); // Click user menu
    await user.click(filterBtn[1]); // Click filter button

    waitFor(async () => {
      // Filter form should be present
      const userMenu = screen.getByLabelText("user menu"); // User menu
      const viewUserDetails = screen.getByLabelText("view user details"); // View details button
      const FilterForm = screen.getByLabelText("filter form"); // Filter form
      expect(FilterForm).toBeInTheDocument(); // Filter form present
      expect(userMenu).toBeInTheDocument(); // User menu present
      await user.click(viewUserDetails); // Click view details

      // Should navigate to user details
      expect(mockNavigate).toHaveBeenCalledWith(
        `/home/users/${data[0].Table.Username}`,
      ); // Navigation called
    });
  });

  it("filter form submit correct data, no match render no results error", async () => {
    // Render UserList with empty data
    render(
      <MemoryRouter>
        <UserList
          userData={[]}
          currentTask={task}
          fetchData={vi.fn()}
          loading={false}
          error={false}
        />
      </MemoryRouter>,
    );

    const onSubmit = vi.fn();

    const user = userEvent.setup();
    // Get filter buttons
    const filterBtn = screen.getAllByLabelText("Filter users"); // Filter buttons
    await user.click(filterBtn[1]); // Click filter button

    waitFor(async () => {
      // Filter form should be present
      const FilterForm = screen.getByLabelText("filter form"); // Filter form
      expect(FilterForm).toBeInTheDocument(); // Filter form present
      // Get organization input
      const organization = screen.getByLabelText("Organization"); // Organization input
      // Get username input
      const username = screen.getByLabelText("Username"); // Username input
      await user.type(organization, "Lendsqr"); // Type organization
      await user.type(username, "vega dorsey"); // Type username
      expect(onSubmit).toHaveBeenCalledWith({
        organization: "Lendsqr",
        username: "vega dorsey",
      }); // onSubmit called with correct data
      // Get reset button
      const resetButton = screen.getByLabelText("reset button"); // Reset button
      await user.click(resetButton); // Click reset
      // Filter form should not be present after reset
      const formReset = screen.queryByLabelText("filter form"); // Filter form after reset
      expect(formReset).not.toBeInTheDocument(); // Filter form not present
    });
  });

  it("render loading", async () => {
    // Render UserList with loading=true
    render(
      <MemoryRouter>
        <UserList
          userData={data}
          currentTask={task}
          fetchData={vi.fn()}
          loading={true}
          error={false}
        />
      </MemoryRouter>,
    );

    // Loader should be present
    const Loading = screen.getByLabelText("loader"); // Loader
    expect(Loading).toBeInTheDocument(); // Loader present
  });

  it("fail to fetch data Shows Error Message", async () => {
    // Render UserList with error=true
    render(
      <MemoryRouter>
        <UserList
          userData={data}
          currentTask={task}
          fetchData={vi.fn()}
          loading={false}
          error={true}
        />
      </MemoryRouter>,
    );

    // Error message should be present
    const errorMsg = screen.getByText(
      "!oops Unable to load check you internet and try again",
    ); // Error message
    expect(errorMsg).toBeInTheDocument();
  });
});
