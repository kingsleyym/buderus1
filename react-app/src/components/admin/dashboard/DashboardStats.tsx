import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Plus,
  Euro, 
  TrendingUp, 
  Phone,
  Target,
  Award
} from 'lucide-react';
import { mockLeads } from '../../../data/mockLeads';
import { calculateCommission } from '../../../types/Lead';

interface DashboardStats {
  leads: {
    total: number;
    thisMonth: number;
    new: number;
    qualified: number;
    conversion: number;
  };
  appointments: {
    today: number;
    thisWeek: number;
    upcoming: number;
    completed: number;
  };
  revenue: {
    thisMonth: number;
    thisQuarter: number;
    target: number;
    achievement: number;
  };
  employees: {
    active: number;
    topPerformer: string;
    totalCalls: number;
  };
}

// Echte Statistiken basierend auf Mock-Leads berechnen
const calculateRealStats = (): DashboardStats => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  
  // Lead-Statistiken
  const totalLeads = mockLeads.length;
  const thisMonthLeads = mockLeads.filter(lead => lead.createdAt >= thisMonth).length;
  const newLeads = mockLeads.filter(lead => lead.status.current === 'new').length;
  const qualifiedLeads = mockLeads.filter(lead => lead.status.current === 'qualified').length;
  const wonLeads = mockLeads.filter(lead => lead.status.current === 'closed_won').length;
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;
  
  // Revenue-Statistiken
  const thisMonthRevenue = mockLeads
    .filter(lead => lead.status.current === 'closed_won' && lead.conversionDate && lead.conversionDate >= thisMonth)
    .reduce((sum, lead) => sum + (lead.totalFinalValue || lead.totalEstimatedValue), 0);
    
  const thisQuarterRevenue = mockLeads
    .filter(lead => lead.status.current === 'closed_won' && lead.conversionDate && lead.conversionDate >= thisQuarter)
    .reduce((sum, lead) => sum + (lead.totalFinalValue || lead.totalEstimatedValue), 0);
  
  // Termine aus History ableiten
  const appointmentHistories = mockLeads.flatMap(lead => 
    lead.history.filter(h => h.action === 'meeting_scheduled')
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  
  const todayAppointments = appointmentHistories.filter(h => {
    const appointmentDate = new Date(h.timestamp);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  }).length;
  
  const thisWeekAppointments = appointmentHistories.filter(h => 
    h.timestamp >= today && h.timestamp <= endOfWeek
  ).length;
  
    // Mitarbeiter-Statistiken
  const uniqueEmployeeIds = mockLeads
    .map(lead => lead.commission.salespersonId)
    .filter((id, index, array) => id && array.indexOf(id) === index)
    .filter(Boolean);
  const activeEmployees = uniqueEmployeeIds.length;
  
  const employeeStats = mockLeads.reduce((acc, lead) => {
    const empId = lead.commission.salespersonId;
    if (empId) {
      if (!acc[empId]) {
        acc[empId] = { leads: 0, revenue: 0, commission: 0 };
      }
      acc[empId].leads++;
      acc[empId].revenue += lead.totalEstimatedValue;
      acc[empId].commission += calculateCommission(lead).salesCommission;
    }
    return acc;
  }, {} as Record<string, { leads: number; revenue: number; commission: number }>);
  
  const topPerformerEntry = Object.entries(employeeStats).reduce(
    (best, current) => {
      return current[1].revenue > best[1].revenue ? current : best;
    },
    ['Kein Mitarbeiter', { leads: 0, revenue: 0, commission: 0 }]
  );
  const topPerformer = topPerformerEntry[0];
  const topPerformerName = mockLeads.find(lead => lead.commission.salespersonId === topPerformer)?.history?.[0]?.performedBy || 'N/A';
  
  const totalCalls = mockLeads.flatMap(lead => 
    lead.history.filter(h => h.action === 'contacted' || h.action === 'follow_up')
  ).length;

  return {
    leads: {
      total: totalLeads,
      thisMonth: thisMonthLeads,
      new: newLeads,
      qualified: qualifiedLeads,
      conversion: conversionRate
    },
    appointments: {
      today: todayAppointments,
      thisWeek: thisWeekAppointments,
      upcoming: thisWeekAppointments + 5, // Mock-Wert für anstehende Termine
      completed: appointmentHistories.length
    },
    revenue: {
      thisMonth: thisMonthRevenue,
      thisQuarter: thisQuarterRevenue,
      target: 500000,
      achievement: thisQuarterRevenue > 0 ? (thisQuarterRevenue / 500000) * 100 : 0
    },
    employees: {
      active: activeEmployees,
      topPerformer: topPerformerName,
      totalCalls: totalCalls
    }
  };
};

const DashboardStatsComponent: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(calculateRealStats());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Echte Statistiken aus Mock-Daten berechnen
      const realStats = calculateRealStats();
      setStats(realStats);
      setLoading(false);
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: number;
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <div className="content-card stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
            <TrendingUp size={16} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-stats">
        <div className="loading-stats">
          <div className="loading-spinner"></div>
          <p>Lade Statistiken...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {/* Leads Statistiken */}
        <StatCard
          title="Gesamt Leads"
          value={stats.leads.total}
          subtitle={`${stats.leads.thisMonth} diesen Monat`}
          icon={<Users size={24} />}
          color="#3B82F6"
          trend={12.5}
        />

        <StatCard
          title="Neue Leads"
          value={stats.leads.new}
          subtitle="Diese Woche"
          icon={<Target size={24} />}
          color="#10B981"
          trend={8.3}
        />

        <StatCard
          title="Qualifizierte Leads"
          value={stats.leads.qualified}
          subtitle={`${stats.leads.conversion}% Conversion`}
          icon={<Award size={24} />}
          color="#F59E0B"
          trend={-2.1}
        />

        {/* Termine */}
        <StatCard
          title="Termine heute"
          value={stats.appointments.today}
          subtitle={`${stats.appointments.thisWeek} diese Woche`}
          icon={<Calendar size={24} />}
          color="#8B5CF6"
        />

        <StatCard
          title="Anstehende Termine"
          value={stats.appointments.upcoming}
          subtitle={`${stats.appointments.completed} abgeschlossen`}
          icon={<Phone size={24} />}
          color="#06B6D4"
        />

        {/* Revenue */}
        <StatCard
          title="Umsatz Monat"
          value={formatCurrency(stats.revenue.thisMonth)}
          subtitle={`${stats.revenue.achievement}% vom Ziel`}
          icon={<Euro size={24} />}
          color="#10B981"
          trend={15.2}
        />

        <StatCard
          title="Quartal"
          value={formatCurrency(stats.revenue.thisQuarter)}
          subtitle={`Ziel: ${formatCurrency(stats.revenue.target)}`}
          icon={<TrendingUp size={24} />}
          color="#3B82F6"
          trend={22.8}
        />

        {/* Mitarbeiter */}
        <StatCard
          title="Aktive Verkäufer"
          value={stats.employees.active}
          subtitle={`Top: ${stats.employees.topPerformer}`}
          icon={<Users size={24} />}
          color="#F59E0B"
        />
      </div>

      {/* Zusätzliche Details */}
      <div className="stats-details">
        <div className="content-card">
          <h3>📊 Monatlicher Überblick</h3>
          <div className="detail-stats">
            <div className="detail-item">
              <span className="detail-label">Lead Conversion:</span>
              <span className="detail-value">{stats.leads.conversion}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Durchschnitt pro Lead:</span>
              <span className="detail-value">{formatCurrency(stats.revenue.thisMonth / stats.leads.thisMonth)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Termine pro Woche:</span>
              <span className="detail-value">{Math.round(stats.appointments.thisWeek / 1)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Zielerreichung:</span>
              <span className="detail-value">{stats.revenue.achievement}%</span>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h3>🎯 Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn primary">
              <Plus size={16} />
              Neuer Lead
            </button>
            <button className="action-btn secondary">
              <Calendar size={16} />
              Termin planen
            </button>
            <button className="action-btn secondary">
              <FileText size={16} />
              Angebot erstellen
            </button>
            <button className="action-btn secondary">
              <Phone size={16} />
              Follow-up Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsComponent;
