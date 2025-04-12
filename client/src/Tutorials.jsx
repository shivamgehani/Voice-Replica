import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tutorials.css";

const Tutorials = () => {
  const [selectedVoice, setSelectedVoice] = useState(""); // Store selected voice option
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedVoice === "random") {
      navigate("/home");
    } else if (selectedVoice === "shivam") {
      navigate("/shivam");
    } else if (selectedVoice === "trump") {
      navigate("/trump");
    } else if (selectedVoice === "newModel") {
      navigate("/newModel"); // Add navigation for the new model
    } else {
      alert("Please select a voice option before proceeding.");
    }
  };

  const handleLogout = () => {
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="tutorials-container">
      {/* Logout Button */}
      <button className="tutorials-logout-button" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="tutorials-title">Welcome to Voice Replica System</h1>
      <p className="tutorials-description">
        Hello and welcome! We’re thrilled to have you here.
        <br /><br />
        Generate speech in three powerful ways:
        <br></br>
        Famous Voices: Create audio in the voice of public figures like Modi.
        <br></br>
        Standard TTS: Convert text to speech with a natural, clear voice.
        <br></br>
        Your Voice Clone: Train a model with your voice and generate personalized audio.
        <br></br>
        Simply choose a model, enter your text, and bring your words to life!
      </p>

      {/* Voice Selection Section */}
      <div className="tutorials-voice-selection">
        <label className="tutorials-radio">
          <input
            type="radio"
            name="voice"
            value="trump"
            onChange={(e) => setSelectedVoice(e.target.value)}
          />
          <div className="voice-card">
            <img src="/images/modi.jpg" alt="Donald Trump" className="voice-image" />
            <span className="voice-name">PM Modi (Famous Persnolities)</span>
          </div>
        </label>

        <label className="tutorials-radio">
          <input
            type="radio"
            name="voice"
            value="shivam"
            onChange={(e) => setSelectedVoice(e.target.value)}
          />
          <div className="voice-card">
            <img src="/images/shivam.jpeg" alt="Shivam" className="voice-image" />
            <span className="voice-name">Trained model for LJSpeech</span>
          </div>
        </label>

        {/* <label className="tutorials-radio">
          <input
            type="radio"
            name="voice"
            value="random"
            onChange={(e) => setSelectedVoice(e.target.value)}
          />
          <div className="voice-card">
            <img src="/images/random.jpeg" alt="Random Voice" className="voice-image" />
            <span className="voice-name">Replica your own house</span>
          </div>
        </label> */}

        <label className="tutorials-radio">
          <input
            type="radio"
            name="voice"
            value="newModel"
            onChange={(e) => setSelectedVoice(e.target.value)}
          />
          <div className="voice-card">
            <img src="/images/random.jpeg" alt="" className="voice-image" />
            <span className="voice-name">Replica Your own Voice</span>
          </div>
        </label>
      </div>

      <button className="tutorials-start-button" onClick={handleStart}>
        Get Started
      </button>
    </div>
  );
};

export default Tutorials;