const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static("."));
app.use(express.json());

// Endpoint to get happiness data
app.get("/data", (req, res) => {
    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) return res.status(500).send(err);
        res.json(JSON.parse(data));
    });
});

// Endpoint to update happiness data
app.post("/data", (req, res) => {
    const { index, value } = req.body;
    fs.readFile("data.json", "utf8", (err, data) => {
        if (err) return res.status(500).send(err);
        let happinessData = JSON.parse(data);
        happinessData[index] = value;
        fs.writeFile("data.json", JSON.stringify(happinessData), err => {
            if (err) return res.status(500).send(err);
            res.json({ status: "ok" });
        });
    });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
