import React from 'react';
import SupplyLayout from '@/components/supply/SupplyLayout';

const Wallet = () => {
  return (
    <SupplyLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wallet</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Balance: $0.00</p>
      </div>
    </SupplyLayout>
  );
};

export default Wallet;
