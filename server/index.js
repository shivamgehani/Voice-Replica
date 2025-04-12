require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const multer = require("multer");
const EventEmitter = require("events");
const bcrypt = require("bcrypt");
const EmployeeModel = require("./models/Employee");
const FeedbackModel = require("./models/Feedback");

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

const eventEmitter = new EventEmitter();

// **MongoDB Connection**
const mongoURI = process.env.MONGO_URI || "mongodb+srv://shivambscsses21:UAgZxVPTGrZITr3d@cluster0.bxqebzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
if (!mongoURI) {
    console.error("❌ MONGO_URI is not set in .env file.");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ Error connecting to MongoDB:", err);
        process.exit(1);
    });

// **Ensure Uploads Directory Exists**
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// **Setup Multer for File Uploads**
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `voice_${Date.now()}.wav`);
    },
});

const upload = multer({ storage });

// **SSE Route for Frontend Logs**
app.get("/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const sendLog = (message) => {
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
    };

    eventEmitter.on("log", sendLog);

    req.on("close", () => {
        eventEmitter.removeListener("log", sendLog);
    });
});
// Route to submit feedback
app.post("/submit-feedback", async (req, res) => {
    try {
        console.log("Received feedback submission request:", req.body); // Debugging
        const { feedback } = req.body;
        if (!feedback) {
            return res.status(400).json({ error: "Feedback is required" });
        }

        const newFeedback = new FeedbackModel({ feedback });
        await newFeedback.save();

        console.log("Feedback saved successfully:", newFeedback); // Debugging
        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Failed to submit feedback" });
    }
});

// Route to fetch all feedbacks
app.get("/admin/feedbacks", async (req, res) => {
    try {
        console.log("Fetching feedbacks..."); // Debugging
        const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 }); // Sort by latest first
        console.log("Feedbacks fetched:", feedbacks); // Debugging
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
});

// **Voice Generation Route**
app.post("/generate-voice", upload.single("speakerWav"), async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text input is required" });

        if (!req.file) return res.status(400).json({ error: "Speaker WAV file is required" });

        eventEmitter.emit("log", `📢 Received request to generate voice: ${text}`);

        const audioFileName = `output_${Date.now()}.wav`;
        const audioFilePath = path.join(__dirname, "public", audioFileName);
        const speakerWavPath = req.file.path;

        const pythonProcess = spawn("python", [
            path.join(__dirname, "generate_voice.py"),
            text,
            audioFilePath,
            speakerWavPath,
        ]);

        pythonProcess.stdout.on("data", (data) => {
            eventEmitter.emit("log", `✅ Python Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            eventEmitter.emit("log", `❌ Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                eventEmitter.emit("log", `✅ Audio file generated: ${audioFilePath}`);
                res.json({ filePath: `/audio/${audioFileName}` });
            } else {
                eventEmitter.emit("log", "❌ Python script failed.");
                res.status(500).json({ error: "Python script failed" });
            }
        });

    } catch (error) {
        eventEmitter.emit("log", `❌ Server Error: ${error.message}`);
        res.status(500).json({ error: "Failed to generate voice" });
    }
});

app.post("/generate-voice-hf", async (req, res) => {
    try {
        const { text, speaker } = req.body;
        if (!text) return res.status(400).json({ error: "Text input is required" });
        if (!speaker) return res.status(400).json({ error: "Speaker ID is required" });

        eventEmitter.emit("log", `📢 Received request to generate voice: ${text}`);

        const audioFileName = `output_${Date.now()}.wav`;
        const audioFilePath = path.join(__dirname, "public", audioFileName);

        const pythonProcess = spawn("python", [
            path.join(__dirname, "generate_voice_hf.py"),
            text,
            audioFilePath,
            speaker,
        ]);

        pythonProcess.stdout.on("data", (data) => {
            eventEmitter.emit("log", `✅ Python Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            eventEmitter.emit("log", `❌ Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                eventEmitter.emit("log", `✅ Audio file generated: ${audioFilePath}`);
                res.json({ filePath: `/audio/${audioFileName}` });
            } else {
                eventEmitter.emit("log", "❌ Python script failed.");
                res.status(500).json({ error: "Python script failed" });
            }
        });

    } catch (error) {
        eventEmitter.emit("log", `❌ Server Error: ${error.message}`);
        res.status(500).json({ error: "Failed to generate voice" });
    }
});

app.post("/generate-voice-tacotron", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text input is required" });

        eventEmitter.emit("log", `📢 Received request to generate voice: ${text}`);

        const audioFileName = `output_${Date.now()}.wav`;
        const audioFilePath = path.join(__dirname, "public", audioFileName);

        const pythonProcess = spawn("python", [
            path.join(__dirname, "generate_voice_tacotron.py"),
            text,
            audioFilePath,
        ]);

        pythonProcess.stdout.on("data", (data) => {
            eventEmitter.emit("log", `✅ Python Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            eventEmitter.emit("log", `❌ Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                eventEmitter.emit("log", `✅ Audio file generated: ${audioFilePath}`);
                res.json({ filePath: `/audio/${audioFileName}` });
            } else {
                eventEmitter.emit("log", "❌ Python script failed.");
                res.status(500).json({ error: "Python script failed" });
            }
        });

    } catch (error) {
        eventEmitter.emit("log", `❌ Server Error: ${error.message}`);
        res.status(500).json({ error: "Failed to generate voice" });
    }
});
// genrate voice zonos
app.post("/generate-voice-zonos", upload.single("audio"), async (req, res) => {
    try {
        const { text, language } = req.body;
        if (!text) return res.status(400).json({ error: "Text input is required" });

        eventEmitter.emit("log", `📢 Received request to generate voice using Zonos API: ${text}`);

        const audioFileName = `output_${Date.now()}.webm`;
        const audioFilePath = path.join(__dirname, "public", audioFileName);
        const speakerWavPath = req.file ? req.file.path : null;

        // Use a valid language code (e.g., "en-us" for American English)
        const validLanguage = language === "en" ? "en-us" : language;

        const pythonProcess = spawn("python", [
            path.join(__dirname, "generate_voice_zonos.py"),
            text,
            audioFilePath,
            validLanguage, // Pass the valid language code
            speakerWavPath,
        ]);

        pythonProcess.stdout.on("data", (data) => {
            eventEmitter.emit("log", `✅ Python Output: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            eventEmitter.emit("log", `❌ Python Error: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            if (code === 0) {
                eventEmitter.emit("log", `✅ Audio file generated: ${audioFilePath}`);
                res.json({ filePath: `/audio/${audioFileName}` });
            } else {
                eventEmitter.emit("log", "❌ Python script failed.");
                res.status(500).json({ error: "Python script failed" });
            }
        });

    } catch (error) {
        eventEmitter.emit("log", `❌ Server Error: ${error.message}`);
        res.status(500).json({ error: "Failed to generate voice using Zonos API" });
    }
});

// **Serve generated audio files**
app.use("/audio", express.static(path.join(__dirname, "public")));

// **Authentication Routes**
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request received:", { email, password }); // Debugging log

    try {
        // Find the user by email
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            console.log("User not found:", email); // Debugging log
            return res.status(400).json({ message: "User not found" });
        }

        console.log("User found:", user); // Debugging log

        // Compare the plain-text password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log("Password matched"); // Debugging log
            return res.json({ message: "Successful" }); // Send a JSON response
        } else {
            console.log("Wrong password"); // Debugging log
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login error:", err); // Debugging log
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { password } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the hashed password
        const employee = await EmployeeModel.create({ ...req.body, password: hashedPassword });

        console.log("User registered:", employee); // Debugging log
        res.json(employee);
    } catch (err) {
        console.error("Registration error:", err); // Debugging log
        res.status(500).json(err);
    }
});
// **Test Route**
app.get('/', (req, res) => res.json("Hello World"));


// Add these routes to your backend (index.js)
// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await EmployeeModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Add a new user
app.post("/register", async (req, res) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const employee = await EmployeeModel.create({ ...req.body, password: hashedPassword });
        res.json(employee);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update a user
app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        let updateData = { name, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await EmployeeModel.findByIdAndUpdate(id, updateData, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID is required" });
        }
        await EmployeeModel.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin credentials
    if (email === "admin" && password === "12345") {
        return res.json({ message: "AdminLogin" }); // Indicate admin login
    }

    try {
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.json({ message: "Successful" });
        } else {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        return res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

// **Start Server**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT: ${PORT}`);
});