import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Filters from "./Filters";
import { UserContext } from "../../App";
import { Axios } from "../../Config/Axios/Axios";

// Mock Axios
jest.mock("../../Config/Axios/Axios", () => ({
  Axios: {
    get: jest.fn(),
  },
}));

// Mock WarrantyDetailsModal
jest.mock("../WarrantyDetailsModal/WarrantyDetailsModal", () => {
  const React = require("react");
  return React.forwardRef(() => (
    <div data-testid="warranty-modal">WarrantyDetailsModal</div>
  ));
});

// Mock icons to avoid SVG parsing issues
jest.mock("@primer/octicons-react", () => ({
  FilterIcon: () => <svg data-testid="filter-icon" />,
  PlusIcon: () => <svg data-testid="plus-icon" />,
  SearchIcon: () => <svg data-testid="search-icon" />,
}));

describe("Filters Component", () => {
  const mockSetSearchValue = jest.fn();
  const mockSetSelectedCategories = jest.fn();
  const mockSetWarranty = jest.fn();
  const mockUser = {
    userId: "12345",
    email: "test@example.com",
    name: "Test User"
  };

  // Mock localStorage
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => "mock-token");

    // Setup Axios mock
    Axios.get.mockResolvedValue({
      data: {
        total: 5,
        active: 3,
      }
    });
  });

  const renderWithContext = (component) => {
    return render(
      <UserContext.Provider value={{ user: mockUser }}>
        {component}
      </UserContext.Provider>
    );
  };

  test("renders input and icons", () => {
    renderWithContext(
      <Filters
        setSearchValue={mockSetSearchValue}
        setSelectedCategories={mockSetSelectedCategories}
        selectedCategories={[]}
        setWarranty={mockSetWarranty}
        warranty={{}}
      />
    );

    expect(screen.getByPlaceholderText("Search your warranty")).toBeInTheDocument();
    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  test("calls setSearchValue when typing", () => {
    renderWithContext(
      <Filters
        setSearchValue={mockSetSearchValue}
        setSelectedCategories={mockSetSelectedCategories}
        selectedCategories={[]}
        setWarranty={mockSetWarranty}
        warranty={{}}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Search your warranty"), { target: { value: "phone" } });
    expect(mockSetSearchValue).toHaveBeenCalledWith("phone");
  });

  test("renders category buttons", () => {
    renderWithContext(
      <Filters
        setSearchValue={mockSetSearchValue}
        setSelectedCategories={mockSetSelectedCategories}
        selectedCategories={[]}
        setWarranty={mockSetWarranty}
        warranty={{}}
      />
    );

    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });
});