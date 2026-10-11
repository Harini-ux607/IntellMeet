
import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CURRENT_USER_KEY = "intellmeet_current_user";

function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  if (!name?.trim()) return "GU";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Navbar() {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [currentUser] = useState(getCurrentUser);

  const navigate = useNavigate();

  const displayName = currentUser?.name || "Guest User";
  const displayEmail = currentUser?.email || "Not signed in";
  const initials = getInitials(displayName);

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/meetings?search=${encodeURIComponent(query)}`);
    }
  }

  function handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);

    setProfileOpen(false);
    navigate("/login");
  }

  return (
    <header className="app-navbar">
      <form className="navbar-search" onSubmit={handleSearch}>
        <Search size={19} />

        <input
          type="search"
          placeholder="Search meetings..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search meetings"
        />

        <button type="submit">Search</button>
      </form>

      <div className="navbar-actions">
        {/* Notifications */}
        <div className="navbar-dropdown-wrapper">
          <button
            type="button"
            className="navbar-icon-button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((previous) => !previous);
              setProfileOpen(false);
            }}
          >
            <Bell size={20} />
            <span className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="navbar-dropdown notification-dropdown">
              <h3>Notifications</h3>
              <p>You’re all caught up!</p>
            </div>
          )}
        </div>

        {/* Logged-in User Profile */}
        <div className="navbar-dropdown-wrapper">
          <button
            type="button"
            className="navbar-profile"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((previous) => !previous);
              setNotificationsOpen(false);
            }}
          >
            <span className="navbar-avatar">
              {currentUser?.name ? (
                initials
              ) : (
                <UserRound size={20} />
              )}
            </span>

            <span className="navbar-user-info">
              <strong>{displayName}</strong>
              <small>{displayEmail}</small>
            </span>

            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="navbar-dropdown profile-dropdown">
              <div className="navbar-profile-details">
                <strong>{displayName}</strong>
                <p>{displayEmail}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/workspace");
                }}
              >
                <Settings size={17} />
                Workspace
              </button>

              <button
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
