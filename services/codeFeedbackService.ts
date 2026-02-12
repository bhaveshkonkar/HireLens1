// Enhanced Code Feedback Service for Comprehensive Code Analysis
// Provides detailed pass/fail evaluation with actionable feedback

import { GoogleGenAI, Type } from "@google/genai";

export interface CodeFeedback {
  // Overall Assessment
  isCorrect: boolean;
  overallScore: number; // 0-100
  verdict: 'PASS' | 'FAIL' | 'PARTIAL';
  
  // Core Analysis
  algorithmType: string;
  timeComplexity: string;
  spaceComplexity: string;
  
  // Detailed Feedback
  correctnessAnalysis: string;
  efficiencyAnalysis: string;
  readabilityAnalysis: string;
  bestPracticesAnalysis: string;
  
  // Issues and Fixes
  issuesFound: Array<{
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
    issue: string;
    explanation: string;
    suggestedFix: string;
  }>;
  
  // Strengths
  strengths: string[];
  
  // Recommendations
  improvements: string[];
  bestPractices: string[];
  
  // Steps for visualization
  executionSteps: string[];
}

export async function generateComprehensiveCodeFeedback(code: string, question?: string): Promise<CodeFeedback> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const questionContext = question ? `\n\nCONTEXT: The candidate was asked: "${question}"\nAnalyze the code SPECIFICALLY in the context of solving this problem.` : '';

  const prompt = `You are an expert code reviewer and technical mentor. Analyze this code comprehensively:

\`\`\`javascript
${code}
\`\`\`${questionContext}

Provide DETAILED feedback that covers:
1. Is the code functionally CORRECT? (Yes/No/Partially)
2. What algorithm/pattern does it implement?
3. Code quality assessment (correctness, efficiency, readability, best practices)
4. Specific issues if code has bugs or problems
5. Strengths of the code
6. Concrete improvement suggestions

Return the analysis as structured JSON with all required fields populated.

IMPORTANT SCORING RULES:
- isCorrect: true ONLY if code has NO logical errors and CORRECTLY implements intended algorithm
- overallScore: 0-100 based on correctness (50% weight), efficiency (25%), code quality (25%)
- verdict: 'PASS' if score >= 70 AND isCorrect, 'FAIL' if score < 50, else 'PARTIAL'

For issuesFound array:
- CRITICAL: Code won't work or produces wrong results
- MAJOR: Significant efficiency problem or anti-pattern  
- MINOR: Code style or minor optimization issue

For CORRECT code:
- Provide detailed praise in correctnessAnalysis
- List why it's correct and well-structured
- issuesFound should be empty or minimal (only style/optimization)
- strengths should highlight good patterns used`;

  try {
    const response = await ai.models.generateContent({
  	      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            overallScore: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            algorithmType: { type: Type.STRING },
            timeComplexity: { type: Type.STRING },
            spaceComplexity: { type: Type.STRING },
            
            correctnessAnalysis: { type: Type.STRING },
            efficiencyAnalysis: { type: Type.STRING },
            readabilityAnalysis: { type: Type.STRING },
            bestPracticesAnalysis: { type: Type.STRING },
            
            issuesFound: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING },
                  issue: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  suggestedFix: { type: Type.STRING }
                }
              }
            },
            
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            
            bestPractices: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            
            executionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'isCorrect', 'overallScore', 'verdict', 'algorithmType',
            'timeComplexity', 'spaceComplexity', 'correctnessAnalysis',
            'efficiencyAnalysis', 'readabilityAnalysis', 'bestPracticesAnalysis',
            'issuesFound', 'strengths', 'improvements', 'bestPractices', 'executionSteps'
          ]
        }
      }
    });

    const feedback = JSON.parse(response.text.trim()) as CodeFeedback;
    return feedback;
  } catch (error) {
    console.error('Code feedback generation error:', error);
    throw error;
  }
}
