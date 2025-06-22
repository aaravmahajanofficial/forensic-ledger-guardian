import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

// Simple component test to ensure testing setup works
describe("Testing Setup", () => {
  it("should be able to run tests", () => {
    expect(1 + 1).toBe(2);
  });

  it("should render without crashing", () => {
    const TestComponent = () => <div>Test</div>;

    const { getByText } = render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    );

    expect(getByText("Test")).toBeInTheDocument();
  });
});
