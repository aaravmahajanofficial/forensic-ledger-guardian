// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import CourtPreparation from "../CourtPreparation";
import { getStatusBadge } from "@/components/court/courtPreparationData";

expect.extend(matchers);

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "user-1", name: "Test Lawyer" },
  }),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

describe("CourtPreparation Component", () => {
  it("renders Court Preparation heading and overview content", () => {
    render(<CourtPreparation />);
    expect(screen.getByText("Court Preparation")).toBeInTheDocument();
    expect(
      screen.getByText("Prepare case materials and evidence for court proceedings"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Case FF-2023-076: Tech Corp Data Breach/i)).toBeInTheDocument();
  });

  it("renders status badge correctly using helper function", () => {
    const { container } = render(<>{getStatusBadge("verified")}</>);
    expect(container.textContent).toContain("Verified");
  });
});
