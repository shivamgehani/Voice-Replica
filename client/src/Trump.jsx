import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Trump.css"; // Import CSS for styling

const Trump = () => {
    const [text, setText] = useState("");
    const [speaker, setSpeaker] = useState("[spkr_66]"); // Default speaker ID
    const [generatedFile, setGeneratedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false); // State for feedback prompt
    const [feedback, setFeedback] = useState(""); // State for feedback input
    const navigate = useNavigate();

    const unethicalWords = [
        "abuse", "hate", "violence", "threat", "racist", "sexist", "harass", 
        "bully", "discriminate", "insult", "curse", "slur", "profanity", 
        "obscene", "exploit", "demean", "degrade", "intimidate", "shame", 
        "vulgar", "offend", "malicious", "toxic", "manipulate"
    ]; // Add your list of unethical words here

    // Available speakers
    const speakers = [
        { id: "[spkr_63]", name: "🇬🇧 👨 Book Reader" },
        { id: "[spkr_67]", name: "🇺🇸 👨 Influencer" },
        { id: "[spkr_68]", name: "🇮🇳 👨 Book Reader" },
        { id: "[spkr_69]", name: "🇮🇳 👨 Book Reader" },
        { id: "[spkr_70]", name: "🇮🇳 👨 Motivational Speaker" },
        { id: "[spkr_62]", name: "🇮🇳 👨 Book Reader (Heavy)" },
        { id: "[spkr_53]", name: "🇮🇳 👩 Recipe Reciter" },
        { id: "[spkr_60]", name: "🇮🇳 👩 Book Reader" },
        { id: "[spkr_74]", name: "🇺🇸 👨 Book Reader" },
        { id: "[spkr_75]", name: "🇮🇳 👨 Entrepreneur" },
        { id: "[spkr_76]", name: "🇬🇧 👨 Nature Lover" },
        { id: "[spkr_77]", name: "🇮🇳 👨 Influencer" },
        { id: "[spkr_66]", name: "🇮🇳 👨 Politician" },
    ];

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:3001/stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs((prevLogs) => [...prevLogs, data.message]);
        };

        return () => eventSource.close();
    }, []);

    const handleGenerateVoice = () => {
        if (!text.trim()) {
            alert("Please enter text to generate voice.");
            return;
        }

        if (!speaker.trim()) {
            alert("Please select a speaker.");
            return;
        }

        // Check for unethical words
        const containsUnethicalWord = unethicalWords.some(word => text.toLowerCase().includes(word.toLowerCase()));

        if (containsUnethicalWord) {
            alert("Please remove unethical words to generate voice.");
            return;
        }

        setIsLoading(true);
        setLogs([]);

        const payload = {
            text: text,
            speaker: speaker,
        };

        axios.post("http://localhost:3001/generate-voice-hf", payload)
            .then(response => {
                const fileUrl = `http://localhost:3001${response.data.filePath}?t=${Date.now()}`;
                setGeneratedFile(fileUrl);

                // Show feedback prompt after 30 seconds
                setTimeout(() => {
                    setShowFeedbackPrompt(true);
                }, 3000); // 3 seconds
            })
            .catch(error => {
                console.error("Error generating voice:", error);
            })
            .finally(() => setIsLoading(false));
    };

    const handleFeedbackSubmit = async () => {
        if (!feedback.trim()) {
            alert("Please enter your feedback.");
            return;
        }

        try {
            await axios.post("http://localhost:3001/submit-feedback", {
                feedback,
            });
            alert("Thank you for your feedback!");
            setShowFeedbackPrompt(false); // Hide the feedback prompt
            setFeedback(""); // Clear the feedback input
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback. Please try again.");
        }
    };

    const handleLogout = () => {
        navigate("/login"); // Navigate back to login page
    };

    return (
        <div className="home-container">
            <button className="home-logout-button" onClick={handleLogout}>
                Logout
            </button>

            <h1 className="home-title">Text-to-Speech Voice Generator (Famous Personalities)</h1><br /><br />

            {/* Key Features Section */}
            <div className="key-features">
                
            </div>

            {/* Text Input */}
            <textarea
                className="home-textarea"
                rows="4"
                cols="50"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
            />

            {/* Speaker Selection Dropdown */}
            <div className="speaker-selection">
                <label htmlFor="speaker">Select Speaker:</label>
                <select
                    id="speaker"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="home-speaker-input"
                >
                    {speakers.map((spkr) => (
                        <option key={spkr.id} value={spkr.id}>
                            {spkr.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Generate Voice Button */}
            <button className="home-generate-button" onClick={handleGenerateVoice} disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Voice"}
            </button>

            

            {/* Generated Audio */}
            {generatedFile && (
                <div className="home-audio-container">
                    <h3>Generated Voice:</h3>
                    <audio key={generatedFile} controls>
                        <source src={generatedFile} type="audio/wav" />
                        Your browser does not support the audio element.
                    </audio>
                    <br />
                    <a className="home-download-link" href={generatedFile} download>
                        Download the voice file
                    </a>
                </div>
            )}

            {/* Feedback Prompt */}
            {showFeedbackPrompt && (
                <div className="feedback-prompt">
                    <h3>We value your feedback!</h3>
                    <textarea
                        rows="4"
                        cols="50"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Please provide your feedback..."
                    />
                    <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
                </div>
            )}
        </div>
    );
};

export default Trump;