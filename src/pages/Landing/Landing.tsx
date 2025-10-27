import { useNavigate } from "react-router-dom";
import "./Landing.css";
import bg from "../../assets/bg.jpg";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing-root" style={{ backgroundImage: `url(${bg})` }}>
            <div className="landing-content">

                {/* Creators */}
                <div className="landing-creators">
                    <p>Creators:</p>
                    <p>Polina Melnyk</p>
                    <p>Diana Velychko</p>
                </div>

                {/* Title */}
                <h1 className="landing-title">SHOWCASE</h1>
                <p className="landing-subtitle">
                    YOUR STORY,
                    <br />
                    <span>BEYOND THE RESUME</span>
                </p>

                {/* CTA */}
                <button className="landing-button" onClick={() => navigate("/login")}>
                    Start your career <span className="arrow">→</span>
                </button>
            </div>

            {/* Vertical Text */}
            <div className="landing-side-text">SHOWCASE</div>

            {/* Right blur */}
            <div className="landing-right-panel" style={{ backgroundImage: `url(${bg})` }}></div>
        </div>
    );
}


