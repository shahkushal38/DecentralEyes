import React, { useState, useEffect } from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { CheckCircle, XCircle, SaveIcon } from 'lucide-react';
import { createAttestion } from '../../eas/easCreate';

const VerificationModal = ({
  isOpen,
  onClose,
  // onSave,
  verificationSteps,
  reviewData,
}) => {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [attestation, setAttestation] = useState('');
  const [isAttestationComplete, setIsAttestationComplete] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState('');

  useEffect(() => {
    async function createReportAttestation() {
      const res = await createAttestion(reviewData);

      if (res && res.verified === true) {
        setAttestation(` Attestation ID:  ${res.data}`);
      } else {
        setAttestation(res.data);
      }
      setIsAttestationComplete(true);
    }

    if (isOpen) {
      createReportAttestation();
    }
  }, [isOpen]);

  useEffect(() => {
    async function createTransaction() {
      //transaction code
      setTransactionDetails('Transaction ID - abscdfdl');
      setIsVerificationComplete(true);
    }

    if (isOpen && isAttestationComplete) {
      createTransaction();
    }
  });

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
            <VerticalTimelineElement
              key={verificationSteps[0].title}
              date=""
              iconStyle={{
                background: isAttestationComplete ? '#10b981' : '#1a1a1a',
                color: 'white',
                boxShadow: isAttestationComplete
                  ? '0 0 10px #10b981, 0 0 20px #10b981'
                  : 'none',
              }}
              icon={
                isAttestationComplete ? (
                  <CheckCircle />
                ) : (
                  verificationSteps[0].icon
                )
              }
              contentStyle={{
                background: '#0f0f0f',
                color: 'white',
                boxShadow: 'none',
                border: isAttestationComplete
                  ? '1px solid #10b981'
                  : '1px solid #1a1a1a',
              }}
              contentArrowStyle={{ borderRight: '7px solid #0f0f0f' }}
            >
              <h3 className="vertical-timeline-element-title text-emerald-500">
                {verificationSteps[0].title}
              </h3>
              <p className="text-emerald-600 opacity-80">
                {verificationSteps[0].description}
              </p>

              {isAttestationComplete && <p>{attestation}</p>}
            </VerticalTimelineElement>

            <VerticalTimelineElement
              key={verificationSteps[1].title}
              date=""
              iconStyle={{
                background: isVerificationComplete ? '#10b981' : '#1a1a1a',
                color: 'white',
                boxShadow: isVerificationComplete
                  ? '0 0 10px #10b981, 0 0 20px #10b981'
                  : 'none',
              }}
              icon={
                isVerificationComplete ? (
                  <CheckCircle />
                ) : (
                  verificationSteps[1].icon
                )
              }
              contentStyle={{
                background: '#0f0f0f',
                color: 'white',
                boxShadow: 'none',
                border: isVerificationComplete
                  ? '1px solid #10b981'
                  : '1px solid #1a1a1a',
              }}
              contentArrowStyle={{ borderRight: '7px solid #0f0f0f' }}
            >
              <h3 className="vertical-timeline-element-title text-emerald-500">
                {verificationSteps[1].title}
              </h3>
              <p className="text-emerald-600 opacity-80">
                {verificationSteps[1].description}
              </p>

              {isVerificationComplete && <p>{transactionDetails}</p>}
            </VerticalTimelineElement>
          </VerticalTimeline>
        </div>

        {
          <div className="p-6 border-t border-emerald-900/30 flex justify-between items-center">
            {isAttestationComplete && (
              <div className="flex items-center space-x-4">
                <CheckCircle className="text-emerald-500 w-8 h-8" />
                <p className="text-white">Verification Complete</p>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={function(){onClose(attestation)}}
                className="flex items-center px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <XCircle className="mr-2 w-5 h-5 text-red-500" /> Close
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default VerificationModal;
