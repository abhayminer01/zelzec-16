import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Boxes,
  Shield,
  FolderCog,
  TrendingUp,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Admins",
      icon: <Shield size={26} />,
      color: "bg-indigo-500",
      action: () => navigate("/dashboard/admins"),
    },
    {
      title: "Manage Categories",
      icon: <FolderCog size={26} />,
      color: "bg-blue-500",
      action: () => navigate("/dashboard/categories"),
    },
    {
      title: "Manage Users",
      icon: <Users size={26} />,
      color: "bg-emerald-500",
      action: () => navigate("/dashboard/users"),
    },
    {
      title: "Manage Products",
      icon: <Boxes size={26} />,
      color: "bg-purple-500",
      action: () => navigate("/dashboard/products"),
    },
  ];

  // Dummy data for app traffic
  const trafficData = [
    { month: "Jan", users: 0 },
    { month: "Feb", users: 0 },
    { month: "Mar", users: 0 },
    { month: "Apr", users: 0 },
    { month: "May", users: 0 },
    { month: "Jun", users: 0 },
    { month: "Jul", users: 0 },
    { month: "Aug", users: 2 },
    { month: "Sep", users: 5 },
    { month: "Oct", users: 10 },
    { month: "Nov", users: 0 },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-gray-50 p-10">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            ZelZec Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, manage your system efficiently.
          </p>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className={`cursor-pointer rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white border border-gray-100 flex flex-col items-start gap-3 hover:-translate-y-1`}
            >
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                {card.icon}
              </div>
              <h2 className="text-gray-800 font-semibold text-lg">
                {card.title}
              </h2>
            </div>
          ))}
        </section>

        {/* Graph Section */}
        <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} />
              App Traffic Overview
            </h2>
            <span className="text-sm text-gray-500">Last 11 months</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
