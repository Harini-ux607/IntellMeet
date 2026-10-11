
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Copy,
  Users,
  MessageSquare,
  Settings,
  Maximize,
} from "lucide-react";
import "../index.css";

function MeetingRoom() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const screenStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState(
    "Connecting your camera..."
  );

  useEffect(() => {
    async function startCamera() {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setMessage("You are ready to meet");
      } catch (error) {
        console.error("Camera access error:", error);
        setMessage(
          "Camera or microphone unavailable. Check your browser permissions."
        );
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      screenStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);

  function toggleMic() {
    const nextValue = !micOn;
    setMicOn(nextValue);

    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = nextValue;
    });
  }

  function toggleCamera() {
    const nextValue = !cameraOn;
    setCameraOn(nextValue);

    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = nextValue;
    });
  }

  async function toggleScreenShare() {
    if (sharing) {
      screenStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      screenStreamRef.current = null;
      setSharing(false);

      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }

      return;
    }

    try {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

      screenStreamRef.current = screenStream;

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }

      setSharing(true);

      screenStream.getVideoTracks()[0].onended = () => {
        setSharing(false);

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }

        screenStreamRef.current = null;
      };
    } catch (error) {
      console.error("Screen sharing error:", error);
      setMessage("Screen sharing was cancelled or unavailable.");
    }
  }

  async function copyMeetingId() {
    try {
      await navigator.clipboard.writeText("INTELLMEET-2026");
      setMessage("Meeting ID copied!");
    } catch {
      setMessage("Copy unavailable. Meeting ID: INTELLMEET-2026");
    }
  }

  function leaveMeeting() {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    screenStreamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    navigate("/");
  }

  return (
    <div className="meeting-room-page">
      <header className="room-header">
        <div className="room-brand">
          <div className="room-brand-icon">I</div>
          <div>
            <h2>IntellMeet</h2>
            <p>Meeting Room</p>
          </div>
        </div>

        <div className="room-meeting-info">
          <span className="live-indicator"></span>
          <span>Team Meeting</span>
          <button
            className="room-copy-button"
            onClick={copyMeetingId}
            title="Copy meeting ID"
          >
            <Copy size={15} />
            Copy ID
          </button>
        </div>

        <button
          className="room-settings-button"
          onClick={() =>
            setMessage("Meeting settings will be added soon.")
          }
        >
          <Settings size={18} />
        </button>
      </header>

      <main className="room-main">
        <div className="room-heading">
          <div>
            <h1>Team Meeting</h1>
            <p>Welcome to your collaboration room</p>
          </div>

          <div className="room-participant-count">
            <Users size={17} />
            <span>1 participant</span>
          </div>
        </div>

        <section className="room-video-grid">
          <div className="room-video-card">
            {cameraOn && !sharing ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="room-video"
              />
            ) : (
              <div className="room-video-placeholder">
                <div className="room-avatar">J</div>
                <p>{sharing ? "Screen sharing" : "Camera is off"}</p>
                {sharing && (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="room-video"
                  />
                )}
              </div>
            )}

            <div className="room-video-label">
              <span>{micOn ? "🎙" : "🔇"} You</span>
              <span className="room-you-badge">You</span>
            </div>

            <button
              className="room-fullscreen-button"
              onClick={() => {
                videoRef.current?.requestFullscreen?.();
              }}
              title="Fullscreen"
            >
              <Maximize size={17} />
            </button>
          </div>

          <div className="room-ai-card">
            <div className="room-ai-icon">AI</div>
            <h3>IntellMeet AI Assistant</h3>
            <p>
              Your meeting assistant will help capture notes,
              summaries, and action items.
            </p>
            <span className="room-coming-soon">
              AI assistant integration coming soon
            </span>
          </div>
        </section>

        <p className="room-status-message">{message}</p>

        <section className="room-toolbar">
          <button
            className={`room-control ${!micOn ? "control-off" : ""}`}
            onClick={toggleMic}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            <span>{micOn ? "Mute" : "Unmute"}</span>
          </button>

          <button
            className={`room-control ${!cameraOn ? "control-off" : ""}`}
            onClick={toggleCamera}
          >
            {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            <span>{cameraOn ? "Stop video" : "Start video"}</span>
          </button>

          <button
            className={`room-control ${sharing ? "control-active" : ""}`}
            onClick={toggleScreenShare}
          >
            <Monitor size={20} />
            <span>{sharing ? "Stop sharing" : "Share screen"}</span>
          </button>

          <button
            className="room-control"
            onClick={() =>
              setMessage("Meeting chat will be added in a later step.")
            }
          >
            <MessageSquare size={20} />
            <span>Chat</span>
          </button>

          <button
            className="room-leave-button"
            onClick={leaveMeeting}
          >
            <PhoneOff size={20} />
            <span>Leave</span>
          </button>
        </section>

        <footer className="room-footer">
          <span>Meeting ID: INTELLMEET-2026</span>
          <span>IntellMeet Collaboration Platform</span>
        </footer>
      </main>
    </div>
  );
}

export default MeetingRoom;
