import crypto from "node:crypto";
import { db, queryClient } from "./index.js";
import { forms, memberships, users, workspaces } from "./schema.js";

export function hashPassword(password: string): string {
  const salt = crypto.scryptSync(password, "formflow-salt", 16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export const SEED_DATA = {
  user: {
    id: "00000000-0000-0000-0000-000000000002",
    email: "demo@example.com",
    password: "password123",
  },
  workspace: {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Demo Workspace",
    slug: "demo-workspace",
  },
  membership: {
    id: "00000000-0000-0000-0000-000000000003",
    role: "owner",
  },
  forms: [
    {
      id: "00000000-0000-0000-0000-000000000011",
      name: "Contact Form",
      slug: "contact",
      schemaJson: {
        title: "Contact Us",
        description: "Send us a message and our team will get back to you shortly.",
        fields: [
          { id: "name", label: "Full Name", type: "text", required: true },
          { id: "email", label: "Email Address", type: "email", required: true },
          { id: "message", label: "Your Message", type: "textarea", required: true },
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000012",
      name: "Customer Feedback Survey",
      slug: "survey",
      schemaJson: {
        title: "Customer Satisfaction Survey",
        description: "Help us improve FormFlow with your feedback.",
        fields: [
          {
            id: "satisfaction",
            label: "Overall Satisfaction (1-5)",
            type: "number",
            required: true,
          },
          {
            id: "recommend",
            label: "Would you recommend FormFlow?",
            type: "checkbox",
            required: false,
          },
          { id: "feedback", label: "What can we do better?", type: "textarea", required: false },
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000013",
      name: "Newsletter Signup",
      slug: "signup",
      schemaJson: {
        title: "Newsletter Signup",
        description: "Stay in the loop with product updates and announcements.",
        fields: [
          { id: "email", label: "Email Address", type: "email", required: true },
          { id: "interests", label: "Product Area Interests", type: "text", required: false },
          {
            id: "consent",
            label: "I agree to receive email updates",
            type: "checkbox",
            required: true,
          },
        ],
      },
    },
  ],
};

export async function seedDatabase(): Promise<void> {
  console.log("Seeding database (idempotent)...");

  // 1. Upsert Demo Workspace
  await db
    .insert(workspaces)
    .values({
      id: SEED_DATA.workspace.id,
      name: SEED_DATA.workspace.name,
      slug: SEED_DATA.workspace.slug,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: workspaces.id,
      set: {
        name: SEED_DATA.workspace.name,
        slug: SEED_DATA.workspace.slug,
        updatedAt: new Date(),
      },
    });

  // 2. Upsert Demo User
  const passwordHash = hashPassword(SEED_DATA.user.password);
  await db
    .insert(users)
    .values({
      id: SEED_DATA.user.id,
      email: SEED_DATA.user.email,
      passwordHash,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: SEED_DATA.user.email,
        passwordHash,
        updatedAt: new Date(),
      },
    });

  // 3. Upsert Membership
  await db
    .insert(memberships)
    .values({
      id: SEED_DATA.membership.id,
      workspaceId: SEED_DATA.workspace.id,
      userId: SEED_DATA.user.id,
      role: SEED_DATA.membership.role,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: memberships.id,
      set: {
        role: SEED_DATA.membership.role,
        updatedAt: new Date(),
      },
    });

  // 4. Upsert Sample Forms
  for (const form of SEED_DATA.forms) {
    await db
      .insert(forms)
      .values({
        id: form.id,
        workspaceId: SEED_DATA.workspace.id,
        name: form.name,
        slug: form.slug,
        schemaJson: form.schemaJson,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: forms.id,
        set: {
          name: form.name,
          slug: form.slug,
          schemaJson: form.schemaJson,
          updatedAt: new Date(),
        },
      });
  }

  console.log("Database seeded successfully!");
}

if (process.env.NODE_ENV !== "test") {
  seedDatabase()
    .then(async () => {
      await queryClient.end();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("Seeding failed:", err);
      await queryClient.end();
      process.exit(1);
    });
}
