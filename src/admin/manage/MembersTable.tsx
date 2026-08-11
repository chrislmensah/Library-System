import { Ban, CheckCircle2, Trash2, Users } from "lucide-react";
import type { LibraryMember } from "./manageTypes";

interface MembersTableProps {
  members: LibraryMember[];
  onToggleStatus: (member: LibraryMember) => void;
  onRemove: (member: LibraryMember) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function MembersTable({ members, onToggleStatus, onRemove }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Users className="h-8 w-8 text-ink/30" />
        <p className="font-sans text-sm font-medium text-ink/70">No members yet</p>
        <p className="font-sans text-sm text-ink/40">Members will appear here once people sign up.</p>
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
              Member since
            </th>
            <th className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Status
            </th>
            <th className="px-4 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wide text-ink/50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-moss-100 bg-white">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-ivory-50">
              <td className="px-4 py-3">
                <div className="font-sans text-sm font-medium text-ink">{member.name}</div>
                <div className="font-sans text-xs text-ink/40">{member.email}</div>
              </td>
              <td className="px-4 py-3 font-sans text-sm text-ink/60">{formatDate(member.memberSince)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${
                    member.status === "active"
                      ? "border-moss-200 bg-moss-50 text-moss-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {member.status === "active" ? "Active" : "Suspended"}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm">
                <button
                  onClick={() => onToggleStatus(member)}
                  aria-label={member.status === "active" ? `Suspend ${member.name}` : `Reactivate ${member.name}`}
                  className="mr-3 inline-flex items-center text-moss-600 hover:text-moss-800"
                >
                  {member.status === "active" ? (
                    <Ban className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => onRemove(member)}
                  aria-label={`Remove ${member.name}`}
                  className="inline-flex items-center text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}