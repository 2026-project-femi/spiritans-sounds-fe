"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@payloadcms/ui";
import Link from "next/link";
import { Eye, FileText, Globe } from "lucide-react";

interface ContentStat {
  collection: string;
  id: string | number;
  title: string;
  slug?: string;
  views: number;
}

interface PageStat {
  path: string;
  title?: string;
  views: number;
  lastViewedAt?: string;
}

interface AnalyticsStats {
  totals: {
    totalContentViews: number;
    totalPageViews: number;
  };
  topContent: ContentStat[];
  topPages: PageStat[];
}

const COLLECTION_LABELS: Record<string, string> = {
  homily: "Homily",
  article: "Article",
  publications: "Book",
  prayer: "Prayer",
  events: "Event",
  music: "Music",
  magazineIssues: "Magazine",
};

const cardStyle: React.CSSProperties = {
  padding: "1rem",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #f3f4f6",
};

export function AdminAnalyticsDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isAllowed = user?.role === "admin" || user?.role === "publishing_admin";

  useEffect(() => {
    if (!isAllowed) return;

    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/analytics-stats");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch analytics stats", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [isAllowed]);

  if (!isAllowed) return null;
  if (loading) return <div style={{ padding: "1rem" }}>Loading analytics...</div>;
  if (!stats) return null;

  return (
    <div
      style={{
        marginBottom: "2rem",
        padding: "1.5rem",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "#111827" }}>
          Content Analytics
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>
          Views recorded across homilies, articles, books, prayers, events, music and magazine issues.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Eye style={{ color: "#2563eb", width: 20, height: 20 }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Content Views
            </span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#111827" }}>
            {stats.totals.totalContentViews.toLocaleString()}
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <Globe style={{ color: "#16a34a", width: 20, height: 20 }} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Page Views
            </span>
          </div>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: "#111827" }}>
            {stats.totals.totalPageViews.toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        <div>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.75rem 0" }}>
            Top Content
          </h3>
          {stats.topContent.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}>No content views recorded yet.</p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "0.5rem" }}>
              {stats.topContent.map((item) => (
                <li key={`${item.collection}-${item.id}`} style={{ fontSize: "0.875rem", color: "#374151" }}>
                  <Link
                    href={`/admin/collections/${item.collection}/${item.id}`}
                    style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}
                  >
                    {item.title}
                  </Link>
                  <span style={{ color: "#9ca3af" }}>
                    {" "}
                    — {COLLECTION_LABELS[item.collection] || item.collection} · {item.views.toLocaleString()} views
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 0.75rem 0" }}>
            Top Pages
          </h3>
          {stats.topPages.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#9ca3af", margin: 0 }}>No page views recorded yet.</p>
          ) : (
            <ol style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "0.5rem" }}>
              {stats.topPages.map((page) => (
                <li key={page.path} style={{ fontSize: "0.875rem", color: "#374151" }}>
                  <Link
                    href={`/admin/collections/pageViews`}
                    style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}
                  >
                    {page.path}
                  </Link>
                  <span style={{ color: "#9ca3af" }}> — {page.views.toLocaleString()} views</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <Link
          href="/admin/collections/pageViews"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            backgroundColor: "#f0fdf4",
            color: "#16a34a",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          <FileText size={16} /> All Page Views
        </Link>
      </div>
    </div>
  );
}
