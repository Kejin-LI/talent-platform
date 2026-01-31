import React from 'react';
import { Code2 } from 'lucide-react';

const TechnicalTestTab = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
        <Code2 className="w-8 h-8 text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">笔试记录 (Technical Test Records)</h3>
      <p className="text-gray-500 max-w-md">
        您还没有任何笔试记录。完成技术评估后，您的代码提交和评分结果将显示在这里。
      </p>
       <p className="text-gray-400 text-sm mt-4">
        (No technical test records yet. Your code submissions and scores will appear here.)
      </p>
    </div>
  );
};

export default TechnicalTestTab;
