
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Video,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  Plus,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Meetings",
      path: "/meetings",
      icon: CalendarDays,
    },
    {
      title: "Workspace",
      path: "/workspace",
      icon: Users,
    },
  ];

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand" title="IntellMeet">
          <span className="sidebar-logo">
            <Video size={23} />
          </span>

          {!collapsed && (
            <span className="sidebar-brand-text">
              Intell<span>Meet</span>
            </span>
          )}
        </NavLink>

        <button
          type="button"
          className="sidebar-collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </button>
      </div>

      <button
        type="button"
        className="sidebar-create-button"
        onClick={() => navigate("/meetings")}
        title="Create a meeting"
      >
        <Plus size={20} />
        {!collapsed && <span>Create Meeting</span>}
      </button>

      <div className="sidebar-section">
        {!collapsed && <p className="sidebar-section-title">MENU</p>}

        <nav className="sidebar-navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                title={collapsed ? item.title : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-ai-card">
        <span className="sidebar-ai-icon">
          <Sparkles size={21} />
        </span>

        {!collapsed && (
          <div className="sidebar-ai-content">
            <h4>AI Assistant</h4>
            <p>Make meetings smarter with AI.</p>

            <button
              type="button"
              onClick={() => navigate("/meeting-room")}
            >
              Explore AI
            </button>
          </div>
        )}
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/workspace"
          className="sidebar-link"
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <button
          type="button"
          className="sidebar-link sidebar-logout"
          onClick={() => navigate("/login")}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <div className="sidebar-footer">
            <span className="sidebar-status-dot" />
            <span>IntellMeet Workspace</span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
