const people = [
    {name: "Euan", password: "euan"},
    {name: "Jooh", password: "josh"},
    {name: "T-dawg", password: "tahlia"},
    {name: "Lsmit", password: "lucy"},
    {name: "M-pies", password: "mateusz"},
    {name: "Jefe", password: "adam"}
];

const happinessLevels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

// ----------------------
// INDEX.HTML LOGIC
// ----------------------
async function drawMeters() {
    const response = await fetch("/data");
    const happinessData = await response.json();

    const container = document.getElementById("meters-container");
    container.innerHTML = "";
    people.forEach((person, i) => {
        const meterDiv = document.createElement("div");
        meterDiv.className = "meter";

        // Comment
        const nameDiv = document.createElement("div");
        nameDiv.className = "meter-name";
        nameDiv.textContent = person.name;
        meterDiv.appendChild(nameDiv);

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 360 180");
        svg.setAttribute("width", "360");
        svg.setAttribute("height", "180");
        const radius = 180;
        const cx = 180, cy = 180;

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

        // Arrow
        const level = happinessData[i].happiness;
        const arrowAngle = Math.PI * ((level + 0.5)/happinessLevels.length);
        const arrowLength = radius - 30;
        const arrowX = cx + arrowLength * Math.cos(arrowAngle);
        const arrowY = cy - arrowLength * Math.sin(arrowAngle);

        const arrow = document.createElementNS(svgNS, "line");
        arrow.setAttribute("x1", cx);
        arrow.setAttribute("y1", cy);
        arrow.setAttribute("x2", arrowX);
        arrow.setAttribute("y2", arrowY);
        arrow.setAttribute("stroke", "black");
        arrow.setAttribute("stroke-width", "9");
        svg.appendChild(arrow);

        meterDiv.appendChild(svg);

        // Comment
        const commentDiv = document.createElement("div");
        commentDiv.className = "meter-comment";
        commentDiv.textContent = happinessData[i].comment || "";
        commentDiv.style.color = getColorForHappiness(level);
        commentDiv.style.fontSize = "1.8rem";   // smaller text
        commentDiv.style.marginTop = "4px";     // small spacing
        meterDiv.appendChild(commentDiv);

        container.appendChild(meterDiv);
    });
}

function getColorForHappiness(level) {
    const colors = ["#ff0000ff","#ffff00ff","#04ff00ff","#00ffa2ff","#00bbffff"];
    return colors[level] || "white";
}

// ----------------------
// UPDATE.HTML LOGIC
// ----------------------
async function setupUpdatePage() {
    const passwordInput = document.getElementById("password");
    const select = document.getElementById("happiness");
    const commentInput = document.getElementById("comment"); // new textarea
    const button = document.getElementById("submit-btn");

    let happinessData = await fetch("/data").then(r => r.json());

    passwordInput.addEventListener("input", () => {
        const idx = people.findIndex(p => p.password === passwordInput.value);
        if (idx >= 0) {
            select.disabled = false;
            select.value = happinessData[idx].happiness;
            commentInput.value = happinessData[idx].comment || "";
        } else {
            select.disabled = true;
            commentInput.value = "";
        }
    });

    button.addEventListener("click", async () => {
        const idx = people.findIndex(p => p.password === passwordInput.value);
        if (idx >= 0) {
            const newValue = parseInt(select.value);
            const newComment = commentInput.value;
            await fetch("/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ index: idx, value: newValue, comment: newComment })
            });
            alert(`Happiness updated for ${people[idx].name} to ${happinessLevels[newValue]}`);
            passwordInput.value = "";
            select.disabled = true;
            commentInput.value = "";
        } else {
            alert("Invalid password");
        }
    });
}

// ----------------------
// DETECT PAGE
// ----------------------
if (document.getElementById("meters-container")) {
    drawMeters();
    setInterval(drawMeters, 5000);
}

if (document.getElementById("update-container")) {
    setupUpdatePage();
}