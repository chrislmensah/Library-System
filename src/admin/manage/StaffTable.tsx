import { Trash2, UserX } from "lucide-react";
import type { StaffMember } from "./manageTypes";

interface StaffTableProps {
  staff: StaffMember[];
  onRemove: (member: StaffMember) => void;
}

const roleStyles: Record<StaffMember["role"], string> = {
  owner: "border-moss-200 bg-moss-50 text-moss-700",
  admin: "border-blue-200 bg-blue-50 text-blue-700",
  librarian: "border-ink/10 bg-ivory-100 text-ink/60",
};

const roleLabels: Record<StaffMember["role"], string> = {
  owner: "Owner",
  admin: "Admin",
  librarian: "Librarian",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function StaffTable({ staff, onRemove }: StaffTableProps) {
  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <UserX className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No staff yet</p>
        <p className="font-sans text-sm text-ink/40">Invite someone to help run the library.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-moss-200">
        <thead className="bg-ivory-50">
          <tr>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Name
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Role
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Joined
            </th>
            <th className="px-4 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moss-100 bg-white">
          {staff.map((member) => (
            <tr key={member.id} className="hover:bg-ivory-50">
              <td className="px-4 py-3">
                <div className="font-sans text-sm font-medium text-ink">{member.name}</div>
                <div className="font-sans text-xs text-ink/40">{member.email}</div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${roleStyles[member.role]}`}
                >
                  {roleLabels[member.role]}
                </span>
              </td>
              <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(member.joinedAt)}</td>
              <td className="px-4 py-3 text-right text-sm">
                {member.role !== "owner" && (
                  <button
                    onClick={() => onRemove(member)}
                    aria-label={`Remove ${member.name}`}
                    className="inline-flex items-center text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}