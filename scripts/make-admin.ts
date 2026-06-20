import { PrismaClient } from "@prisma/client";

// Promote (or demote) a user by email.
//   node --env-file=.env --import tsx scripts/make-admin.ts person@example.com
//   node --env-file=.env --import tsx scripts/make-admin.ts person@example.com --role CLIENT
//
// Note: this project has no dotenv dependency, so DATABASE_URL must be provided
// via `--env-file=.env` (Node >= 20.6) or already be in the environment.

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const roleArg = process.argv.includes("--role")
    ? process.argv[process.argv.indexOf("--role") + 1]
    : "ADMIN";
  const role = roleArg === "CLIENT" ? "CLIENT" : "ADMIN";

  if (!email) {
    console.error("Usage: make-admin <email> [--role ADMIN|CLIENT]");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role },
    select: { id: true, email: true, role: true },
  });
  console.log(`✔ Updated:`, user);
  console.log("Note: the user must re-login (or wait for token refresh) for the new role to take effect.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    if (e?.code === "P2025") {
      console.error(`No user found with that email.`);
    } else {
      console.error(e);
    }
    await prisma.$disconnect();
    process.exit(1);
  });
