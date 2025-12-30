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

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const mainMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Users", icon: <Users size={18} />, path: "/dashboard/users" },
    { name: "Products", icon: <Package size={18} />, path: "/dashboard/products" },
    { name: "Admins", icon: <UserCog size={18} />, path: "/dashboard/admins" },
    { name: "Categories", icon: <Folder size={18} />, path: "/dashboard/categories" },
    { name: "Status", icon: <Activity size={18} />, path: "/dashboard/status" },
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
        <nav className="mt-4 flex flex-col">
          {mainMenu.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-6 py-2.5 text-sm transition-all ${isActive
                  ? "bg-primary/10 text-primary border-r-4 border-primary font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
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
