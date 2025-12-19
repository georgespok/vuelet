export interface SalaryEntry {
  month: string;
  amount: number;
}

export interface DepartmentRow {
  id: number;
  name: string;
  salaries: SalaryEntry[];
}


