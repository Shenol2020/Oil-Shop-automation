import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  RefreshCw, 
  Printer, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText,
  Filter
} from 'lucide-react';
import { reportsApi } from '../api';

export default function ReportsPage({ showToast }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Report Generator Form State
  const [reportMode, setReportMode] = useState('DAILY'); // 'DAILY' | 'MONTHLY'
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyYear, setMonthlyYear] = useState(new Date().getFullYear());
  const [monthlyMonth, setMonthlyMonth] = useState(new Date().getMonth() + 1);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const years = [2024, 2025, 2026, 2027];

  const fetchReports = async () => {
    setLoading(true);
    const res = await reportsApi.getAllReports();
    const list = res.data || [];
    setReports(list);
    if (list.length > 0 && !selectedReport) {
      setSelectedReport(list[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      let res;
      if (reportMode === 'DAILY') {
        res = await reportsApi.createDailyReport(dailyDate);
        showToast({ type: 'success', message: `Daily report for ${dailyDate} generated successfully!` });
      } else {
        res = await reportsApi.createMonthlyReport(monthlyYear, monthlyMonth);
        const monthName = months.find(m => m.value === Number(monthlyMonth))?.label || monthlyMonth;
        showToast({ type: 'success', message: `Monthly report for ${monthName} ${monthlyYear} generated successfully!` });
      }

      if (res && res.data) {
        setSelectedReport(res.data);
      }
      fetchReports();
    } catch (err) {
      console.error('Error generating report:', err);
      showToast({ type: 'danger', message: 'Failed to generate report' });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations for selected report or overall aggregates
  const activeReport = selectedReport || (reports.length > 0 ? reports[0] : null);
  const revenue = parseFloat(activeReport?.totalRevenue || activeReport?.totalSales || 0);
  const salesCount = parseInt(activeReport?.numberOfSales || 0);
  const avgSaleValue = salesCount > 0 ? (revenue / salesCount) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Top Header Controls */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Sales Reports & Analytics
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Generate official Daily or Monthly sales reports directly via Spring Boot ReportController
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchReports} className="btn btn-secondary">
            <RefreshCw size={16} /> Sync Reports
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Generation Bar: Daily vs Monthly Choice */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <form onSubmit={handleGenerateReport} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Report Type:
            </span>
            <div style={{
              display: 'flex',
              backgroundColor: '#F1F5F9',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => setReportMode('DAILY')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: reportMode === 'DAILY' ? 'var(--primary)' : 'transparent',
                  color: reportMode === 'DAILY' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Daily Report
              </button>
              <button
                type="button"
                onClick={() => setReportMode('MONTHLY')}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: reportMode === 'MONTHLY' ? 'var(--primary)' : 'transparent',
                  color: reportMode === 'MONTHLY' ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                Monthly Report
              </button>
            </div>
          </div>

          {/* Date / Month Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {reportMode === 'DAILY' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date:</span>
                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  required
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Month:</span>
                <select
                  value={monthlyMonth}
                  onChange={(e) => setMonthlyMonth(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: '130px' }}
                >
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>

                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>Year:</span>
                <select
                  value={monthlyYear}
                  onChange={(e) => setMonthlyYear(e.target.value)}
                  className="form-control"
                  style={{ borderRadius: '10px', padding: '0.45rem 0.75rem', fontSize: '0.85rem', width: '90px' }}
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={generating}
              className="btn btn-primary"
              style={{ borderRadius: '12px' }}
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <Plus size={16} /> Generate {reportMode === 'DAILY' ? 'Daily' : 'Monthly'} Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Metric Cards for Active Selected Report */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Revenue
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Rs.{revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Number of Sales
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {salesCount} Transactions
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)'
          }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Avg. Sale Value
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Rs.{avgSaleValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: '#F3E8FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9333EA'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Period
            </span>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {activeReport ? `${activeReport.periodStart} ${activeReport.periodStart !== activeReport.periodEnd ? 'to ' + activeReport.periodEnd : ''}` : 'No report selected'}
            </h4>
          </div>
        </div>
      </div>

      {/* Reports History Table Card */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Generated Reports History ({reports.length})
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Click any row to view its details above
          </span>
        </div>

        <div className="table-responsive" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th>Period Start</th>
                <th>Period End</th>
                <th>Sales Count</th>
                <th>Total Revenue</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading reports from Spring Boot backend...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No reports generated yet. Choose Daily or Monthly above and click Generate.
                  </td>
                </tr>
              ) : (
                reports.map((rpt, idx) => {
                  const rptId = rpt.reportId || (idx + 1);
                  const isSelected = activeReport?.reportId === rpt.reportId;
                  const isDaily = rpt.reportType === 'DAILY';
                  const rptRevenue = parseFloat(rpt.totalRevenue || rpt.totalSales || 0);

                  return (
                    <tr
                      key={rptId}
                      onClick={() => setSelectedReport(rpt)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: isSelected ? '#F0FDF4' : 'transparent'
                      }}
                    >
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        #{rptId}
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isDaily ? '#DCFCE7' : '#E0F2FE',
                          color: isDaily ? '#15803D' : '#0369A1'
                        }}>
                          {rpt.reportType}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        {rpt.periodStart || 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {rpt.periodEnd || 'N/A'}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {rpt.numberOfSales || 0} sale(s)
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        Rs.{rptRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(rpt);
                          }}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            borderRadius: '8px',
                            backgroundColor: isSelected ? 'var(--primary)' : undefined,
                            color: isSelected ? '#FFFFFF' : undefined
                          }}
                        >
                          {isSelected ? 'Viewing' : 'View'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
