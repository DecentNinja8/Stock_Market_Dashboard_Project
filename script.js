const API_KEY = "YOUR_API_KEY_HERE"; 
let RANGE = 30;
let priceChart, volumeChart;

// Top 30 global stocks
const stocks = [
  { symbol: "AAPL", name: "Apple" }, { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Google" }, { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" }, { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "TSLA", name: "Tesla" }, { symbol: "NFLX", name: "Netflix" },
  { symbol: "AMD", name: "AMD" }, { symbol: "INTC", name: "Intel" },
  { symbol: "JPM", name: "JPMorgan" }, { symbol: "V", name: "Visa" },
  { symbol: "MA", name: "Mastercard" }, { symbol: "WMT", name: "Walmart" },
  { symbol: "COST", name: "Costco" }, { symbol: "KO", name: "Coca-Cola" },
  { symbol: "JNJ", name: "Johnson & Johnson" }, { symbol: "PFE", name: "Pfizer" },
  { symbol: "XOM", name: "Exxon Mobil" }, { symbol: "CVX", name: "Chevron" },
  { symbol: "CRM", name: "Salesforce" }, { symbol: "ORCL", name: "Oracle" },
  { symbol: "ADBE", name: "Adobe" }, { symbol: "IBM", name: "IBM" },
  { symbol: "SAP", name: "SAP" }, { symbol: "UBER", name: "Uber" },
  { symbol: "ABNB", name: "Airbnb" }, { symbol: "PYPL", name: "PayPal" },
  { symbol: "SHOP", name: "Shopify" }, { symbol: "XYZ", name: "Block" }
];

// INIT
window.onload = () => {
  populateDropdown();
  adjustDropdownWidth();
  updateFavoriteUI();
  document.getElementById("symbol").addEventListener("change", () => {
    updateFavoriteUI();
    adjustDropdownWidth();
    getStock();
  });
  setRange(7); // default to 7D
};

// Adjust dropdown width
function adjustDropdownWidth() {
  const dropdown = document.getElementById("symbol");
  const latestPriceCard = document.querySelector(".stats-grid .card:first-child");
  if(latestPriceCard) dropdown.style.width = latestPriceCard.offsetWidth + 'px';
}

// Dropdown
function populateDropdown() {
  const select = document.getElementById("symbol");
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Select a stock";
  select.appendChild(defaultOption);

  stocks.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.symbol;
    opt.textContent = favs.includes(s.symbol) ? `${s.name} (${s.symbol}) ★` : `${s.name} (${s.symbol})`;
    select.appendChild(opt);
  });
}

// Range
function setRange(days) {
  RANGE = days;

  let labelText = days === 7 ? "7 Days" : days === 30 ? "1 Month" : "3 Months";
  document.getElementById("rangeLabel").innerText = `Viewing: ${labelText}`;

  document.querySelectorAll(".ranges button").forEach(btn => btn.classList.remove("active"));
  let idx = days === 7 ? 1 : days === 30 ? 2 : 3;
  document.querySelector(`.ranges button:nth-child(${idx})`).classList.add("active");

  getStock();
}

// Favorites
function isFavorite(symbol){ 
  return (JSON.parse(localStorage.getItem("favorites"))||[]).includes(symbol); 
}

function updateFavoriteUI(){
  const symbol = document.getElementById("symbol").value;
  const btn = document.getElementById("favBtn");
  btn.textContent = isFavorite(symbol) ? "⭐ Favourite" : "☆ Favourite";
  btn.style.background = "white";
}

function toggleFavorite(){
  const select = document.getElementById("symbol");
  const selectedSymbol = select.value;
  if(!selectedSymbol) return alert("Select a stock first");

  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs.includes(selectedSymbol)
    ? favs = favs.filter(s => s !== selectedSymbol)
    : favs.push(selectedSymbol);

  localStorage.setItem("favorites", JSON.stringify(favs));

  populateDropdown();
  select.value = selectedSymbol;
  updateFavoriteUI();
}

// Moving Average
function movingAverage(data, period){ 
  return data.map((_,i)=>i<period?null:data.slice(i-period,i).reduce((a,b)=>a+b)/period); 
}

// MAIN
async function getStock(){
  const symbol = document.getElementById("symbol").value;
  if(!symbol) return alert("Select a stock");

  const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=120&apikey=${API_KEY}`);
  const data = await res.json();
  if(data.status !== "ok") return alert(data.message);

  const values = data.values.reverse().slice(-RANGE);
  const prices = values.map(v => +v.close);
  const volumes = values.map(v => +v.volume);

  if(prices.length === 0 || volumes.length === 0){
      alert("No chart data available for this stock/range.");
      return;
  }

  // Format dates dd/mm/yyyy
  const dates = values.map(v=>{
    const d = new Date(v.datetime);
    return `${("0"+d.getDate()).slice(-2)}/${("0"+(d.getMonth()+1)).slice(-2)}/${d.getFullYear()}`;
  });

  const ma20 = movingAverage(prices,20);
  const ma50 = movingAverage(prices,50);

  const latest = prices.at(-1);
  const prev = prices.at(-2);
  const change = ((latest-prev)/prev*100).toFixed(2);

  document.getElementById("latestPrice").innerText = `$${latest}`;
  document.getElementById("changePercent").innerText = `${change}%`;
  document.getElementById("weeklyReturn").innerText = ((latest-prices[0])/prices[0]*100).toFixed(2)+"%";
  document.getElementById("monthlyReturn").innerText = prices.length>=30?((latest-prices[prices.length-30])/prices[prices.length-30]*100).toFixed(2)+"%":"—";

  if(priceChart) priceChart.destroy();
  if(volumeChart) volumeChart.destroy();

  // TREND
  priceChart = new Chart(document.getElementById("priceChart"),{
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Price",
        data: prices,
        borderColor: "lime",
        backgroundColor: "rgba(0,255,0,0.1)",
        fill: true,
        tension:0.2,
        segment: {
          borderColor: ctx => ctx.p1.parsed.y >= ctx.p0.parsed.y ? 'lime':'red'
        }
      },{
        label:"MA20",
        data: ma20,
        borderColor:"yellow",
        fill:false,
        tension:0.2
      },{
        label:"MA50",
        data: ma50,
        borderColor:"cyan",
        fill:false,
        tension:0.2
      }]
    },
    options: {
      plugins: { legend:{ labels:{ color:"#e5e7eb" } } },
      scales: {
        x:{ grid:{ color:"rgba(255,255,255,0.1)" }, ticks:{ color:"#e5e7eb" } },
        y:{ grid:{ color:"rgba(255,255,255,0.1)" }, ticks:{ color:"#e5e7eb" } }
      }
    }
  });

  // VOLUME
  volumeChart = new Chart(document.getElementById("volumeChart"),{
    type:"bar",
    data:{labels:dates,datasets:[{label:"VOLUME",data:volumes,backgroundColor:"rgba(100,148,237,0.5)"}]},
    options:{scales:{x:{grid:{color:"rgba(255,255,255,0.1)"},ticks:{color:"#e5e7eb"}},y:{grid:{color:"rgba(255,255,255,0.1)"},ticks:{color:"#e5e7eb"}}},plugins:{legend:{labels:{color:"#e5e7eb"}}}}
  });
}
