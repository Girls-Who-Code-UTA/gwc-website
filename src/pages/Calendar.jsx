import Navbar from "./Navbar";
import "./Pages.css";

export default function CalendarPage() {
  return (
    <div className="page-container">
      <div className="overlay"></div>
      <Navbar />

      <div className="page-content">
        <h1>Upcoming Events</h1>

        <iframe
          src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=America%2FChicago"
          style={{
            border: 0,
            width: "90%",
            height: "75vh",
            borderRadius: "15px",
            background: "rgba(255,255,255,0.1)",
          }}
          frameBorder="0"
          scrolling="no"
          title="GWC Calendar"
        ></iframe>
      </div>
    </div>
  );
}