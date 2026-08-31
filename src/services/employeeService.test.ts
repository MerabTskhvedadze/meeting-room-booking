import { describe, expect, it } from 'vitest'

import { getEmployeeById, getEmployees } from './employeeService'

describe('employee service', () => {
  it('loads employees from the seed data', async () => {
    const employees = await getEmployees()

    expect(employees).toHaveLength(5)
    expect(employees.map((employee) => employee.department)).toContain('Engineering')
  })

  it('finds an employee by id', async () => {
    await expect(getEmployeeById('emp-3')).resolves.toMatchObject({
      name: 'Elena Rostova',
      department: 'Marketing',
    })
    await expect(getEmployeeById('missing-employee')).resolves.toBeNull()
  })
})
