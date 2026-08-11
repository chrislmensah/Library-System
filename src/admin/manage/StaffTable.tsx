import { useState } from "react";
import { InviteStaffDialog, InviteStaffFormValues } from "./InviteStaffDialog"; // Your provided component

export function StaffTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [staff, setStaff] = useState([
    { id: '1', name: 'Alex River', email: 'alex@library.org', role: 'owner' as const }
  ]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsOpen(true)} className="bg-moss-600 text-white px-4 py-2 rounded-md">
          Invite staff
        </button>
      </div>
      <table className="w-full text-left">
        {/* Render table rows mapping through staff state */}
      </table>
      <InviteStaffDialog open={isOpen} onClose={() => setIsOpen(false)} onSubmit={(v) => console.log(v)} />
    </div>
  );
}