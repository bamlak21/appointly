// Simple test for ai.ts
// Run with: npx ts-node test-ai.js

import { getAIResponse } from './lib/ai.ts';

async function testAI() {
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Say hello.' },
  ];

  try {
    const response = await getAIResponse(messages);
    console.log('AI Response:', response);
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAI();