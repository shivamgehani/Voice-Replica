import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tutorials.css";

const Tutorials = () => {
  const [selectedVoice, setSelectedVoice] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedVoice === "random") {
      navigate("/home");
    } else if (selectedVoice === "shivam") {
      navigate("/shivam");
    } else if (selectedVoice === "trump") {
      navigate("/trump");
    } else if (selectedVoice === "newModel") {
      navigate("/newModel");
    } else {
      alert("Please select a voice option before proceeding.");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="tutorials-page">
      {/* Top Navigation Bar */}
      <header className="tutorials-header">
        <div className="tutorials-header__brand">Voice Replica System</div>
        <div className="tutorials-header__nav">
          
        <button className="tutorials-header__button" onClick={() => navigate("/tutorials")}>Home</button>
          <button className="tutorials-header__button" onClick={() => navigate("/trump")}>PM Modi</button>
          <button className="tutorials-header__button" onClick={() => navigate("/shivam")}>Lj Speech</button>
          <button className="tutorials-header__button" onClick={() => navigate("/home")}>Replica Your own voice</button>
          <button className="tutorials-header__logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="tutorials-main">
        <div className="tutorials-container">
          <div className="tutorials-content">
            <h1 className="tutorials-content__title">Welcome to Voice Replica System</h1>
            <div className="tutorials-content__description">
              
              <p className="description-paragraph">
                Generate speech in three powerful ways:
              </p>
              <ul className="features-list">
                <li className="features-list__item">
                  <span className="feature-highlight">Famous Voices:</span> Create audio in the voice of public figures like Modi.
                </li>
                <li className="features-list__item">
                  <span className="feature-highlight">Standard TTS:</span> Convert text to speech with a natural, clear voice.
                </li>
                <li className="features-list__item">
                  <span className="feature-highlight">Your Voice Clone:</span> Train a model with your voice and generate personalized audio.
                </li>
              </ul>
              <p className="description-paragraph">
                Simply choose a model, enter your text, and bring your words to life!
              </p>
            </div>

            {/* Voice Selection Section */}
            <div className="voice-selection">
              <h2 className="voice-selection__title">Select Your Voice Model</h2>
              <div className="tutorials-options">
                <label className="tutorials-option">
                  <input
                    type="radio"
                    name="voice"
                    value="trump"
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  />
                  <div className="tutorials-option__card">
                    <img src="/images/modi.jpg" alt="PM Modi" className="tutorials-option__image" />
                    <span className="tutorials-option__name">PM Modi (Famous Personalities)</span>
                  </div>
                </label>

                <label className="tutorials-option">
                  <input
                    type="radio"
                    name="voice"
                    value="shivam"
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  />
                  <div className="tutorials-option__card">
                    <img src="/images/shivam.jpeg" alt="Shivam" className="tutorials-option__image" />
                    <span className="tutorials-option__name">Trained model for LJSpeech</span>
                  </div>
                </label>

                <label className="tutorials-option">
                  <input
                    type="radio"
                    name="voice"
                    value="random"
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  />
                  <div className="tutorials-option__card">
                    <img src="/images/random.jpeg" alt="Random Voice" className="tutorials-option__image" />
                    <span className="tutorials-option__name">Standard TTS Voice</span>
                  </div>
                </label>

                <label className="tutorials-option">
                  <input
                    type="radio"
                    name="voice"
                    value="newModel"
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  />
                  <div className="tutorials-option__card">
                    <img src="/images/random.jpeg" alt="Custom Voice" className="tutorials-option__image" />
                    <span className="tutorials-option__name">Your Voice Clone</span>
                  </div>
                </label>
              </div>
            </div>

            <button className="tutorials-content__button" onClick={handleStart}>
              Get Started
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="tutorials-footer">
        <div className="tutorials-footer__content">
          <span>© 2025 Voice Replica System. All rights reserved.</span>
          <div className="tutorials-footer__links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Tutorials;