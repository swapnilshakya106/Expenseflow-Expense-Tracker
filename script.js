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
