import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { getEmployee, updateEmployee, getSalaryInfo, updateSalary } from '../services/userService';
import { calculateSalary } from '../utils/salaryCalculation';
import { User, Briefcase, DollarSign, FileText } from 'lucide-react';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const { user: currentUser, isAdmin } = useAuth();
  const userId = searchParams.get('userId') || currentUser?.id;
  const canEdit = isAdmin || userId === currentUser?.id;
  
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userData = await getEmployee(userId);
      setUser(userData);
      setFormData(userData);
      
      const salaryData = await getSalaryInfo(userId);
      setSalary(salaryData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateEmployee(userId, formData);
      await loadUserData();
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleSalarySave = async (newWage) => {
    try {
      const newSalary = calculateSalary(newWage);
      await updateSalary(userId, newSalary);
      await loadUserData();
      alert('Salary updated successfully!');
    } catch (error) {
      throw error;
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'job', label: 'Job Details', icon: Briefcase },
    { id: 'salary', label: 'Salary Info', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.firstName} {user.lastName}'s Profile
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="card p-6">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              user={user} 
              formData={formData}
              setFormData={setFormData}
              editing={editing}
              setEditing={setEditing}
              canEdit={canEdit}
              onSave={handleSave}
            />
          )}
          {activeTab === 'job' && (
            <JobDetailsTab
              user={user}
              formData={formData}
              setFormData={setFormData}
              editing={editing}
              setEditing={setEditing}
              canEdit={isAdmin}
              onSave={handleSave}
            />
          )}
          {activeTab === 'salary' && (
            <SalaryInfoTab 
              salary={salary} 
              user={user} 
              canEdit={isAdmin} 
              onSave={handleSalarySave} 
            />
          )}
          {activeTab === 'documents' && (
            <div className="text-center py-12 text-gray-500">
              Document management coming soon
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PersonalInfoTab({ user, formData, setFormData, editing, setEditing, canEdit, onSave }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {canEdit && (
          <div className="space-x-2">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setFormData(user); }} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={onSave} className="btn btn-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
          <input type="text" value={user.employeeId || ''} disabled className="input bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={user.email || ''} disabled className="input bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            value={editing ? formData.firstName || '' : user.firstName || ''}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            disabled={!editing || !canEdit}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            value={editing ? formData.lastName || '' : user.lastName || ''}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            disabled={!editing || !canEdit}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={editing ? formData.phone || '' : user.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!editing}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            value={editing ? formData.address || '' : user.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={!editing}
            rows={3}
            className="input"
          />
        </div>
      </div>
    </div>
  );
}

function JobDetailsTab({ user, formData, setFormData, editing, setEditing, canEdit, onSave }) {
  const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];
  const employeeTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Job Details</h2>
        {canEdit && (
          <div className="space-x-2">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setFormData(user); }} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={onSave} className="btn btn-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            value={editing ? formData.designation || '' : user.designation || ''}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            disabled={!editing}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={editing ? formData.department || '' : user.department || ''}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            disabled={!editing}
            className="input"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
          <select
            value={editing ? formData.employeeType || '' : user.employeeType || ''}
            onChange={(e) => setFormData({ ...formData, employeeType: e.target.value })}
            disabled={!editing}
            className="input"
          >
            {employeeTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
          <input
            type="date"
            value={user.joiningDate || ''}
            disabled
            className="input bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Location</label>
          <input
            type="text"
            value={editing ? formData.workLocation || '' : user.workLocation || ''}
            onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
            disabled={!editing}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={editing ? formData.isActive ? 'active' : 'inactive' : user.isActive ? 'active' : 'inactive'}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
            disabled={!editing}
            className="input"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function SalaryInfoTab({ salary, user, canEdit, onSave }) {
  const [editing, setEditing] = useState(false);
  const [monthlyWage, setMonthlyWage] = useState(salary?.monthlyWage || 0);

  useEffect(() => {
    if (salary) {
      setMonthlyWage(salary.monthlyWage || 0);
    }
  }, [salary]);

  const handleSave = async () => {
    try {
      await onSave(monthlyWage);
      setEditing(false);
    } catch (error) {
      alert('Failed to update salary: ' + error.message);
    }
  };

  if (!salary) {
    return (
      <div className="text-center py-12 text-gray-500">
        Salary information not available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Salary Information</h2>
        {canEdit && (
          <div className="space-x-2">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setMonthlyWage(salary.monthlyWage); }} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="font-medium">Monthly Wage:</span>
          {editing && canEdit ? (
            <input
              type="number"
              value={monthlyWage}
              onChange={(e) => setMonthlyWage(parseFloat(e.target.value))}
              className="input w-32"
            />
          ) : (
            <span className="text-2xl font-bold">₹ {salary.monthlyWage?.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>

      <div>
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
                  <td className="px-4 py-2 text-sm text-right font-medium">₹ {comp.amount?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan="2" className="px-4 py-2">Gross Salary</td>
                <td className="px-4 py-2 text-right">₹ {salary.grossSalary?.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
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
                  <td className="px-4 py-2 text-sm text-right font-medium">₹ {ded.amount?.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2">Total Deductions</td>
                <td className="px-4 py-2 text-right">₹ {salary.totalDeductions?.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 mb-1">Net Salary</p>
        <p className="text-3xl font-bold text-green-600">₹ {salary.netSalary?.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}

