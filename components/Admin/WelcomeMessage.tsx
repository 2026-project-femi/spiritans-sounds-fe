"use client";

import React from 'react'
import { useAuth } from '@payloadcms/ui'

export function WelcomeMessage() {
  const { user } = useAuth()
  
  const displayName = user?.name || user?.email?.split('@')[0] || 'Admin';

  return (
    <>
      <style>{`
        .custom-welcome-card {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 8px;
          background: rgba(235, 60, 60, 0.05);
          border: 1px solid rgba(235, 60, 60, 0.2);
        }
        
        .custom-welcome-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 0 0.5rem 0;
        }

        .custom-welcome-desc {
          margin: 0;
        }

        /* Default is Dark Mode colors */
        html[data-theme='dark'] .custom-welcome-title { color: #ffffff; }
        html[data-theme='dark'] .custom-welcome-desc { color: #9ca3af; }

        /* Light Mode colors */
        html[data-theme='light'] .custom-welcome-title { color: #000000; }
        html[data-theme='light'] .custom-welcome-desc { color: #4b5563; }
      `}</style>

      <div className="custom-welcome-card">
        <h2 className="custom-welcome-title">
          Welcome back, {displayName}! 👋
        </h2>
        <p className="custom-welcome-desc">Manage your content, approve comments, and track audio uploads here.</p>
      </div>
    </>
  )
}
