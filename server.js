const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static("."));
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

// ----------------------
// GET endpoint: send happiness + comments
// ----------------------
app.get("/data", (req, res) => {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).send(err);
        let happinessData = JSON.parse(data);
        // Make sure each item has both happiness and comment
        happinessData = happinessData.map(item => ({
            happiness: item.happiness ?? 0,
            comment: item.comment ?? "",
            locked: item.locked ?? false
        }));
        res.json(happinessData);
    });
});

// ----------------------
// POST endpoint: update happiness and comment
// ----------------------
app.post("/data", (req, res) => {
    const { index, value, comment, locked } = req.body;

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).send(err);

        let happinessData = JSON.parse(data);

        // Ensure the index exists
        if (!happinessData[index]) {
            return res.status(400).json({ status: "error", message: "Invalid index" });
        }

        // Update happiness and comment
        happinessData[index].happiness = value;
        happinessData[index].comment = comment || "";
        happinessData[index].locked = locked ?? false;

        fs.writeFile(DATA_FILE, JSON.stringify(happinessData, null, 2), err => {
            if (err) return res.status(500).send(err);
            res.json({ status: "ok" });
        });
    });
});

app.post("/marker", (req, res) => {
    const { index, x, y } = req.body;
    const timestamp = Date.now();

    fs.readFile(DATA_FILE, "utf8", (err, data) => {
        if (err) return res.status(500).send(err);

        let happinessData = JSON.parse(data);
        if (!happinessData[index]) {
            return res.status(400).send("Invalid index");
        }

        // Make sure markers array exists
        if (!Array.isArray(happinessData[index].markers)) {
            happinessData[index].markers = [];
        }

        // Add new marker
        happinessData[index].markers.push({ x, y, timestamp });

        // Remove markers older than 24 hours
        const DAY = 24 * 60 * 60 * 1000;
        happinessData[index].markers = happinessData[index].markers.filter(
            m => (timestamp - m.timestamp) < DAY
        );

        fs.writeFile(DATA_FILE, JSON.stringify(happinessData, null, 2), err => {
            if (err) return res.status(500).send(err);
            res.json({ status: "ok" });
        });
    });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
