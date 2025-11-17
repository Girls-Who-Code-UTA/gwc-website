// src/pages/WhoWeAre.jsx
import Navbar from "./Navbar";
import "./Pages.css";

export default function WhoWeAre() {
    return (
        <div className="page-container">
            <div className="aura-layer"></div> 
        <Navbar />

        <div className="who-layout">
            {/* LEFT: image */}
            <div className="who-left">
            <img
                src="/group-photo.jpg" 
                alt="Girls Who Code UTA group photo"
            />
            </div>

            {/* RIGHT: text content */}
            <div className="who-right">
                <h1>Who We Are</h1>
                <p>
                <a href="https://girlswhocode.com" target="_blank" rel="noopener noreferrer"><strong>Girls Who Code</strong></a>
                {" "}is a national nonprofit organization working to
                close the gender gap in technology. Through coding education, mentorship, and
                supportive community spaces, Girls Who Code empowers young women and
                non-binary students to thrive in the world of technology.
                </p>

                <p>
                The <strong>University of Texas at Arlington Chapter</strong> of Girls Who Code
                was founded in twenty-twenty-five by <strong>Rohita Konjeti</strong> and <strong>Mariah Gardner</strong>.
                Our chapter brings together students who are passionate about coding,
                creativity, and inclusion. We aim to build a welcoming space where anyone,
                regardless of experience level, can learn and grow alongside supportive peers.
                </p>

                <p>
                Whether you’re curious about coding, want to develop new skills, or are
                looking to make meaningful connections, we’d love for you to join us.
                <strong> Get involved, stay curious, and help us make tech more inclusive for everyone!</strong>
                </p>
            </div>
        </div>
        </div>
    );
}