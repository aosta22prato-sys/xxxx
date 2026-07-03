import React, { useEffect, useState } from 'react';
import { useShopStore } from '../../stores/shopStore';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface InitStep {
  id: string;
  name: string;
  status: 'wait' | 'run' | 'done' | 'fail';
}

export default function EnterpriseInitView() {
  const { setInitialized } = useShopStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<InitStep[]>([
    { id: '1', name: '创建企业', status: 'wait' },
    { id: '2', name: '创建租户', status: 'wait' },
    { id: '3', name: '创建数据库', status: 'wait' },
    { id: '4', name: '创建行业后台', status: 'wait' },
    { id: '5', name: '创建默认角色', status: 'wait' },
    { id: '6', name: '创建默认权限', status: 'wait' },
    { id: '7', name: '创建AI员工', status: 'wait' },
    { id: '8', name: '创建知识库', status: 'wait' },
    { id: '9', name: '创建工作流', status: 'wait' },
    { id: '10', name: '创建应用空间', status: 'wait' },
    { id: '11', name: '创建企业配置', status: 'wait' },
    { id: '12', name: '初始化完成', status: 'wait' },
  ]);

  useEffect(() => {
    if (currentStepIndex >= steps.length) return;

    // Start running the current step
    setSteps((prev) =>
      prev.map((step, idx) => {
        if (idx === currentStepIndex) {
          return { ...step, status: 'run' };
        }
        return step;
      })
    );

    // Simulate duration for step completion
    const timer = setTimeout(() => {
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === currentStepIndex) {
            return { ...step, status: 'done' };
          }
          return step;
        })
      );
      setCurrentStepIndex((prev) => prev + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const isComplete = currentStepIndex >= steps.length;

  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-col items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-white border border-[#e3e3e3] rounded-2xl p-6 shadow-sm">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {isComplete ? '企业空间初始化成功' : '正在创建您的企业空间'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {isComplete ? '所有智能、多租户及数据库底层已就绪' : '构建下一代 AI Commerce OS'}
          </p>
        </div>

        {/* Steps Progress List */}
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {steps.map((step, idx) => {
            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-colors duration-250 ${
                  step.status === 'done'
                    ? 'bg-neutral-50/50 border-[#008060]/20 text-neutral-800'
                    : step.status === 'run'
                    ? 'bg-[#008060]/5 border-[#008060] text-neutral-900 font-medium'
                    : 'bg-[#fafafa] border-neutral-100 text-neutral-400'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#008060] shrink-0" />
                  ) : step.status === 'run' ? (
                    <Loader2 className="w-4 h-4 text-[#008060] animate-spin shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-300 shrink-0" />
                  )}
                  <span>{step.name}</span>
                </div>

                <div>
                  {step.status === 'done' && (
                    <span className="text-[10px] bg-[#008060]/15 text-[#008060] px-2 py-0.5 rounded-full font-semibold">
                      完成
                    </span>
                  )}
                  {step.status === 'run' && (
                    <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                      进行中
                    </span>
                  )}
                  {step.status === 'wait' && (
                    <span className="text-[10px] bg-neutral-105 text-neutral-400 px-2 py-0.5 rounded-full font-semibold">
                      等待
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Enter Control Center Option */}
        {isComplete && (
          <div className="mt-8 transition-all duration-300">
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center mb-4">
              <span className="text-xs text-neutral-600 block">企业创建成功</span>
            </div>
            <button
              id="enter-control-center-btn"
              onClick={() => setInitialized(true)}
              className="w-full text-center text-xs font-bold text-white py-3 rounded-lg shadow-sm transition-all focus:outline-none bg-[#008060] hover:bg-[#006e52] active:bg-[#005d45]"
            >
              进入控制中心
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
