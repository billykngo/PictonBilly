import { useState, useEffect } from 'react';
import { ApprovalQueue } from './ApprovalQueue';
import { DashboardStats } from "./staff/DashboardStats";
import { RecentSubmissions } from "./staff/RecentSubmissions";
import { api } from "@/api/api";
import { useAuth } from "@/hooks/useAuth";

export const StaffDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    pendingApprovals: [],
    recentSubmissions: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [approvals, submissions, stats] = await Promise.all([
          api.staff.getPendingApprovals(),
          api.staff.getRecentSubmissions(),
          api.staff.getDashboardStats()
        ]);
        
        setDashboardData({
          pendingApprovals: approvals.data,
          recentSubmissions: submissions.data,
          stats: stats.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'staff' || user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline">Refresh Data</Button>
          <Button>New Announcement</Button>
        </div>
      </div>

      <DashboardStats loading={loading} data={dashboardData.stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ApprovalQueue 
            approvals={dashboardData.pendingApprovals} 
            loading={loading}
          />
        </div>
        
        <div className="space-y-6">
          <RecentSubmissions 
            submissions={dashboardData.recentSubmissions} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};