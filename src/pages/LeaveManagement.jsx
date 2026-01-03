import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserLeaveRequests, 
  getPendingLeaveRequests, 
  getAllLeaveRequests,
  applyForLeave, 
  approveLeaveRequest, 
  rejectLeaveRequest,
  cancelLeaveRequest 
} from '../services/leaveService';
import { format } from 'date-fns';
import { Plane, Plus, Check, X, Clock } from 'lucide-react';

export default function LeaveManagement() {
  const { user, isAdmin } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaveRequests();
  }, [activeTab, isAdmin]);

  const loadLeaveRequests = async () => {
    setLoading(true);
    try {
      let requests;
      if (isAdmin) {
        if (activeTab === 'pending') {
          requests = await getPendingLeaveRequests();
        } else {
          requests = await getAllLeaveRequests();
        }
      } else {
        requests = await getUserLeaveRequests(user.id);
      }
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = leaveRequests.filter(req => {
    if (!isAdmin && activeTab !== 'all') {
      return req.status === activeTab;
    }
    return true;
  });

  const handleApprove = async (requestId, comments) => {
    try {
      await approveLeaveRequest(requestId, user.id, `${user.firstName} ${user.lastName}`, comments);
      await loadLeaveRequests();
      setShowModal(false);
      alert('Leave request approved');
    } catch (error) {
      alert('Failed to approve: ' + error.message);
    }
  };

  const handleReject = async (requestId, comments) => {
    try {
      await rejectLeaveRequest(requestId, user.id, `${user.firstName} ${user.lastName}`, comments);
      await loadLeaveRequests();
      setShowModal(false);
      alert('Leave request rejected');
    } catch (error) {
      alert('Failed to reject: ' + error.message);
    }
  };

  const handleCancel = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;
    try {
      await cancelLeaveRequest(requestId);
      await loadLeaveRequests();
      alert('Leave request cancelled');
    } catch (error) {
      alert('Failed to cancel: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-pending', icon: Clock, label: 'Pending' },
      approved: { class: 'badge-approved', icon: Check, label: 'Approved' },
      rejected: { class: 'badge-rejected', icon: X, label: 'Rejected' },
      cancelled: { class: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`badge ${badge.class}`}>
        {Icon && <Icon className="w-3 h-3 mr-1" />}
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          {!isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Apply for Leave</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        {!isAdmin && (
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['all', 'pending', 'approved', 'rejected'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Leave Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="card p-12 text-center">
              <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leave requests found</p>
            </div>
          ) : (
            filteredRequests.map(request => (
              <div key={request.id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {isAdmin && (
                        <h3 className="font-semibold text-lg">
                          {request.employeeName || `${request.firstName} ${request.lastName}`}
                        </h3>
                      )}
                      <span className={`badge ${request.leaveType === 'paid' ? 'bg-blue-100 text-blue-800' : 
                                       request.leaveType === 'sick' ? 'bg-green-100 text-green-800' : 
                                       'bg-gray-100 text-gray-800'}`}>
                        {request.leaveType?.charAt(0).toUpperCase() + request.leaveType?.slice(1)} Leave
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">
                        {format(new Date(request.fromDate), 'MMM dd, yyyy')} - {format(new Date(request.toDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{request.reason}</p>
                    {request.approverComments && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <span className="font-medium">Admin Comments: </span>
                        {request.approverComments}
                      </div>
                    )}
                    {request.approvedByName && (
                      <p className="text-xs text-gray-500 mt-2">
                        {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approvedByName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {isAdmin && request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => { setSelectedRequest(request); setShowModal(true); }}
                          className="btn btn-success text-sm"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => { setSelectedRequest({...request, action: 'reject'}); setShowModal(true); }}
                          className="btn btn-danger text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {!isAdmin && request.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(request.id)}
                        className="btn btn-danger text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Apply/Approve Modal */}
      {showModal && (
        <LeaveModal
          request={selectedRequest}
          isAdmin={isAdmin}
          user={user}
          onClose={() => { setShowModal(false); setSelectedRequest(null); }}
          onApply={async (data) => {
            try {
              await applyForLeave(user.id, user.employeeId, `${user.firstName} ${user.lastName}`, data);
              await loadLeaveRequests();
              setShowModal(false);
              alert('Leave request submitted successfully');
            } catch (error) {
              alert('Failed to submit: ' + error.message);
            }
          }}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

function LeaveModal({ request, isAdmin, user, onClose, onApply, onApprove, onReject }) {
  const [formData, setFormData] = useState({
    leaveType: 'paid',
    fromDate: '',
    toDate: '',
    reason: ''
  });
  const [comments, setComments] = useState('');
  const [action, setAction] = useState(request?.action || 'approve');

  const isApproval = isAdmin && request;
  const isApplication = !isAdmin && !request;

  const calculateDays = () => {
    if (!formData.fromDate || !formData.toDate) return 0;
    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const diff = Math.abs(to - from);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = () => {
    if (isApplication) {
      if (!formData.fromDate || !formData.toDate || !formData.reason) {
        alert('Please fill all fields');
        return;
      }
      onApply(formData);
    } else if (isApproval) {
      if (action === 'approve') {
        onApprove(request.id, comments);
      } else {
        onReject(request.id, comments);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {isApproval ? `${action === 'approve' ? 'Approve' : 'Reject'} Leave Request` : 'Apply for Leave'}
        </h2>

        {isApproval && request ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Employee</p>
              <p className="font-medium">{request.employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Leave Type</p>
              <p className="font-medium capitalize">{request.leaveType} Leave</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Dates</p>
              <p className="font-medium">
                {format(new Date(request.fromDate), 'MMM dd, yyyy')} - {format(new Date(request.toDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Days</p>
              <p className="font-medium">{request.totalDays} days</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Reason</p>
              <p className="font-medium">{request.reason}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="input"
                placeholder="Add comments..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                className="input"
              >
                <option value="paid">Paid Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                className="input"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={formData.toDate}
                onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                className="input"
                min={formData.fromDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            {formData.fromDate && formData.toDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                Total Days: {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                rows={4}
                className="input"
                placeholder="Enter reason for leave..."
                required
              />
            </div>
          </div>
        )}

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 btn btn-secondary">
            Cancel
          </button>
          {isApproval && action === 'reject' && (
            <button
              onClick={() => { setAction('approve'); }}
              className="flex-1 btn btn-success"
            >
              Switch to Approve
            </button>
          )}
          {isApproval && action === 'approve' && (
            <button
              onClick={() => { setAction('reject'); }}
              className="flex-1 btn btn-danger"
            >
              Switch to Reject
            </button>
          )}
          <button
            onClick={handleSubmit}
            className={`flex-1 btn ${isApproval && action === 'reject' ? 'btn-danger' : 'btn-primary'}`}
          >
            {isApproval ? (action === 'approve' ? 'Approve' : 'Reject') : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

