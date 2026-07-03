import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ProvisioningPageProps {
  workspaceName: string;
  industryName: string;
  onFinished: () => void;
}

type StepStatus = '等待' | '进行中' | '完成' | '失败';

interface InitializerStep {
  id: number;
  label: string;
  status: StepStatus;
}

export default function ProvisioningPage({ workspaceName, industryName, onFinished }: ProvisioningPageProps) {
  const [steps, setSteps] = useState<InitializerStep[]>([
    { id: 1, label: '创建企业', status: '等待' },
    { id: 2, label: '创建租户', status: '等待' },
    { id: 3, label: '创建数据库', status: '等待' },
    { id: 4, label: '创建行业后台', status: '等待' },
    { id: 5, label: '创建默认角色', status: '等待' },
    { id: 6, label: '创建默认权限', status: '等待' },
    { id: 7, label: '创建AI员工', status: '等待' },
    { id: 8, label: '创建知识库', status: '等待' },
    { id: 9, label: '创建工作流', status: '等待' },
    { id: 10, label: '创建应用空间', status: '等待' },
    { id: 11, label: '创建企业配置', status: '等待' },
    { id: 12, label: '初始化完成', status: '等待' },
  ]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentIdx < steps.length) {
      // Set current step status to "进行中"
      setSteps(prev => 
        prev.map((step, index) => {
          if (index === currentIdx) {
            return { ...step, status: '进行中' };
          }
          if (index < currentIdx) {
            return { ...step, status: '完成' };
          }
          return step;
        })
      );

      // Simulation delay for progress
      const delay = currentIdx === 11 ? 800 : 400; // Final finish step holds slightly longer for completeness feel
      const timer = setTimeout(() => {
        setCurrentIdx(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Mark final step completed
      setSteps(prev => prev.map(step => ({ ...step, status: '完成' })));
      setIsFinished(true);
    }
  }, [currentIdx]);

  return (
    <div 
      className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none font-sans"
    >
      <div 
        className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col space-y-6 text-slate-900"
      >
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {isFinished ? '企业创建成功' : '正在创建您的企业空间'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            企业: <span className="text-slate-800 font-bold">{workspaceName}</span> | 行业: <span className="text-slate-800 font-bold">{industryName}</span>
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {steps.map((step) => {
            let statusColorClass = 'text-slate-400';
            let statusTextClass = 'text-slate-400 bg-slate-100';
            let statusLabel = '等待';

            if (step.status === '进行中') {
              statusColorClass = 'text-slate-800 font-medium';
              statusTextClass = 'text-[#07C2E3] bg-[#e6fafc] font-bold animate-pulse';
              statusLabel = '进行中';
            } else if (step.status === '完成') {
              statusColorClass = 'text-slate-700';
              statusTextClass = 'text-emerald-600 bg-emerald-50 font-semibold';
              statusLabel = '完成';
            } else if (step.status === '失败') {
              statusColorClass = 'text-red-500';
              statusTextClass = 'text-red-650 bg-red-50 font-semibold';
              statusLabel = '失败';
            }

            return (
              <div 
                key={step.id}
                className="flex items-center justify-between py-2 px-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {step.status === '进行中' ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#07C2E3] animate-spin shrink-0" />
                  ) : step.status === '完成' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0" />
                  )}
                  <span className={`text-xs ${statusColorClass}`}>{step.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded ${statusTextClass}`}>
                  {statusLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {isFinished && (
          <button
            onClick={onFinished}
            className="w-full bg-[#07C2E3] hover:bg-[#06B2D0] active:bg-[#059BBC] text-white text-xs font-bold py-3 px-4 rounded-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            进入控制中心
          </button>
        )}
      </div>
    </div>
  );
}
