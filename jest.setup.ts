import "@testing-library/jest-dom";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) =>
    // Avoid JSX in setup file.
    require("react").createElement("a", { href, ...rest }, children),
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useSearchParams: () => new URLSearchParams(""),
}));

