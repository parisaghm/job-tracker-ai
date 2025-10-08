
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, BarChart2, FileCode, Plus, Menu } from "lucide-react";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Applications",
      path: "/applications",
      icon: FileText,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart2,
    },
    {
      name: "Resume AI",
      path: "/resume-analyzer",
      icon: FileCode,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
              JA
            </div>
            <h1 className="text-xl font-semibold ml-2">SmartApply</h1>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-lg mx-auto">
            JA
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="ml-auto"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mt-2 mx-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div className="pt-2">
        {!collapsed && <p className="px-4 py-2 text-sm text-gray-500">Menu</p>}
      </div>

      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-2 py-2 rounded-md group transition-colors",
                  isActive(item.path)
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5", 
                  collapsed ? "mx-auto" : "mr-3",
                  isActive(item.path) ? "text-purple-600" : "text-gray-500"
                )} />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <span className="absolute left-full ml-2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <Link to="/add-application">
          <Button
            className={cn(
              "bg-purple-600 hover:bg-purple-700 text-white w-full",
              collapsed ? "p-2" : ""
            )}
          >
            <Plus className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Add Job</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
