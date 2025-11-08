/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
import { Axios } from "../../Config/Axios/Axios";
import { UserContext } from "../../App";
import { useWarranty } from "../../Components/WarrantyContext/WarrantyContext";

// 🔹 Mock Axios
jest.mock("../../Config/Axios/Axios", () => ({
  Axios: {
    get: jest.fn(),
  },
}));

// 🔹 Mock useWarranty Hook
jest.mock("../../Components/WarrantyContext/WarrantyContext", () => ({
  useWarranty: jest.fn(),
}));

// 🔹 Mock WarrantyCard and Filters
jest.mock("../../Components/WarrantyCard/WarrantyCard", () => ({
  __esModule: true,
  default: ({ warranty }) => <div data-testid="warranty-card">{warranty.itemName}</div>,
}));

jest.mock("../../Components/Filters/Filters", () => ({
  __esModule: true,
  default: ({ setSearchValue }) => (
    <input
      data-testid="search-input"
      placeholder="Search"
      onChange={(e) => setSearchValue(e.target.value)}
    />
  ),
}));

// 🔹 Mock antd message and Spin
jest.mock("antd", () => ({
  message: {
    useMessage: () => [jest.fn(), <div key="toast-holder" data-testid="message-context" />],
  },
  Spin: () => <div data-testid="spin">Loading...</div>,
}));

const mockUser = { userId: 101 };

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock warranties and setter
    useWarranty.mockReturnValue({
      warranties: [
        { itemName: "iPhone", category: "Electronics" },
        { itemName: "Mixer", category: "Appliances" },
      ],
      setWarranties: jest.fn(),
    });

    // Mock localStorage token
    Storage.prototype.getItem = jest.fn(() => "mock-token");
  });

  // ✅ 1. Test Loading State
  test("renders loading spinner initially", async () => {
    Axios.get.mockReturnValueOnce(new Promise(() => {})); // pending request
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Dashboard />
      </UserContext.Provider>
    );

    //expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(screen.getByTestId("spin")).toBeInTheDocument();
  });

  // ✅ 2. Test Successful API Fetch
  test("renders warranty cards after successful fetch", async () => {
    Axios.get.mockResolvedValueOnce({
      data: [
        { itemName: "Laptop", category: "Electronics" },
        { itemName: "Camera", category: "Electronics" },
      ],
    });

    const mockSetWarranties = jest.fn();
    useWarranty.mockReturnValue({
      warranties: [
        { itemName: "Laptop", category: "Electronics" },
        { itemName: "Camera", category: "Electronics" },
      ],
      setWarranties: mockSetWarranties,
    });

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("warranty-card")).toHaveLength(2);
      expect(screen.getByText("Laptop")).toBeInTheDocument();
    });
  });

  // ✅ 3. Test Empty Warranty List
  test("shows empty message when no warranties found", async () => {
    Axios.get.mockResolvedValueOnce({ data: [] });
    useWarranty.mockReturnValue({
      warranties: [],
      setWarranties: jest.fn(),
    });

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No warranties added yet/i)
      ).toBeInTheDocument();
    });
  });

  // ✅ 4. Test Filtering by Search
  test("filters warranties by search input", async () => {
    Axios.get.mockResolvedValueOnce({ data: [] });
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Dashboard />
      </UserContext.Provider>
    );

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "iphone" } });

    await waitFor(() => {
      expect(screen.getByText("iPhone")).toBeInTheDocument();
      expect(screen.queryByText("Mixer")).not.toBeInTheDocument();
    });
  });
    //Test API Error Handling
  test("handles API error gracefully", async () => {
    Axios.get.mockRejectedValueOnce(new Error("Network Error"));

    useWarranty.mockReturnValue({
      warranties: [], // 👈 ensure it's empty
      setWarranties: jest.fn(),
    });

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <Dashboard />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No warranties added yet/i)
      ).toBeInTheDocument();
    });
  });

});
