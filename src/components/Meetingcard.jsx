
import { CalendarDays, Clock, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";

function MeetingCard({ meeting }) {
  const {
    title = "Team Meeting",
    date = "Not scheduled",
    time = "Time not set",
    duration = "30 minutes",
    participants = 0,
    status = "Upcoming",
  } = meeting || {};

  return (
    <div className="meeting-card">
      <div className="meeting-card-top">
        <span className="meeting-card-icon">
          <Video size={22} />
        </span>

        <span
          className={`meeting-status ${status
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {status}
        </span>
      </div>

      <h3 className="meeting-card-title">{title}</h3>

      <div className="meeting-card-details">
        <p>
          <CalendarDays size={16} />
          <span>{date}</span>
        </p>

        <p>
          <Clock size={16} />
          <span>{time} · {duration}</span>
        </p>

        <p>
          <Users size={16} />
          <span>
            {participants} participant{participants === 1 ? "" : "s"}
          </span>
        </p>
      </div>

      <Link to="/meeting-room" className="meeting-card-button">
        <Video size={17} />
        Join Meeting
      </Link>
    </div>
  );
}

export default MeetingCard;
