import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { CheckCircle, XCircle, SaveIcon } from 'lucide-react';

const VerificationModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  verificationSteps, 
  reviewData 
}) => {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCompletedSteps(0);
      setIsVerificationComplete(false);

      const stepTimer = setInterval(() => {
        setCompletedSteps(prev => {
          if (prev < verificationSteps.length) {
            return prev + 1;
          }
          clearInterval(stepTimer);
          setIsVerificationComplete(true);
          return prev;
        });
      }, 2000);

      return () => clearInterval(stepTimer);
    }
  }, [isOpen, verificationSteps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="bg-[#0a0a0a] rounded-2xl shadow-2xl shadow-emerald-900/20 w-full max-w-4xl border border-emerald-900/30">
        <div className="p-6 border-b border-emerald-900/30">
          <h2 className="text-2xl font-bold text-emerald-500 text-center">
            Review Verification Process
          </h2>
        </div>

        <div className="p-6">
          <VerticalTimeline 
            lineColor="#10b981" 
            animate={false} 
            className="bg-transparent"
          >
            {verificationSteps.map((step, index) => (
              <VerticalTimelineElement
                key={index}
                date=""
                iconStyle={{ 
                  background: index < completedSteps ? '#10b981' : '#1a1a1a', 
                  color: 'white',
                  boxShadow: index < completedSteps 
                    ? '0 0 10px #10b981, 0 0 20px #10b981' 
                    : 'none'
                }}
                icon={index < completedSteps ? <CheckCircle /> : step.icon}
                contentStyle={{ 
                  background: '#0f0f0f', 
                  color: 'white',
                  boxShadow: 'none',
                  border: index < completedSteps 
                    ? '1px solid #10b981' 
                    : '1px solid #1a1a1a'
                }}
                contentArrowStyle={{ borderRight: '7px solid #0f0f0f' }}
              >
                <h3 className="vertical-timeline-element-title text-emerald-500">
                  {step.title}
                </h3>
                <p className="text-emerald-600 opacity-80">{step.description}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>

        {isVerificationComplete && (
          <div className="p-6 border-t border-emerald-900/30 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CheckCircle className="text-emerald-500 w-8 h-8" />
              <p className="text-white">Verification Complete</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={onClose}
                className="flex items-center px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <XCircle className="mr-2 w-5 h-5 text-red-500" /> Cancel
              </button>
              <button 
                onClick={() => onSave(reviewData)}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <SaveIcon className="mr-2 w-5 h-5" /> Save Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationModal;