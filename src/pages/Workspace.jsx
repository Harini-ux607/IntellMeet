
import { useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  CalendarDays,
  ArrowUpRight,
  MoreHorizontal,
  X,
} from "lucide-react";
import "../index.css";

const initialWorkspaces = [
  {
    id: 1,
    name: "Frontend Development",
    description: "React, UI development, and frontend tasks",
    members: 5,
    color: "#6558e8",
    projects: 3,
  },
  {
    id: 2,
    name: "AI Innovation Team",
    description: "AI features and intelligent automation",
    members: 4,
    color: "#0891b2",
    projects: 2,
  },
  {
    id: 3,
    name: "Product Planning",
    description: "Product ideas, planning, and collaboration",
    members: 6,
    color: "#d97706",
    projects: 4,
  },
];

function getLoggedInUser() {
  try {
    const storedUser = localStorage.getItem(
      "intellmeet_current_user"
    );

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function Workspace() {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState("");

  const [currentUser] = useState(getLoggedInUser);
  const displayName = currentUser?.name?.trim() || "Guest User";

  const filteredWorkspaces = workspaces.filter((workspace) =>
    `${workspace.name} ${workspace.description}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const totalMembers = workspaces.reduce(
    (total, workspace) => total + workspace.members,
    0
  );

  const totalProjects = workspaces.reduce(
    (total, workspace) => total + workspace.projects,
    0
  );

  function createWorkspace(event) {
    event.preventDefault();

    if (!workspaceName.trim()) {
      setNotice("Please enter a workspace name.");
      return;
    }

    const newWorkspace = {
      id: Date.now(),
      name: workspaceName.trim(),
      description:
        description.trim() || "A new collaboration workspace",
      members: 1,
      color: "#0d9488",
      projects: 0,
    };

    setWorkspaces((previous) => [
      newWorkspace,
      ...previous,
    ]);

    setWorkspaceName("");
    setDescription("");
    setShowForm(false);
    setSearch("");
    setNotice("Workspace created successfully!");
  }

  function openCreateForm() {
    setShowForm(true);
    setNotice("");
  }

  return (
    <div className="workspace-content">
      {/* Page heading */}
      <header className="workspace-topbar">
        <div>
          <p className="workspace-breadcrumb">
            IntellMeet / Workspaces
          </p>
          <h1>Team Workspaces</h1>
          <p>Welcome, {displayName}!</p>
        </div>

        <button
          type="button"
          className="workspace-create-button"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Create Workspace
        </button>
      </header>

      {/* Introduction */}
      <section className="workspace-intro">
        <div>
          <h2>Bring your team together</h2>
          <p>
            Organize projects, coordinate meetings, and collaborate
            with your team in one place.
          </p>
        </div>

        <div className="workspace-intro-icon">
          <Users size={34} />
        </div>
      </section>

      {/* Notification */}
      {notice && (
        <div className="workspace-notice" role="status">
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Create workspace form */}
      {showForm && (
        <section className="workspace-form-card">
          <div className="workspace-form-heading">
            <div>
              <h2>Create a workspace</h2>
              <p>Give your team a place to collaborate.</p>
            </div>

            <button
              type="button"
              className="workspace-close-button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={createWorkspace}>
            <label htmlFor="workspaceName">
              Workspace name
            </label>

            <input
              id="workspaceName"
              type="text"
              placeholder="e.g. Marketing Team"
              value={workspaceName}
              onChange={(event) =>
                setWorkspaceName(event.target.value)
              }
              required
            />

            <label htmlFor="workspaceDescription">
              Description
            </label>

            <textarea
              id="workspaceDescription"
              placeholder="What will your team work on?"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={3}
            />

            <div className="workspace-form-actions">
              <button
                type="button"
                className="workspace-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="workspace-create-button"
              >
                <Plus size={17} />
                Create Workspace
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Statistics */}
      <section className="workspace-stat-grid">
        <div className="workspace-stat-card">
          <div className="workspace-stat-icon purple">
            <FolderKanban size={21} />
          </div>

          <div>
            <p>Total workspaces</p>
            <h3>{workspaces.length}</h3>
          </div>
        </div>

        <div className="workspace-stat-card">
          <div className="workspace-stat-icon blue">
            <Users size={21} />
          </div>

          <div>
            <p>Team members</p>
            <h3>{totalMembers}</h3>
          </div>
        </div>

        <div className="workspace-stat-card">
          <div className="workspace-stat-icon orange">
            <CalendarDays size={21} />
          </div>

          <div>
            <p>Projects</p>
            <h3>{totalProjects}</h3>
          </div>
        </div>
      </section>

      {/* Workspace list */}
      <section className="workspace-list-section">
        <div className="workspace-list-heading">
          <div>
            <h2>Your workspaces</h2>
            <p>Choose a workspace to view its details.</p>
          </div>

          <label className="workspace-search">
            <Search size={18} />

            <input
              type="search"
              placeholder="Search workspaces..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search workspaces"
            />
          </label>
        </div>

        <div className="workspace-card-grid">
          {filteredWorkspaces.map((workspace) => (
            <article
              className="workspace-card"
              key={workspace.id}
            >
              <div className="workspace-card-top">
                <div
                  className="workspace-card-icon"
                  style={{ background: workspace.color }}
                >
                  <FolderKanban size={23} />
                </div>

                <button
                  type="button"
                  className="workspace-more-button"
                  onClick={() => setSelectedWorkspace(workspace)}
                  title="View workspace details"
                  aria-label={`Details for ${workspace.name}`}
                >
                  <MoreHorizontal size={21} />
                </button>
              </div>

              <h3>{workspace.name}</h3>

              <p className="workspace-card-description">
                {workspace.description}
              </p>

              <div className="workspace-card-meta">
                <span>
                  <Users size={16} />
                  {workspace.members} members
                </span>

                <span>
                  <FolderKanban size={16} />
                  {workspace.projects} projects
                </span>
              </div>

              <button
                type="button"
                className="workspace-open-button"
                onClick={() => setSelectedWorkspace(workspace)}
              >
                View workspace
                <ArrowUpRight size={17} />
              </button>
            </article>
          ))}

          {filteredWorkspaces.length === 0 && (
            <div className="workspace-empty-state">
              <FolderKanban size={35} />
              <h3>No workspaces found</h3>
              <p>
                Try a different search or create a workspace.
              </p>

              <button
                type="button"
                className="workspace-create-button"
                onClick={openCreateForm}
              >
                <Plus size={17} />
                Create Workspace
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Workspace detail modal */}
      {selectedWorkspace && (
        <div
          className="workspace-modal-overlay"
          onClick={() => setSelectedWorkspace(null)}
        >
          <section
            className="workspace-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="workspace-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="workspace-close-button"
              onClick={() => setSelectedWorkspace(null)}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <div
              className="workspace-card-icon"
              style={{ background: selectedWorkspace.color }}
            >
              <FolderKanban size={25} />
            </div>

            <h2 id="workspace-detail-title">
              {selectedWorkspace.name}
            </h2>

            <p>{selectedWorkspace.description}</p>

            <div className="workspace-detail-stats">
              <div>
                <strong>{selectedWorkspace.members}</strong>
                <span>Members</span>
              </div>

              <div>
                <strong>{selectedWorkspace.projects}</strong>
                <span>Projects</span>
              </div>
            </div>

            <p className="workspace-detail-note">
              Team invitations, shared files, and collaborative
              project tools are not connected in this frontend demo.
            </p>

            <button
              type="button"
              className="workspace-create-button"
              onClick={() => setSelectedWorkspace(null)}
            >
              Close Details
            </button>
          </section>
        </div>
      )}

      <footer className="workspace-footer">
        IntellMeet · Enterprise Collaboration Platform
      </footer>
    </div>
  );
}

export default Workspace;
