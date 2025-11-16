// src/pages/GetInvolved.jsx
import Navbar from "./Navbar";
import "./Pages.css";

export default function GetInvolved() {
    return (
        <div className="page-container">
        <div className="overlay"></div>
        <Navbar />

        <div className="getinvolved-layout">
            {/* LEFT SIDE: title + blurb */}
            <div className="getinvolved-left">
            <h1>Get Involved!</h1>
            <p>
                There are so many ways to connect with Girls Who Code at UTA,
                from joining our meetings, to following us online, to exploring
                national opportunities with GWC. Our socials are the best way to stay in the loop!
            </p>
            </div>

            {/* RIGHT SIDE: link buttons inside a glassy panel */}
            <div className="getinvolved-right">
            <div className="links-card">
                <a
                href="https://mavengage.uta.edu/submitter/form/start/695479"
                target="_blank"
                rel="noopener noreferrer"
                >
                Become a member on MavEngage
                </a>

                <a
                href="https://hq.girlswhocode.com/join-program/qrCodeInvitation/CL64404"
                target="_blank"
                rel="noopener noreferrer"
                >
                Register with GWC National
                </a>

                <a
                href="https://discord.gg/sfxdaddu"
                target="_blank"
                rel="noopener noreferrer"
                >
                Join Our Discord
                </a>

                <a
                href="https://www.instagram.com/gwc.uta?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                >
                Follow Us on Instagram
                </a>
            </div>
            </div>
        </div>
        </div>
    );
}