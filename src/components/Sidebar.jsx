// ✅ Updated Sidebar.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import {
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Warehouse,
  BarChart,
  Receipt,
  Users,
  Settings,
  Search,
  Menu,
  X,
} from "lucide-react";
import { BsPeople } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { FaMoneyBillWave, FaUserFriends } from "react-icons/fa";
import logo from "../assets/logo2.png";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    {
      section: "Main",
      items: [
        {
          label: "Dashboard",
          to: "/dashboard",
          icon: LayoutDashboard,
          roles: ["Admin", "Sales", "InventoryManager"],
        },
        {
          label: "Categories",
          to: "/categories",
          icon: Layers,
          roles: ["Admin", "InventoryManager"],
        },
        {
          label: "Products",
          to: "/products",
          icon: Package,
          roles: ["Admin", "InventoryManager"],
        },
        {
          label: "Customers",
          to: "/customers",
          icon: BsPeople,
          roles: ["Admin", "Sales"],
        },
        {
          label: "Orders",
          to: "/orders",
          icon: ShoppingCart,
          roles: ["Admin", "Sales"],
        },
        {
          label: "Inventory",
          to: "/inventory",
          icon: Warehouse,
          roles: ["Admin", "InventoryManager"],
        },
        {
          label: "Expenses",
          to: "/expenses",
          icon: FaMoneyBillWave,
          roles: ["Admin", "InventoryManager"],
        },
      ],
    },
    {
      section: "Reports",
      items: [
        {
          label: "Analytics",
          to: "/analytics",
          icon: BarChart,
          roles: ["Admin"],
        },
        {
          label: "Payment Analysis",
          to: "/payments",
          icon: MdPayment,
          roles: ["Admin", "Sales"],
        },
        { label: "Reports", to: "/reports", icon: Receipt, roles: ["Admin"] },
      ],
    },
    {
      section: "Users",
      items: [
        {
          label: "User Management",
          to: "/users",
          icon: FaUserFriends,
          roles: ["Admin"],
        },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const renderLinks = (items) =>
    items
      .filter(
        ({ label, roles }) =>
          roles.includes(user?.role) &&
          label.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(({ label, to, icon: Icon }) => (
        <li key={label}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center px-2 py-2 mt-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              }`
            }
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </NavLink>
        </li>
      ));

  const SidebarContent = () => (
    <>
      <nav className="h-screen bg-white border-r border-gray-200 z-40 flex flex-col">
        <div className="px-6 pt-8 pb-4">
          <img
            src={logo}
            alt="Tarpaulin Admin Logo"
            className="h-15 invert brightness-125 contrast-150"
          />
        </div>

        <div className="px-4 py-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Search className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 my-2 overflow-y-auto custom-scrollbar">
          {navItems.map(({ section, items }) => {
            const visibleItems = items.filter(
              ({ label, roles }) =>
                roles.includes(user?.role) &&
                label.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return visibleItems.length > 0 ? (
              <div key={section} className="px-4 mb-6">
                <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2 px-2">
                  {section}
                </h3>
                <ul>{renderLinks(visibleItems)}</ul>
              </div>
            ) : null;
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src={user?.profileImg || "https://placehold.co/40x40"}
              alt="User avatar"
              className="h-10 w-10 rounded-full mr-3 object-cover"
            />
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                {user?.name || "Admin User"}
              </h3>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@tarpaulin.com"}
              </p>
            </div>
            <button
              className="ml-auto cursor-pointer p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
              title="Logout"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>
    </>
  );

  return (
    <>
      <div className="hidden lg:block w-[280px] flex-shrink-0">
        <nav className="fixed top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-200 z-40 overflow-y-auto custom-scrollbar">
          {SidebarContent()}
        </nav>
      </div>

      <div className="lg:hidden p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 bg-white z-50">
        <img
          src={logo}
          alt="Logo"
          className="h-10 invert brightness-125 contrast-150"
        />
        <button
          className="p-2 text-gray-500 cursor-pointer focus:outline-none"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-white w-64 h-full shadow-lg p-4 overflow-y-auto lg:hidden custom-scrollbar">
          {SidebarContent()}
        </div>
      )}
    </>
  );
};

export default Sidebar;
