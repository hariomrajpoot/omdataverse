import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";

describe("Hero", () => {
  it("renders title, CTAs and badges", () => {
    render(
      <Hero
        title="Data platforms and AI"
        subtitle="Build foundations, then accelerate."
        primaryCta={{ label: "Book audit", href: "/contact" }}
        secondaryCta={{ label: "Case studies", href: "/case-studies" }}
        badges={[
          { label: "Azure", logo: "/logos/azure.svg" },
          { label: "Fabric", logo: "/logos/fabric.svg" },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /Data platforms and AI/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Book audit/i })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: /Case studies/i })).toHaveAttribute(
      "href",
      "/case-studies",
    );

    expect(screen.getByText("Azure")).toBeInTheDocument();
    expect(screen.getByText("Fabric")).toBeInTheDocument();
  });
});
