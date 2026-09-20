const cities = [
  { id: "bengaluru", name: "Bengaluru", rent: 25000, food: 8000, transport: 4000, utilities: 3000, lifestyle: 6000 },
  { id: "mumbai", name: "Mumbai", rent: 35000, food: 9000, transport: 3000, utilities: 2500, lifestyle: 7000 },
  { id: "delhi-ncr", name: "Delhi NCR", rent: 20000, food: 7000, transport: 3500, utilities: 4000, lifestyle: 6000 },
  { id: "hyderabad", name: "Hyderabad", rent: 18000, food: 7000, transport: 3000, utilities: 2500, lifestyle: 5000 },
  { id: "chennai", name: "Chennai", rent: 16000, food: 6500, transport: 2500, utilities: 2000, lifestyle: 4000 },
  { id: "pune", name: "Pune", rent: 17000, food: 6000, transport: 2500, utilities: 2000, lifestyle: 4500 },
  { id: "kolkata", name: "Kolkata", rent: 12000, food: 5000, transport: 1500, utilities: 1500, lifestyle: 3000 },
  { id: "ahmedabad", name: "Ahmedabad", rent: 14000, food: 5500, transport: 2000, utilities: 2000, lifestyle: 3500 },
  { id: "jaipur", name: "Jaipur", rent: 11000, food: 5000, transport: 1500, utilities: 1800, lifestyle: 3000 },
  { id: "kochi", name: "Kochi", rent: 13000, food: 6000, transport: 2000, utilities: 1800, lifestyle: 3500 },
  { id: "chandigarh", name: "Chandigarh", rent: 16000, food: 6500, transport: 2500, utilities: 2500, lifestyle: 4500 },
  { id: "indore", name: "Indore", rent: 10000, food: 4500, transport: 1500, utilities: 1500, lifestyle: 2500 },
  { id: "lucknow", name: "Lucknow", rent: 11000, food: 5000, transport: 1500, utilities: 1800, lifestyle: 3000 },
  { id: "goa", name: "Goa", rent: 18000, food: 8000, transport: 4000, utilities: 2000, lifestyle: 8000 }
];

let selectedCities = ["bengaluru", "mumbai"];
let selectedStay = "1bhk";

const incomeInput = document.getElementById("income");
const cityButtons = document.getElementById("cityButtons");
const stayButtons = document.getElementById("stayButtons");
const recommendation = document.getElementById("recommendation");
const resultCards = document.getElementById("resultCards");

const toggleActualsBtn = document.getElementById("toggleActualsBtn");
const actualsCard = document.getElementById("actualsCard");
const actualInputs = document.querySelectorAll(".actual-input");

function formatMoney(amount) {
  return Math.round(amount).toLocaleString("en-IN");
}

function getIncome() {
  return Number(incomeInput.value.replace(/[^0-9]/g, "")) || 0;
}

function getActualExpenses() {
  const parseAmount = (id) => {
    const el = document.getElementById(id);
    return el ? (Number(el.value) || 0) : 0;
  };
  return {
    housing: parseAmount("actualHousing"),
    food: parseAmount("actualFood"),
    transport: parseAmount("actualTransport"),
    utilities: parseAmount("actualUtilities"),
    lifestyle: parseAmount("actualLifestyle")
  };
}

function getAdjustedRent(baseRent) {
  if (selectedStay === "sharing") return baseRent * 0.6;
  if (selectedStay === "1bhk") return baseRent;
  if (selectedStay === "2bhk") return baseRent * 1.5;
  if (selectedStay === "3bhk") return baseRent * 2;
  return baseRent;
}

function calculateBudget(income, city) {
  let rent = getAdjustedRent(city.rent);
  let food = city.food;
  let transport = city.transport;
  let utilities = city.utilities;
  let lifestyle = city.lifestyle;

  if (income > 50000) {
    lifestyle += (income - 50000) * 0.1;
  }

  if (income > 100000) {
    rent *= 1.3;
    food *= 1.2;
    lifestyle *= 1.5;
  }

  const actuals = getActualExpenses();
  const sumActuals = actuals.housing + actuals.food + actuals.transport + actuals.utilities + actuals.lifestyle;

  if (sumActuals > 0) {
    if (actuals.housing === 0) rent = 0;
    if (actuals.food === 0) food = 0;
    if (actuals.transport === 0) transport = 0;
    if (actuals.utilities === 0) utilities = 0;
    if (actuals.lifestyle === 0) lifestyle = 0;
  }

  const totalExpenses = rent + food + transport + utilities + lifestyle;
  const leftover = income - totalExpenses;
  const savings = leftover > 0 ? leftover : 0;

  let score = 0;

  if (income <= 0) score = 0;
  else if (leftover < 0) score = 10;
  else if (leftover < income * 0.1) score = 30;
  else if (leftover < income * 0.2) score = 50;
  else if (leftover < income * 0.4) score = 75;
  else score = 90 + Math.min(10, (leftover / income) * 20);

  return {
    rent,
    food,
    transport,
    utilities,
    lifestyle,
    totalExpenses,
    leftover,
    savings,
    score: Math.round(score)
  };
}

function getScoreClass(score) {
  if (score > 75) return "high";
  if (score > 50) return "mid";
  if (score > 30) return "low";
  return "bad";
}

function renderCityButtons() {
  cityButtons.innerHTML = "";

  cities.forEach(city => {
    const button = document.createElement("button");
    button.className = "city-btn";

    if (selectedCities.includes(city.id)) {
      button.classList.add("active");
    }

    button.textContent = city.name;

    button.addEventListener("click", () => {
      if (selectedCities.includes(city.id)) {
        selectedCities = selectedCities.filter(id => id !== city.id);
      } else {
        if (selectedCities.length >= 3) {
          selectedCities.shift();
        }
        selectedCities.push(city.id);
      }

      render();
    });

    cityButtons.appendChild(button);
  });
}

function setupStayButtons() {
  const buttons = stayButtons.querySelectorAll("button");

  buttons.forEach(btn => {
    if (btn.dataset.stay === selectedStay) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedStay = btn.dataset.stay;
      render();
    });
  });
}

function renderRecommendation(bestCity, income) {
  if (!bestCity || income <= 0) {
    recommendation.className = "recommendation";
    recommendation.innerHTML = "";
    return;
  }

  const isGood = bestCity.budget.score > 50;
  recommendation.className = "recommendation show " + (isGood ? "good" : "bad");

  let title = isGood
    ? bestCity.city.name + " is your best option."
    : "Warning: Living in " + bestCity.city.name + " might be difficult.";

  let message = "";

  if (bestCity.budget.score > 75) {
    message = `With ₹${formatMoney(income)}, you can live very comfortably here and save a good amount.`;
  } else if (bestCity.budget.score > 50) {
    message = "You can manage well here, though savings might require some budgeting.";
  } else if (bestCity.budget.score > 30) {
    message = "Things will be tight. You may need to compromise on lifestyle or rent.";
  } else {
    message = "Your estimated expenses exceed or nearly exceed your income.";
  }

  recommendation.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
}

function createExpenseHTML(label, amount, total, actualAmount = 0) {
  if (amount === 0) return "";

  const percentage = Math.round((amount / total) * 100) || 0;

  let actualHtml = "";
  if (actualAmount > 0) {
    const diff = amount - actualAmount;
    const diffText = diff >= 0 ? `Save ₹${formatMoney(diff)}` : `Over ₹${formatMoney(Math.abs(diff))}`;
    const diffClass = diff >= 0 ? "diff-positive" : "diff-negative";
    actualHtml = `<div class="expense-actual">You spend: ₹${formatMoney(actualAmount)} <span class="${diffClass}">(${diffText})</span></div>`;
  }

  return `
    <div class="expense">
      <div class="expense-row">
        <span class="expense-label">${label}</span>
        <span class="expense-amount">₹${formatMoney(amount)}</span>
      </div>
      ${actualHtml}
      <div class="bar">
        <div class="bar-fill" style="width:${percentage}%"></div>
      </div>
    </div>
  `;
}

function renderCards(comparisons, bestCity) {
  resultCards.innerHTML = "";
  const actuals = getActualExpenses();
  const sumActuals = actuals.housing + actuals.food + actuals.transport + actuals.utilities + actuals.lifestyle;

  comparisons.forEach(item => {
    const city = item.city;
    const budget = item.budget;
    const income = getIncome();

    const savingsPercentage = income > 0
      ? Math.max(0, Math.min(100, (budget.savings / income) * 100))
      : 0;

    const isBest = bestCity && city.id === bestCity.city.id && budget.score > 50;

    const card = document.createElement("div");
    card.className = "card";

    if (isBest) {
      card.classList.add("best");
    }

    let actualSavingsHtml = "";
    if (sumActuals > 0) {
      let actualLeftover = income - sumActuals;
      let actualSavings = actualLeftover > 0 ? actualLeftover : 0;
      let savingsDiff = actualSavings - budget.savings;
      let sDiffText = savingsDiff >= 0 ? `+₹${formatMoney(savingsDiff)}` : `-₹${formatMoney(Math.abs(savingsDiff))}`;
      let sDiffClass = savingsDiff >= 0 ? "diff-positive" : "diff-negative";
      actualSavingsHtml = `
          <div class="expense-actual" style="margin-top: 5px;">
            Your Actual Savings: ₹${formatMoney(actualSavings)} 
            <span class="${sDiffClass}">(${sDiffText})</span>
          </div>
        `;
    }

    card.innerHTML = `
      <div class="best-strip"></div>
      <div class="card-content">
        <div class="card-header">
          <h3>${city.name}</h3>
          <span class="score ${getScoreClass(budget.score)}">Score: ${budget.score}/100</span>
        </div>

        <div class="total">Total estimate: ₹${formatMoney(budget.totalExpenses)} / month</div>

        ${createExpenseHTML("Housing", budget.rent, budget.totalExpenses, actuals.housing)}
        ${createExpenseHTML("Food and Groceries", budget.food, budget.totalExpenses, actuals.food)}
        ${createExpenseHTML("Cab and Transport", budget.transport, budget.totalExpenses, actuals.transport)}
        ${createExpenseHTML("Utilities", budget.utilities, budget.totalExpenses, actuals.utilities)}
        ${createExpenseHTML("Lifestyle", budget.lifestyle, budget.totalExpenses, actuals.lifestyle)}

        <div class="savings">
          <div class="savings-row">
            <span>Estimated Savings</span>
            <span class="savings-amount ${budget.leftover <= 0 ? "debt" : ""}">
              ₹${budget.leftover > 0 ? formatMoney(budget.savings) : "0"}
            </span>
          </div>
          ${actualSavingsHtml}

          <div class="bar">
            <div class="bar-fill" style="width:${savingsPercentage}%"></div>
          </div>

          <p class="savings-note">
            ${budget.leftover > 0 ? savingsPercentage.toFixed(1) + "% of income" : "In debt"}
          </p>
        </div>
      </div>
    `;

    resultCards.appendChild(card);
  });
}

function render() {
  const income = getIncome();

  const comparisons = selectedCities
    .map(cityId => {
      const city = cities.find(c => c.id === cityId);
      return { city, budget: calculateBudget(income, city) };
    })
    .sort((a, b) => b.budget.score - a.budget.score);

  const bestCity = comparisons[0];

  renderCityButtons();
  renderRecommendation(bestCity, income);
  renderCards(comparisons, bestCity);
}

incomeInput.addEventListener("input", () => {
  const income = getIncome();
  incomeInput.value = income ? income.toLocaleString("en-IN") : "";
  render();
});

let showingActuals = false;
toggleActualsBtn.addEventListener("click", () => {
  showingActuals = !showingActuals;
  actualsCard.style.display = showingActuals ? "block" : "none";
  toggleActualsBtn.textContent = showingActuals ? "- Hide Actual Expenses" : "+ Add Your Actual Expenses for Comparison";
});

function populateSelects() {
  const selects = document.querySelectorAll("select.actual-input");
  selects.forEach(select => {
    let html = '';

    let maxVal = select.id === "actualLifestyle" ? 200000 : 100000;

    for (let i = 0; i <= maxVal; i += 500) {
      html += `<option value="${i}">${i === 0 ? "0" : i.toLocaleString('en-IN')}</option>`;
    }
    select.innerHTML = html;
    select.value = "0";

    select.addEventListener("change", () => {
      render();
    });
  });
}
populateSelects();

setupStayButtons();
render();