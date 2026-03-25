import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  ShoppingCart,
  IndianRupee,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    monthlyRevenue: {},
  });

  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const params = {};
        if (selectedMonth !== "all") {
          params.month = selectedMonth;
        }

        const response = await api.get("/foods/admin/stats", { params });

        setStats(response.data.stats || response.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedMonth]);

  const chartData = useMemo(() => {
    if (selectedMonth === "all") {
      return MONTHS.map((month) => ({
        month,
        revenue: stats.monthlyRevenue?.[month] || 0,
      }));
    }

    return [
      {
        month: selectedMonth,
        revenue: stats.monthlyRevenue?.[selectedMonth] || 0,
      },
    ];
  }, [stats, selectedMonth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg font-semibold text-gray-600 dark:text-gray-800">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
              📊 FoodieHub Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Business overview & analytics
            </p>
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-44 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Months</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            title="Users"
            value={stats.totalUsers || 0}
            icon={<Users size={24} />}
            gradient="from-blue-500 to-blue-600"
          />

          <StatCard
            title="Orders"
            value={stats.totalOrders || 0}
            icon={<ShoppingCart size={24} />}
            gradient="from-purple-500 to-purple-600"
          />

          <StatCard
            title="Revenue"
            value={`₹${(stats.totalRevenue ?? 0).toLocaleString()}`}
            icon={<IndianRupee size={24} />}
            gradient="from-green-500 to-green-600"
          />

          <StatCard
            title="Products"
            value={stats.totalProducts || 0}
            icon={<Package size={24} />}
            gradient="from-indigo-500 to-indigo-600"
          />

          <StatCard
            title="Pending"
            value={stats.pendingOrders || 0}
            icon={<Clock size={24} />}
            gradient="from-yellow-500 to-yellow-600"
          />

          <StatCard
            title="Delivered"
            value={stats.deliveredOrders || 0}
            icon={<CheckCircle size={24} />}
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>

        {/* CHART */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
            📈 Monthly Revenue
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} text-white p-4 rounded-2xl shadow-sm hover:scale-[1.02] transition`}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-xs opacity-80">{title}</p>
        <h2 className="text-lg font-bold mt-1">{value}</h2>
      </div>
      <div className="opacity-80">{icon}</div>
    </div>
  </div>
);

export default AdminDashboard;
