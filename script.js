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
