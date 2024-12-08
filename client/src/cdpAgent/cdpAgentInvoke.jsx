import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { CdpAgentkit } from '@coinbase/cdp-agentkit-core';
import { CdpToolkit, CdpTool } from '@coinbase/cdp-langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

// Example schema for SubmitReviewInput (adjust as per your code)
const SubmitReviewInput = z.object({
  toolId: z.number(),
  score: z.number().min(1).max(10),
  comment: z.string(),
  projectLink: z.string().optional(),
  reviewKeywords: z.array(z.string()),
  nullifierId: z.string(),
  isAttested: z.boolean(),
  attestationId: z.string().optional(),
});

// Example action function for submitReview (adjust as per your code)
async function submitReviewAction(agentkit, args) {
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

// Create the submitReviewTool
const submitReviewTool = (agentkit) =>
  new CdpTool(
    {
      name: 'submit_contract_review',
      description:
        'Submits a review to the tool contract given the parameters.',
      argsSchema: SubmitReviewInput,
      func: (args) => submitReviewAction(agentkit, args),
    },
    agentkit
  );

function MyAgentComponent() {
  const [agent, setAgent] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function initializeAgent() {
      const WALLET_DATA_FILE = 'wallet_data.txt';

      // Initialize LLM
      const llm = new ChatOpenAI({
        model: 'gpt-4o-mini',
      });

      let walletDataStr = null;

      // Load existing wallet data if it exists
      if (fs.existsSync(WALLET_DATA_FILE)) {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, 'utf8');
      }

      const envNetworkId = process.env.NETWORK_ID || 'base-sepolia';

      const cdpConfig = {
        cdpWalletData: walletDataStr || undefined,
        networkId: envNetworkId,
      };

      // Initialize AgentKit
      const agentkit = await CdpAgentkit.configureWithWallet(cdpConfig);

      // Initialize the CDP Toolkit and get the default tools
      const cdpToolkit = new CdpToolkit(agentkit);
      const defaultTools = cdpToolkit.getTools();

      // Add our custom submitReview tool
      const allTools = [...defaultTools, submitReviewTool(agentkit)];

      // Store buffered conversation history in memory
      const memory = new MemorySaver();
      const agentConfig = {
        configurable: { thread_id: 'CDP AgentKit Chatbot Example!' },
      };

      // Create the agent
      const createdAgent = createReactAgent({
        llm,
        tools: allTools,
        checkpointSaver: memory,
        messageModifier:
          'You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. Use the submit_contract_review tool if the user wants to submit a review.',
      });

      // Save wallet data
      const exportedWallet = await agentkit.exportWallet();
      fs.writeFileSync(WALLET_DATA_FILE, exportedWallet);

      setAgent(createdAgent);
      setConfig(agentConfig);
    }

    initializeAgent();
  }, []);

  return (
    <div>
      {agent ? (
        <p>Agent is initialized and ready!</p>
      ) : (
        <p>Initializing agent...</p>
      )}
    </div>
  );
}

export default MyAgentComponent;
