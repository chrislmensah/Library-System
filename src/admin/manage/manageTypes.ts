export type StaffRole = 'librarian' | 'admin' | 'owner';
export type MemberStatus = 'active' | 'suspended';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
}