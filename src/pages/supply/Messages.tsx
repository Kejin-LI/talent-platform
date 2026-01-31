import React from 'react';
import SupplyLayout from '@/components/supply/SupplyLayout';

const Messages = () => {
  return (
    <SupplyLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No new messages.</p>
      </div>
    </SupplyLayout>
  );
};

export default Messages;
