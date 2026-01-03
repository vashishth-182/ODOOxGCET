import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getAllEmployees } from '../services/userService';
import { getSalaryInfo, updateSalary } from '../services/userService';
import { calculateSalary } from '../utils/salaryCalculation';
import { DollarSign } from 'lucide-react';

export default function Payroll() {
  const { user, isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [monthlyWage, setMonthlyWage] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      loadEmployees();
    } else {
      loadOwnSalary();
    }
  }, [isAdmin, user]);

  useEffect(() => {
    if (selectedEmployee) {
      loadSalary(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  const loadEmployees = async () => {
    try {
      const emps = await getAllEmployees();
      setEmployees(emps);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadOwnSalary = async () => {
    setLoading(true);
    try {
      const salaryData = await getSalaryInfo(user.id);
      setSalary(salaryData);
      if (salaryData) {
        setMonthlyWage(salaryData.monthlyWage);
      }
    } catch (error) {
      console.error('Error loading salary:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSalary = async (userId) => {
    setLoading(true);
    try {
      const salaryData = await getSalaryInfo(userId);
      setSalary(salaryData);
      if (salaryData) {
        setMonthlyWage(salaryData.monthlyWage);
      }
    } catch (error) {
      console.error('Error loading salary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedEmployee && !isAdmin) {
      alert('Only admins can update salary');
      return;
    }

    try {
      const userId = selectedEmployee?.id || user.id;
      const newSalary = calculateSalary(monthlyWage);
      await updateSalary(userId, newSalary);
      await loadSalary(userId);
      setEditing(false);
      alert('Salary updated successfully!');
    } catch (error) {
      alert('Failed to update salary: ' + error.message);
    }
  };

  if (!isAdmin && !salary) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12 text-gray-500">
            Salary information not available
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
        </div>

        {isAdmin && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
            <select
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const emp = employees.find(e => e.id === e.target.value);
                setSelectedEmployee(emp || null);
              }}
              className="input max-w-xs"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId})
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : salary ? (
          <SalaryBreakdown
            salary={salary}
            monthlyWage={monthlyWage}
            setMonthlyWage={setMonthlyWage}
            editing={editing}
            setEditing={setEditing}
            canEdit={isAdmin}
            onSave={handleSave}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            {isAdmin ? 'Select an employee to view salary' : 'Salary information not available'}
          </div>
        )}
      </main>
    </div>
  );
}

function SalaryBreakdown({ salary, monthlyWage, setMonthlyWage, editing, setEditing, canEdit, onSave }) {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Salary Information</h2>
          {canEdit && (
            <div className="space-x-2">
              {editing ? (
                <>
                  <button onClick={() => { setEditing(false); setMonthlyWage(salary.monthlyWage); }} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button onClick={onSave} className="btn btn-primary">
                    Save Changes
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn btn-primary">
                  Edit Wage
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Monthly Wage:</span>
            {editing && canEdit ? (
              <input
                type="number"
                value={monthlyWage}
                onChange={(e) => setMonthlyWage(parseFloat(e.target.value) || 0)}
                className="input w-40 text-right font-semibold"
              />
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                ₹ {salary.monthlyWage?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Salary Components</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Component</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salary.components && Object.entries(salary.components).map(([key, comp]) => (
                  <tr key={key}>
                    <td className="px-4 py-2 text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {comp.type === 'percentage_of_wage' && `${comp.percentage}% of Wage`}
                      {comp.type === 'percentage_of_basic' && `${comp.percentage}% of Basic`}
                      {comp.type === 'fixed' && 'Fixed'}
                      {comp.type === 'auto_calculated' && 'Auto Calculated'}
                    </td>
                    <td className="px-4 py-2 text-sm text-right font-medium">
                      ₹ {comp.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan="2" className="px-4 py-2">Gross Salary</td>
                  <td className="px-4 py-2 text-right">
                    ₹ {salary.grossSalary?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Deductions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Deduction</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salary.deductions && Object.entries(salary.deductions).map(([key, ded]) => (
                  <tr key={key}>
                    <td className="px-4 py-2 text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td className="px-4 py-2 text-sm text-right font-medium">
                      ₹ {ded.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-2">Total Deductions</td>
                  <td className="px-4 py-2 text-right">
                    ₹ {salary.totalDeductions?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Net Salary</p>
          <p className="text-3xl font-bold text-green-600">
            ₹ {salary.netSalary?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}

