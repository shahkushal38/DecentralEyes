import React from 'react';
import { CdpAgentkit } from '@coinbase/cdp-agentkit-core';
import { CdpTool } from '@coinbase/cdp-langchain';

// Example schema handling: You must ensure that 'args' is a JS object
// matching your required fields. If you previously used zod schemas,
// you'll need to validate args separately now.

const CONTRACT_ADDRESS = '0x35731A7cb0e685FAe5279fcae3699aa85c1f5b2f';
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_toolId', type: 'uint256' },
      { internalType: 'uint256', name: '_score', type: 'uint256' },
      { internalType: 'string', name: '_comment', type: 'string' },
      { internalType: 'string', name: '_projectLink', type: 'string' },
      { internalType: 'string[]', name: '_reviewKeywords', type: 'string[]' },
      { internalType: 'string', name: '_nullifierId', type: 'string' },
      { internalType: 'bool', name: '_isAttested', type: 'bool' },
      { internalType: 'string', name: '_attestationId', type: 'string' },
    ],
    name: 'submitReview',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

async function submitReviewAction(agentkit, args) {
  const txResponse = await agentkit.invoke_contract({
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    method: 'submitReview',
    args: [
      args.toolId,
      args.score,
      args.comment,
      args.projectLink || '',
      args.reviewKeywords,
      args.nullifierId,
      args.isAttested,
      args.attestationId || '',
    ],
  });

  const txReceipt = await txResponse.wait();
  return `Review submitted successfully! Tx hash: ${txReceipt.transactionHash}`;
}

// Example usage in a React component
function SubmitReviewComponent({ agentkit, args }) {
  const [message, setMessage] = React.useState('');

  async function handleSubmit() {
    try {
      const result = await submitReviewAction(agentkit, args);
      setMessage(result);
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit review.');
    }
  }

  return (
    <div>
      <button onClick={handleSubmit}>Submit Review</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SubmitReviewComponent;
