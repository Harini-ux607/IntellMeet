
import { useEffect, useState } from "react";
import {
  Video,
  Plus,
  Search,
  CalendarDays,
  Users,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MeetingCard from "../components/Meetingcard.jsx";
import "../index.css";

const initialMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    date: "Today",
    time: "10:30 AM",
    duration: "30 minutes",
    participants: 6,
    status: "Upcoming",
    color: "purple",
    description: "Discuss team progress and weekly priorities.",
  },
  {
    id: 2,
    title: "Product Design Review",
    date: "Today",
    time: "2:00 PM",
    duration: "45 minutes",
    participants: 4,
    status: "Upcoming",
    color: "blue",
    description: "Review product screens and design improvements.",
  },
  {
    id: 3,
    title: "Sprint Planning",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "60 minutes",
    participants: 8,
    status: "Scheduled",
    color: "orange",
    description: "Plan upcoming development tasks and priorities.",
  },
  {
    id: 4,
    title: "AI Project Discussion",
    date: "Tomorrow",
    time: "3:00 PM",
    duration: "45 minutes",
    participants: 5,
    status: "Scheduled",
    color: "green",
    description: "Discuss AI integration and project milestones.",
  },
];

function Meetings() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "30 minutes",
    description: "",
  });

  const filters = ["All", "Upcoming", "Scheduled"];

  // Keep the search synchronized with the Navbar search.
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // Search meetings and apply the selected filter.
  const filteredMeetings = meetings.filter((meeting) => {
    const searchableText =
      `${meeting.title} ${meeting.description}`.toLowerCase();

    const matchesSearch = searchableText.includes(
      search.trim().toLowerCase()
    );

    const matchesFilter =
      activeFilter === "All" ||
      meeting.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCreateMeeting(event) {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.date ||
      !formData.time
    ) {
      return;
    }

    const newMeeting = {
      id: Date.now(),
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      participants: 1,
      status: "Scheduled",
      color: "purple",
      description:
        formData.description.trim() ||
        "No meeting description added.",
    };

    setMeetings((previous) => [
      newMeeting,
      ...previous,
    ]);

    setFormData({
      title: "",
      date: "",
      time: "",
      duration: "30 minutes",
      description: "",
    });

    setShowForm(false);
    setActiveFilter("All");
    setSearch("");
    setSearchParams({});
  }

  return (
    <div className="meetings-page">
      <main className="meetings-main">
        {/* Page Heading */}
        <section className="meetings-heading">
          <div>
            <p className="eyebrow">
              <span className="status-dot"></span>
              YOUR COLLABORATION HUB
            </p>

            <h1>Meetings</h1>

            <p className="meetings-subtitle">
              Organize your schedule and stay connected
              with your team.
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Create meeting
          </button>
        </section>

        {/* Summary Cards */}
        <section className="meeting-summary-grid">
          <div className="meeting-summary-card">
            <div className="stat-icon purple-bg">
              <Video size={20} />
            </div>

            <div>
              <p>Total meetings</p>
              <h2>{meetings.length}</h2>
            </div>
          </div>

          <div className="meeting-summary-card">
            <div className="stat-icon blue-bg">
              <CalendarDays size={20} />
            </div>

            <div>
              <p>Upcoming</p>
              <h2>
                {
                  meetings.filter(
                    (meeting) =>
                      meeting.status === "Upcoming"
                  ).length
                }
              </h2>
            </div>
          </div>

          <div className="meeting-summary-card">
            <div className="stat-icon green-bg">
              <Users size={20} />
            </div>

            <div>
              <p>Total participants</p>
              <h2>
                {meetings.reduce(
                  (total, meeting) =>
                    total + meeting.participants,
                  0
                )}
              </h2>
            </div>
          </div>
        </section>

        {/* Create Meeting Form */}
        {showForm && (
          <section className="meeting-form-panel">
            <div className="meeting-form-heading">
              <div>
                <h2>Create a meeting</h2>
                <p>
                  Add the details for your new meeting.
                </p>
              </div>

              <button
                className="icon-button"
                type="button"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting}>
              <div className="meeting-form-grid">
                <label>
                  Meeting title *
                  <input
                    name="title"
                    type="text"
                    placeholder="e.g. Frontend Team Meeting"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Date *
                  <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date()
                      .toLocaleDateString("en-CA")}
                    required
                  />
                </label>

                <label>
                  Time *
                  <input
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Duration
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                  >
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </label>
              </div>

              <label className="meeting-description-label">
                Description
                <textarea
                  name="description"
                  placeholder="What will you discuss in this meeting?"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </label>

              <div className="meeting-form-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  className="primary-button"
                  type="submit"
                >
                  <Plus size={17} />
                  Save meeting
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Meetings List */}
        <section className="meetings-list-panel">
          <div className="meetings-list-heading">
            <div>
              <h2>All meetings</h2>
              <p>
                Manage and join your scheduled sessions.
              </p>
            </div>

            <label className="meetings-search">
              <Search size={17} />

              <input
                type="search"
                placeholder="Search meetings..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </label>
          </div>

          {/* Filters */}
          <div className="meetings-filters">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={`filter-button ${
                  activeFilter === filter ? "selected" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}

                {filter === "All" && (
                  <span className="filter-count">
                    {meetings.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Reusable MeetingCard Component */}
          <div className="meetings-cards-grid">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                />
              ))
            ) : (
              <div className="meetings-empty">
                <CalendarDays size={35} />

                <h3>No meetings found</h3>

                <p>
                  Try another search or create a new meeting.
                </p>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={17} />
                  Create meeting
                </button>
              </div>
            )}
          </div>
        </section>

        <footer className="meetings-footer">
          <span>
            © {new Date().getFullYear()} IntellMeet
          </span>

          <span>Meet smarter. Work better.</span>
        </footer>
      </main>
    </div>
  );
}

export default Meetings;
