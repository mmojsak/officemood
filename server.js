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
            comment: item.comment ?? ""
        }));
        res.json(happinessData);
    });
});

// ----------------------
// POST endpoint: update happiness and comment
// ----------------------
app.post("/data", (req, res) => {
    const { index, value, comment } = req.body;

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

        fs.writeFile(DATA_FILE, JSON.stringify(happinessData, null, 2), err => {
            if (err) return res.status(500).send(err);
            res.json({ status: "ok" });
        });
    });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));