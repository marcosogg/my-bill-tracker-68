import React from 'react';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  return (
    <header className="mb-6 md:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-0">{title}</h1>
        {actions && (
          <div className="flex gap-4">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

interface StandardPageLayoutProps {
  children: React.ReactNode;
}

const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">My Bill Tracker</h1>
        </div>
      </header>
      
      <nav className="bg-secondary text-secondary-foreground py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <ul className="flex flex-wrap gap-4 md:gap-6">
            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="/add-bill" className="hover:text-primary transition-colors">Add Bill</a></li>
            <li><a href="/bills" className="hover:text-primary transition-colors">All Bills</a></li>
            <li><a href="/payment-history" className="hover:text-primary transition-colors">Payment History</a></li>
            <li><a href="/reports" className="hover:text-primary transition-colors">Reports</a></li>
            <li><a href="/settings" className="hover:text-primary transition-colors">Settings</a></li>
            <li><a href="/calendar" className="hover:text-primary transition-colors">Calendar</a></li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} My Bill Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export { StandardPageLayout, PageHeader };
export default StandardPageLayout;