



/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrandLensProvider, useBrandLens } from './lib/store';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BrandKitView } from './components/BrandKitView';
import { ReviewWorkspaceView } from './components/ReviewWorkspaceView';
import { ApprovalInboxView } from './components/ApprovalInboxView';
import { InsightsView } from './components/InsightsView';
import { SettingsView } from './components/SettingsView';
import { CitationDrawer } from './components/CitationDrawer';
import { LoginView } from './components/LoginView';
import { RBAC } from './lib/rbac';
import { ShieldAlert } from 'lucide-react';

const AppShell: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useBrandLens();
  const [accessDeniedMessage, setAccessDeniedMessage] = useState<string | null>(null);

  // Hard RBAC Route Guard: If a restricted page is accessed, redirect to dashboard with Access Denied toast
  useEffect(() => {
    if (activeTab === 'settings' && !RBAC.canAccessSettings(currentUser.role)) {
      setActiveTab('dashboard');
      setAccessDeniedMessage(
        `Access Denied: Your role (${currentUser.role}) does not have permission to access Settings.`
      );
      const timer = setTimeout(() => setAccessDeniedMessage(null), 4000);
      return () => clearTimeout(timer);
    }

    if (activeTab === 'inbox' && !RBAC.canAccessInbox(currentUser.role)) {
      setActiveTab('dashboard');
      setAccessDeniedMessage(
        `Access Denied: Your role (${currentUser.role}) does not have permission to access the Approval Inbox.`
      );
      const timer = setTimeout(() => setAccessDeniedMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, currentUser.role, setActiveTab]);

  return (
    <div className="min-h-screen bg-[#0B111E] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Global Access Denied Toast / Alert */}
      {accessDeniedMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-200 max-w-md">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-rose-950/95 border border-rose-700 text-rose-200 shadow-2xl backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-100 block">Authorization Error</span>
              <span>{accessDeniedMessage}</span>
            </div>
            <button
              onClick={() => setAccessDeniedMessage(null)}
              className="ml-auto text-rose-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'brand-kit' && <BrandKitView />}
        {activeTab === 'workspace' && <ReviewWorkspaceView />}
        {activeTab === 'inbox' && <ApprovalInboxView />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'login' && <LoginView />}
      </main>

      {/* Evidence Source & Guideline Citation Slide-Out Drawer */}
      <CitationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <BrandLensProvider>
      <AppShell />
    </BrandLensProvider>
  );
}
