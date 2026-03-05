/**
 * @jest-environment node
 */

jest.mock("node:fs/promises", () => ({
  __esModule: true,
  writeFile: jest.fn(async () => undefined),
}));

import { POST } from "@/app/api/contact/route";

describe("/api/contact", () => {
  it("accepts valid lead and returns success (tmp fallback)", async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.SMTP_URL;

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ada@example.com",
        message: "We need a secure lakehouse with governance and a KPI layer.",
        company: "ExampleCo",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = (await res.json()) as { ok: boolean; provider?: string };
    expect(body.ok).toBe(true);
    expect(body.provider).toBe("tmp");
  });
});

