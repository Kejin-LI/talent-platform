import React from 'react';
import SupplyLayout from '@/components/supply/SupplyLayout';

const MyTasks = () => {
  return (
    <SupplyLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No active tasks currently.</p>
      </div>
    </SupplyLayout>
  );
};

export default MyTasks;
