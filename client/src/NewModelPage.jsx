import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Reuse the same CSS as Home.jsx

const NewModelPage = () => {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [generatedFile, setGeneratedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [language, setLanguage] = useState("en"); // Default language
    const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false); // State for feedback prompt
    const [feedback, setFeedback] = useState(""); // State for feedback input
    const navigate = useNavigate();

    // List of unethical words
    const unethicalWords = [
        "abuse", "hate", "violence", "threat", "racist", "sexist", "harass", 
        "bully", "discriminate", "insult", "curse", "slur", "profanity", 
        "obscene", "exploit", "demean", "degrade", "intimidate", "shame", 
        "vulgar", "offend", "malicious", "toxic", "manipulate"
    ];

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:3001/stream");

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setLogs((prevLogs) => [...prevLogs, data.message]);
        };

        return () => eventSource.close();
    }, []);

    // Function to check for unethical words
    const containsUnethicalWords = (inputText) => {
        return unethicalWords.some((word) =>
            inputText.toLowerCase().includes(word.toLowerCase())
        );
    };

    const handleGenerateVoice = async () => {
        if (!text.trim() && !file) {
            alert("Please enter text or upload an audio file.");
            return;
        }

        // Check for unethical words
        if (containsUnethicalWords(text)) {
            alert("Please remove unethical words to generate voice.");
            return;
        }

        setIsLoading(true);
        setLogs([]);

        const formData = new FormData();
        if (text) formData.append("text", text);
        if (file) formData.append("audio", file);
        formData.append("language", language);

        try {
            const response = await axios.post(
                "http://localhost:3001/generate-voice-zonos",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const fileUrl = `http://localhost:3001${response.data.filePath}?t=${Date.now()}`;
            setGeneratedFile(fileUrl);

            // Show feedback prompt after 30 seconds
            setTimeout(() => {
                setShowFeedbackPrompt(true);
            }, 3000); // 30 seconds
        } catch (error) {
            console.error("Error generating voice:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
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

            <h1 className="home-title">Replica your own voice (Text-to-Speech)</h1>

            <textarea
                className="home-textarea"
                rows="4"
                cols="50"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
            />

            <input
                type="file"
                accept=".wav"
                onChange={(e) => setFile(e.target.files[0])}
                className="home-file-input"
            />

            <select
                className="home-language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                {/* Add more languages as needed */}
            </select>

            <button
                className="home-generate-button"
                onClick={handleGenerateVoice}
                disabled={isLoading}
            >
                {isLoading ? "Generating..." : "Generate Voice"}
            </button>

            {/* Real-time logs */}
            <div className="home-logs">
                <h3>Processing Logs:</h3>
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            </div>

            {generatedFile && (
                <div className="home-audio-container">
                    <h3>Generated Voice:</h3>
                    <audio key={generatedFile} controls>
                        <source src={generatedFile} type="audio/webm" />
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

export default NewModelPage;