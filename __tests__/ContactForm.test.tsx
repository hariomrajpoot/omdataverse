import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/features/contact/components/ContactForm";

describe("ContactForm", () => {
  it("validates required fields on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Name/i), "A");
    await user.type(screen.getByLabelText(/Email/i), "invalid-email");
    await user.type(screen.getByLabelText(/^Message$/i), "Too short");

    await user.click(screen.getByRole("button", { name: /Send on WhatsApp/i }));

    expect(
      await screen.findByText(/Please fix the highlighted fields/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });

  it("redirects to WhatsApp when a valid lead is submitted", async () => {
    const user = userEvent.setup();

    // replace location.assign so we can observe navigations
    const originalLocation = window.location;
    delete (window as unknown as Record<string, unknown>).location;
    (window as unknown as Record<string, unknown>).location = { href: "", assign: jest.fn() };

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Name/i), "Ada");
    await user.type(screen.getByLabelText(/Email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^Message$/i), "This is long enough to pass validation.");

    await user.click(screen.getByRole("button", { name: /Send on WhatsApp/i }));

    // after submission we expect the redirect helper to be called
    expect(window.location.href).toMatch(/^https:\/\/wa\.me\//);

    // restore original location object
    (window as unknown as Record<string, unknown>).location = originalLocation;
  });
});

