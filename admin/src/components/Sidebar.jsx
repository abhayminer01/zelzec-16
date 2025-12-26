import React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  UserCog,
  Folder,
  Activity,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const mainMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Users", icon: <Users size={18} /> },
    { name: "Products", icon: <Package size={18} /> },
    { name: "Admins", icon: <UserCog size={18} /> },
    { name: "Categories", icon: <Folder size={18} /> },
    { name: "Status", icon: <Activity size={18} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <img className="size-10" src="/icon.png" alt="" />
          <h1 className="text-lg font-semibold text-gray-800">ZelZec Admin</h1>
        </div>

        {/* Main Menu */}
        <nav className="mt-4">
          {mainMenu.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-3 w-full px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-all`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-3">
        <button className="flex items-center gap-3 w-full px-6 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-black transition-all">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
