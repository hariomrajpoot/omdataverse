import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/ContactForm";

describe("ContactForm", () => {
  it("validates required fields on submit", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText(/Name/i), "A");
    await user.type(screen.getByLabelText(/Email/i), "invalid-email");
    await user.type(screen.getByLabelText(/^Message$/i), "Too short");

    await user.click(screen.getByRole("button", { name: /Send message/i }));

    expect(
      await screen.findByText(/Please fix the highlighted fields/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
  });
});

