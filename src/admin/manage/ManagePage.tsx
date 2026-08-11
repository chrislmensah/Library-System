import { useState } from "react";
import { UserPlus, UserCog } from "lucide-react";
import { StaffTable } from "./StaffTable";
import { MembersTable } from "./MembersTable";
import { InviteStaffDialog, type InviteStaffFormValues } from "./InviteStaffDialog";
import { AddMemberDialog } from "./AddMemberDialog";
import { RemoveConfirmDialog } from "./RemoveConfirmDialog";
import type { StaffMember, LibraryMember, MemberFormValues } from "./manageTypes";

interface ManagePageProps {
  initialStaff: StaffMember[];
  initialMembers: LibraryMember[];
}

type Tab = "staff" | "members";

export function ManagePage({ initialStaff, initialMembers }: ManagePageProps) {
  const [tab, setTab] = useState<Tab>("staff");

  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [members, setMembers] = useState<LibraryMember[]>(initialMembers);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removingStaff, setRemovingStaff] = useState<StaffMember | null>(null);
  const [removingMember, setRemovingMember] = useState<LibraryMember | null>(null);

  const handleInviteStaff = (values: InviteStaffFormValues) => {
    // TODO: replace with a real tRPC mutation that emails an invite link
    const newMember: StaffMember = {
      id: crypto.randomUUID(),
      ...values,
      joinedAt: new Date().toISOString(),
    };
    setStaff((prev) => [newMember, ...prev]);
    setInviteOpen(false);
  };

  const handleAddMember = (values: MemberFormValues) => {
    // TODO: replace with a real tRPC mutation once wired up
    const newMember: LibraryMember = {
      id: crypto.randomUUID(),
      ...values,
      status: "active",
      memberSince: new Date().toISOString(),
    };
    setMembers((prev) => [newMember, ...prev]);
    setAddMemberOpen(false);
  };

  const handleToggleMemberStatus = (member: LibraryMember) => {
    // TODO: replace with a real tRPC mutation once wired up
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id ? { ...m, status: m.status === "active" ? "suspended" : "active" } : m
      )
    );
  };

  const handleRemoveStaffConfirmed = () => {
    if (!removingStaff) return;
    // TODO: replace with a real tRPC mutation once wired up
    setStaff((prev) => prev.filter((s) => s.id !== removingStaff.id));
    setRemovingStaff(null);
  };

  const handleRemoveMemberConfirmed = () => {
    if (!removingMember) return;
    // TODO: replace with a real tRPC mutation once wired up
    setMembers((prev) => prev.filter((m) => m.id !== removingMember.id));
    setRemovingMember(null);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-display text-xl text-ink">Manage</h1>
        <p className="mt-1 font-sans text-sm text-ink/50">
          Control who has staff access to this dashboard, and manage your library's members.
        </p>
      </div>

      <div className="mb-4 flex gap-1 border-b border-moss-200">
        <button
          onClick={() => setTab("staff")}
          className={`border-b-2 px-4 py-2 font-sans text-sm font-medium ${
            tab === "staff" ? "border-moss-600 text-moss-700" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Staff ({staff.length})
        </button>
        <button
          onClick={() => setTab("members")}
          className={`border-b-2 px-4 py-2 font-sans text-sm font-medium ${
            tab === "members" ? "border-moss-600 text-moss-700" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Members ({members.length})
        </button>
      </div>

      <div className="rounded-lg border border-moss-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-moss-200 px-4 py-3">
          <p className="font-sans text-sm text-ink/50">
            {tab === "staff"
              ? "People who can log into this dashboard."
              : "People registered to borrow books from your library."}
          </p>
          {tab === "staff" ? (
            <button
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-moss-700 focus:outline-none focus:ring-2 focus:ring-moss-500 focus:ring-offset-1"
            >
              <UserCog className="h-4 w-4" />
              Invite staff
            </button>
          ) : (
            <button
              onClick={() => setAddMemberOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-moss-600 px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-moss-700 focus:outline-none focus:ring-2 focus:ring-moss-500 focus:ring-offset-1"
            >
              <UserPlus className="h-4 w-4" />
              Add member
            </button>
          )}
        </div>

        {tab === "staff" ? (
          <StaffTable staff={staff} onRemove={setRemovingStaff} />
        ) : (
          <MembersTable
            members={members}
            onToggleStatus={handleToggleMemberStatus}
            onRemove={setRemovingMember}
          />
        )}
      </div>

      <InviteStaffDialog open={inviteOpen} onClose={() => setInviteOpen(false)} onSubmit={handleInviteStaff} />
      <AddMemberDialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} onSubmit={handleAddMember} />

      <RemoveConfirmDialog
        open={removingStaff !== null}
        title="Remove this staff member?"
        description={`${removingStaff?.name ?? "This person"} will lose access to the dashboard immediately.`}
        onCancel={() => setRemovingStaff(null)}
        onConfirm={handleRemoveStaffConfirmed}
      />

      <RemoveConfirmDialog
        open={removingMember !== null}
        title="Remove this member?"
        description={`${removingMember?.name ?? "This person"} will be removed from your library's member list. This can't be undone.`}
        onCancel={() => setRemovingMember(null)}
        onConfirm={handleRemoveMemberConfirmed}
      />
    </div>
  );
}