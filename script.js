const STORAGE_KEY = "expenseflow_expenses";

const demoExpenses = [
{
  id: crypto.raddomUUID(),
  title: "Groceries",
  amount: 1240,
  category: "Food",
  date: "2026-09-18",
  note: "Weekly groceries"
},
{
  id: crypto.raddomUUID(),
  title: "Metro Recharge",
  amount: 500,
  category: "Transport",
  date: "2026-09-16",
  note: 
},
{
  id: crypto.randomUUID(),
  title: "JavaScript Course",
  amount: 799,
  category: "Education",
  date: "2026-09-12",
  note: "Online learning"
},
{
  id: crypto.randomUUID(),
  title: "Movie Night",
  amount: 650,
  category: "Entertainment",
  date: "2026-09-08",
  note: ""
},
{
    id: crypto.randomUUID(),
    title: "Electricity Bill",
    amount: 1450,
    category: "Bills",
    date: "2026-09-03",
    note: "Monthly bill"
  }
];

let expenses = loadExpenses();

const $ = (id) => document.getElementById(id);

function loadExpenses() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoExpenses));
  return demoExpenses;
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function categoryIcon(category) {
  const icons = {
    Food: "🍴",
    Transport: "🚌",
    Shopping: "🛍",
    Bills: "⚡",
    Entertainment: "🎬",
    Health: "♥",
    Education: "📚",
    Other: "•"
  };
  return icons[category] || "•";
}

function getSortedExpenses(list = expenses) {
  return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderDashboard() {
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const now = new Date();
  const monthExpenses = expenses.filter((expense) => {
    const date = new Date(`${expense.date}T00:00:00`);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
  
  const monthlyTotal = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const average = expenses.length ? total / expenses.length : 0;

  const categoryTotals = getCategoryTotals();
  const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  $("totalSpent").textContent = formatCurrency(total);
  $("monthlySpent").textContent = formatCurrency(monthlyTotal);
  $("monthlyCount").textContent = `{monthExpenses.length} transaction${monthExpenses.length === 1 ? "" : "s"}`;
  $("averageSpent").textContent = formatCurrency(average);
  $("topCategory").textContent = top ? top[0] : "—";
  $("topCategoryAmount").textContent = top ? `${formatCurrency(top[1])} spent` : "₹0 spent";

  renderRecentTransactions();
  renderCategoryChart();
  renderAnalytics();
  renderMonthlyChart();
}

function transactionHTML(expense) {
  return `
    <div class="transaction">
      <div class="transaction-icon">${categoryIcon(expense.category)}</div>
      <div class="transaction-info">
        <strong>${escapeHTML(expense.title)}</strong>
        <span>${escapeHTML(expense.category)} • ${formatDate(expense.date)}${expense.note ? ` • ${escapeHTML(expense.note)}` : ""}</span>
      </div>
      <div class="transaction-amount">${formatCurrency(expense.amount)}</div>
      <button class="delete-btn" data-delete="${expense.id}" aria-label="Delete expense">×</button>
    </div>
  `;
}

function renderRecentTransactions() {
  const recent = getSortedExpenses().slice(0, 6);
  $("recentTransactions").innerHTML = recent.length
    ? recent.map(transactionHTML).join("")
    : `<div class="empty">No expenses yet. Add your first expense.</div>`;
  bindDeleteButtons();
}

function renderAllTransactions() {
  const search = $("searchInput").value.trim().toLowerCase();
  const category = $("filterCategory").value;

const filtered = getSortedExpenses().filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(search) ||
      expense.category.toLowerCase().includes(search) ||
      (expense.note || "").toLowerCase().includes(search);

    const matchesCategory = category === "all" || expense.category === category;
    return matchesSearch && matchesCategory;
  });

  $("allTransactions").innerHTML = filtered.length
    ? filtered.map(transactionHTML).join("")
    : `<div class="empty">No matching transactions found.</div>`;

  bindDeleteButtons();
}

function getCategoryTotals() {
  return expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount);
    return totals;
  }, {});
}

function renderCategoryChart() {
  const totals = getCategoryTotals();
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;

  $("categoryChart").innerHTML = entries.length
    ? entries.map(([category, amount]) => `
      <div class="category-row">
        <div class="category-meta">
          <span>${categoryIcon(category)} ${escapeHTML(category)}</span>
          <strong>${formatCurrency(amount)}</strong>
        </div>
        <div class="progress">
          <div class="progress-bar" style="width:${(amount / max) * 100}%"></div>
        </div>
      </div>
    `).join("")
    : `<div class="empty">No category data available.</div>`;
}
