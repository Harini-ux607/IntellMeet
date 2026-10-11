
import { useState } from "react";
import {
  Video,
  CalendarDays,
  Users,
  Clock,
  Plus,
  Sparkles,
  ArrowUpRight,
  MoreHorizontal,
  Mic,
  CircleCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import MeetingCard from "../components/Meetingcard.jsx";
import "../index.css";

const initialMeetings = [
  {
    id: 1,
    title: "Weekly Team Standup",
    date: "Today",
    time: "10:30 AM",
    duration: "30 min",
    participants: 6,
    color: "purple",
    status: "Upcoming",
    description: "Discuss team progress and weekly priorities.",
  },
  {
    id: 2,
    title: "Product Design Review",
    date: "Today",
    time: "2:00 PM",
    duration: "45 min",
    participants: 4,
    color: "blue",
    status: "Upcoming",
    description: "Review product screens and design improvements.",
  },
  {
    id: 3,
    title: "Sprint Planning",
    date: "Tomorrow",
    time: "11:00 AM",
    duration: "60 min",
    participants: 8,
    color: "orange",
    status: "Scheduled",
    description: "Plan upcoming development tasks and priorities.",
  },
];

const activities = [
  {
    title: "Weekly Team Standup",
    description: "Meeting summary generated",
    time: "Today, 9:45 AM",
    icon: Sparkles,
    color: "purple",
  },
  {
    title: "Product Design Review",
    description: "4 action items extracted",
    time: "Yesterday, 3:30 PM",
    icon: CircleCheck,
    color: "green",
  },
  {
    title: "Client Discussion",
    description: "Transcript is ready",
    time: "Yesterday, 11:20 AM",
    icon: Mic,
    color: "blue",
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

function Dashboard() {
  const [meetings, setMeetings] = useState(initialMeetings);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");

  // Read the logged-in user's details from browser storage.
  const [currentUser] = useState(getLoggedInUser);

  const displayName = currentUser?.name?.trim() || "there";

  function createMeeting(event) {
    event.preventDefault();

    if (!meetingTitle.trim()) return;

    const newMeeting = {
      id: Date.now(),
      title: meetingTitle.trim(),
      date: "Today",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: "30 min",
      participants: 1,
      color: "purple",
      status: "Upcoming",
      description: "New meeting created from the dashboard.",
    };

    setMeetings((previous) => [newMeeting, ...previous]);
    setMeetingTitle("");
    setShowCreateForm(false);
  }

  return (
    <div className="dashboard-content">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div>
          <p className="eyebrow">
            <span className="status-dot"></span>
            YOUR COLLABORATION HUB
          </p>

          <h1>
            Welcome, {displayName} <span>✦</span>
          </h1>

          <p className="welcome-description">
            Here's what's happening with your team today.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowCreateForm((previous) => !previous)}
        >
          <Plus size={19} />
          Create meeting
        </button>
      </section>

      {/* Create Meeting Form */}
      {showCreateForm && (
        <form
          className="create-meeting-form"
          onSubmit={createMeeting}
        >
          <div>
            <h3>Create a new meeting</h3>
            <p>
              Give your meeting a name to add it to your dashboard.
            </p>
          </div>

          <input
            type="text"
            placeholder="Enter meeting title"
            value={meetingTitle}
            onChange={(event) => setMeetingTitle(event.target.value)}
            required
            autoFocus
          />

          <button className="primary-button" type="submit">
            <Plus size={17} />
            Add meeting
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setShowCreateForm(false);
              setMeetingTitle("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon purple-bg">
              <Video size={21} />
            </div>
            <span className="stat-caption">Meetings</span>
          </div>

          <h2>{String(meetings.length).padStart(2, "0")}</h2>
          <p>Total meetings in your list</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon blue-bg">
              <Clock size={21} />
            </div>
            <span className="stat-caption">Meeting time</span>
          </div>

          <h2>
            12.5 <small>hrs</small>
          </h2>
          <p>Illustrative monthly total</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon green-bg">
              <Users size={21} />
            </div>
            <span className="stat-caption">Team</span>
          </div>

          <h2>08</h2>
          <p>Sample workspace members</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon orange-bg">
              <Sparkles size={21} />
            </div>
            <span className="stat-caption">AI insights</span>
          </div>

          <h2>24</h2>
          <p>Sample insights generated</p>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="content-grid">
        <div className="panel meetings-panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming meetings</h2>
              <p>Stay prepared for what's next.</p>
            </div>

            <Link to="/meetings" className="text-link">
              View all <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="dashboard-meeting-cards">
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                />
              ))
            ) : (
              <div className="empty-state">
                <CalendarDays size={25} />
                <h3>No meetings yet</h3>
                <p>Create a meeting to see it here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="panel calendar-panel">
          <div className="panel-heading">
            <div>
              <h2>Today's schedule</h2>
              <p>Your daily overview.</p>
            </div>

            <CalendarDays size={20} className="muted-icon" />
          </div>

          <div className="schedule-date">
            <div className="schedule-day">
              {new Date().getDate()}
            </div>

            <div>
              <strong>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </strong>

              <p>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-time">10:30 AM</span>

              <div className="timeline-event purple-line">
                <strong>Weekly Team Standup</strong>
                <span>30 minutes · Team sync</span>
              </div>
            </div>

            <div className="timeline-item">
              <span className="timeline-time">2:00 PM</span>

              <div className="timeline-event blue-line">
                <strong>Product Design Review</strong>
                <span>45 minutes · Design team</span>
              </div>
            </div>
          </div>

          <button
            className="schedule-button"
            type="button"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={17} />
            Schedule a meeting
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="panel activity-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent activity</h2>
            <p>Your team's latest meeting updates.</p>
          </div>

          <button
            className="icon-button"
            type="button"
            aria-label="More activity options"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="activity-list">
          {activities.map((activity, index) => {
            const ActivityIcon = activity.icon;

            return (
              <div className="activity-item" key={index}>
                <div className={`activity-icon ${activity.color}`}>
                  <ActivityIcon size={19} />
                </div>

                <div className="activity-details">
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                </div>

                <span className="activity-time">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Banner */}
      <section className="ai-banner" id="ai-insights">
        <div className="ai-banner-icon">
          <Sparkles size={26} />
        </div>

        <div className="ai-banner-content">
          <span>MEET INTELLIGENTLY</span>
          <h2>Less note-taking. More meaningful work.</h2>

          <p>
            Turn meeting conversations into summaries, decisions,
            and actionable next steps.
          </p>
        </div>

        <Link to="/meetings" className="ai-banner-button">
          Explore meetings <ArrowUpRight size={17} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <span>© {new Date().getFullYear()} IntellMeet</span>

        <span>
          Built for better collaboration <Sparkles size={13} />
        </span>
      </footer>
    </div>
  );
}

export default Dashboard;
