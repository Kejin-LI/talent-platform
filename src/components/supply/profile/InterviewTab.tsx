import React from 'react';
import { Video, Star, Clock, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

const InterviewTab = () => {
  const { interviewRecords, removeInterviewRecord } = useResumeStore();

  if (!interviewRecords || interviewRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">面试记录 (Interview Records)</h3>
        <p className="text-gray-500 max-w-md">
          您还没有任何面试记录。申请任务并通过简历筛选后，由于AI面试生成的记录将显示在这里。
        </p>
        <p className="text-gray-400 text-sm mt-4">
          (No interview records yet. Records generated from AI interviews will appear here.)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Interview Records ({interviewRecords.length})</h3>
      <div className="grid gap-6">
        {[...interviewRecords].reverse().map((record) => (
          <div key={record.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="truncate max-w-[400px] block" title={record.role}>
                    {record.role}
                  </span>
                  <div className="flex-shrink-0">
                    {record.status === 'passed' && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">通过</span>
                    )}
                    {record.status === 'failed' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">不通过</span>
                    )}
                    {record.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">审核中</span>
                    )}
                  </div>
                </h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(record.startTime).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {new Date(record.startTime).toLocaleTimeString()} - {new Date(record.endTime).toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {record.status !== 'pending' ? (
                  <>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 uppercase font-semibold">Score</span>
                      <div className="flex items-center gap-1 text-2xl font-bold text-indigo-600">
                        {record.score}<span className="text-sm text-gray-400 font-normal">/100</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      record.score! >= 90 ? 'bg-green-100 text-green-600' : 
                      record.score! >= 80 ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      <Star size={20} fill="currentColor" />
                    </div>
                  </>
                ) : (
                   <div className="flex flex-col items-end px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-xs text-gray-400 uppercase font-bold">Status</span>
                      <span className="text-sm font-medium text-gray-600">Pending Score</span>
                   </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Feedback & Suggestions</h5>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                {record.feedback}
              </p>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <button 
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this interview record?")) {
                    removeInterviewRecord(record.id);
                  }
                }}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium hover:underline"
              >
                Delete <Trash2 size={14} />
              </button>
              <a href={record.videoLink} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                View Recording <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewTab;
