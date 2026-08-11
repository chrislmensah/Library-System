export type StaffRole = "owner" | "admin" | "librarian";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  joinedAt: string; // ISO date
}

export type MemberStatus = "active" | "suspended";

export interface LibraryMember {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
  memberSince: string; // ISO date
}

export type MemberFormValues = Pick<LibraryMember, "name" | "email">;