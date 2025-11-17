// Define people and their passwords
const people = [
    {name: "Alice", password: "a123"},
    {name: "Bob", password: "b123"},
    {name: "Charlie", password: "c123"},
    {name: "Diana", password: "d123"},
    {name: "Eve", password: "e123"},
    {name: "Frank", password: "f123"}
];

const happinessLevels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

// Simulate loading/saving from a JSON file
let happinessData = [2, 2, 2, 2, 2, 2]; // default neutral

function drawMeters() {
    const container = document.getElementById("meters-container");
    container.innerHTML = "";
    people.forEach((person, i) => {
        const meterDiv = document.createElement("div");
        meterDiv.className = "meter";

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        const radius = 50;
        const cx = 60, cy = 60;

        // Draw semi-circle slices
        for (let j = 0; j < happinessLevels.length; j++) {
            const startAngle = Math.PI * (j / happinessLevels.length);
            const endAngle = Math.PI * ((j+1)/happinessLevels.length);
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy - radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy - radius * Math.sin(endAngle);

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 0,1 ${x2},${y2} Z`);
            path.setAttribute("fill", `hsl(${j*50},70%,70%)`);
            svg.appendChild(path);
        }

        // Draw arrow
        const arrowAngle = Math.PI * ((happinessData[i]+0.5)/happinessLevels.length);
        const arrowLength = radius - 10;
        const arrowX = cx + arrowLength * Math.cos(arrowAngle);
        const arrowY = cy - arrowLength * Math.sin(arrowAngle);

        const arrow = document.createElementNS(svgNS, "line");
        arrow.setAttribute("x1", cx);
        arrow.setAttribute("y1", cy);
        arrow.setAttribute("x2", arrowX);
        arrow.setAttribute("y2", arrowY);
        arrow.setAttribute("stroke", "black");
        arrow.setAttribute("stroke-width", "3");
        svg.appendChild(arrow);

        meterDiv.appendChild(svg);

        const nameDiv = document.createElement("div");
        nameDiv.className = "meter-name";
        nameDiv.textContent = person.name;
        meterDiv.appendChild(nameDiv);

        container.appendChild(meterDiv);
    });
}

// Update page logic
function setupUpdatePage() {
    const passwordInput = document.getElementById("password");
    const select = document.getElementById("happiness");
    const button = document.getElementById("submit-btn");

    passwordInput.addEventListener("input", () => {
        const idx = people.findIndex(p => p.password === passwordInput.value);
        if (idx >= 0) {
            select.disabled = false;
            select.value = happinessData[idx];
        } else {
            select.disabled = true;
        }
    });

    button.addEventListener("click", () => {
        const idx = people.findIndex(p => p.password === passwordInput.value);
        if (idx >= 0) {
            happinessData[idx] = parseInt(select.value);
            alert(`Happiness updated for ${people[idx].name} to ${happinessLevels[happinessData[idx]]}`);
        } else {
            alert("Invalid password");
        }
    });
}

// Detect page type
if (document.getElementById("meters-container")) {
    drawMeters();
}

if (document.getElementById("update-container")) {
    setupUpdatePage();
}
