import { useState } from "react";
import { StaffTable } from "./StaffTable";
import { MembersTable } from "./MembersTable";

export function ManagePage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'members'>('staff');

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-ink">Manage</h1>
      <div className="flex gap-4 border-b border-moss-200 mb-6">
        <button 
          onClick={() => setActiveTab('staff')}
          className={`pb-2 ${activeTab === 'staff' ? 'border-b-2 border-moss-600 font-bold' : ''}`}>
          Staff
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`pb-2 ${activeTab === 'members' ? 'border-b-2 border-moss-600 font-bold' : ''}`}>
          Members
        </button>
      </div>
      {activeTab === 'staff' ? <StaffTable /> : <MembersTable />}
    </div>
  );
}