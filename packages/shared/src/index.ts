export * from "./config.js";

export function formatWorkspaceSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type WorkspaceRole = "owner" | "admin" | "member";

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
}
