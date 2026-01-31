import React, { useState } from 'react';
import SupplyLayout from '@/components/supply/SupplyLayout';
import ResumeTab from '@/components/supply/profile/ResumeTab';
import InterviewTab from '@/components/supply/profile/InterviewTab';
import TechnicalTestTab from '@/components/supply/profile/TechnicalTestTab';
import { User, FileText, Video, Code2 } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'resume' | 'interview' | 'test'>('resume');

  const tabs = [
    { id: 'resume', label: '简历 (Resume)', icon: FileText },
    { id: 'interview', label: '面试 (Interview)', icon: Video },
    { id: 'test', label: '笔试 (Technical Test)', icon: Code2 },
  ] as const;

  return (
    <SupplyLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">个人资料 (My Profile)</h1>
            <p className="text-gray-500">管理您的个人信息、简历及申请记录</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 mb-8 bg-white rounded-t-xl px-2 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all relative
                  ${isActive ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                `}
              >
                <Icon size={18} />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'resume' && <ResumeTab />}
          {activeTab === 'interview' && <InterviewTab />}
          {activeTab === 'test' && <TechnicalTestTab />}
        </div>
      </div>
    </SupplyLayout>
  );
};

export default Profile;
