import employeesSeed from '../data/employees.json'
import type { Employee } from '../types/employee'

const employees = employeesSeed as Employee[]

export async function getEmployees(): Promise<Employee[]> {
  return structuredClone(employees)
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const employee = employees.find((candidate) => candidate.id === id)
  return employee ? structuredClone(employee) : null
}
