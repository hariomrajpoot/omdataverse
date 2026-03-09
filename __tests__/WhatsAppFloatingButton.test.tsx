import { render, screen } from "@testing-library/react";
import { WhatsAppFloatingButton } from "@/features/shared/components/WhatsAppFloatingButton";

describe("WhatsAppFloatingButton", () => {
  it("renders a link pointing at the configured number", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "1234567890";
    render(<WhatsAppFloatingButton />);
    const anchor = screen.getByRole("link", { name: /chat on whatsapp/i });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/1234567890"),
    );
  });
});