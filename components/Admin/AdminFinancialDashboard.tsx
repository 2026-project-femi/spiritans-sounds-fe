"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@payloadcms/ui";
import Link from "next/link";
import { DollarSign, BookOpen, UserCheck, TrendingUp } from "lucide-react";

export function AdminFinancialDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // We only show this to publishing admins and super admins
  if (user?.role !== "admin" && user?.role !== "publishing_admin") {
    return null;
  }

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/financial-stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) return <div className="p-4">Loading financial metrics...</div>;
  if (!stats) return null;

  return (
    <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#111827' }}>Publishing Financial Overview</h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Monitor platform sales, commissions, and author payouts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Gross Sales */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <TrendingUp style={{ color: '#22c55e', width: '20px', height: '20px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Sales</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>₦{stats.grossRevenue.toLocaleString()}</p>
        </div>

        {/* Platform Commission */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <DollarSign style={{ color: '#3b82f6', width: '20px', height: '20px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Commission</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#2563eb' }}>₦{stats.totalCommission.toLocaleString()}</p>
        </div>

        {/* Author Earnings */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <UserCheck style={{ color: '#a855f7', width: '20px', height: '20px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Author Earnings</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#9333ea' }}>₦{stats.totalAuthorEarnings.toLocaleString()}</p>
        </div>

        {/* Total Sales */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BookOpen style={{ color: '#f97316', width: '20px', height: '20px' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Sales</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#111827' }}>{stats.totalSalesCount}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link 
          href="/admin/collections/orders" 
          style={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none' }}
        >
          View All Orders
        </Link>
        <Link 
          href="/admin/collections/payouts" 
          style={{ fontSize: '0.875rem', fontWeight: 500, backgroundColor: '#faf5ff', color: '#9333ea', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none' }}
        >
          Manage Payouts
        </Link>
      </div>
    </div>
  );
}
