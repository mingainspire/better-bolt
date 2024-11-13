import React, { useState, useEffect } from 'react';

interface DashboardProps {}

interface VisualBreakdown {
  id: string;
  content: string;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [visualBreakdowns, setVisualBreakdowns] = useState<VisualBreakdown[]>([]);

  useEffect(() => {
    const savedBreakdowns = localStorage.getItem('visualBreakdowns');
    if (savedBreakdowns) {
      setVisualBreakdowns(JSON.parse(savedBreakdowns));
    }
  }, []);

  const saveToDashboard = (breakdown: string) => {
    const newBreakdown = { id: Date.now().toString(), content: breakdown };
    const updatedBreakdowns = [...visualBreakdowns, newBreakdown];
    setVisualBreakdowns(updatedBreakdowns);
    localStorage.setItem('visualBreakdowns', JSON.stringify(updatedBreakdowns));
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="visual-breakdowns">
        {visualBreakdowns.map((breakdown) => (
          <div key={breakdown.id} className="visual-breakdown">
            <div dangerouslySetInnerHTML={{ __html: breakdown.content }} />
          </div>
        ))}
      </div>
    </div>
  );
};
