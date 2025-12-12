export interface ExpenseEntry {
  month: string;
  value: number;
}

export interface PersonRow {
  id: number;
  name: string;
  role: string;
  location: string;
  salary: number;
  deductions: number;
  netPay: number;
  expenses: ExpenseEntry[];
}
