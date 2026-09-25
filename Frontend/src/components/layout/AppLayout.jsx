import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ activeTab, setActiveTab, title, subtitle, children }) {
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-wrapper">
        <Header title={title} subtitle={subtitle} />
        <main className="page-container">{children}</main>
      </div>
    </div>
  );
}
