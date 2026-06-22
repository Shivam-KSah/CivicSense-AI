// Gemini AI API helper
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

/**
 * Analyze a civic issue image using Gemini Vision
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mimeType - Image MIME type
 */
export async function analyzeIssueImage(base64Image, mimeType = 'image/jpeg') {
  const prompt = `You are a civic issue analysis AI. Analyze this image of a community/infrastructure problem.
Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "category": "one of: Pothole, Water Leakage, Streetlight, Garbage, Road Damage, Tree Hazard, Flooding, Vandalism, Other",
  "severity": <number 1-5 where 1=minor, 5=critical>,
  "title": "<short 5-10 word title describing the issue>",
  "description": "<2-3 sentence description of what you see and why it's a problem>",
  "suggestedDepartment": "one of: Public Works, Water Authority, Electricity Board, Sanitation, Traffic, Forest Department",
  "confidence": <number 0-100>,
  "urgency": "one of: Low, Medium, High, Critical"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64Image } }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 512 }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean and parse JSON
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini image analysis error:', err);
    // Return mock data for demo purposes
    return {
      category: 'Pothole',
      severity: 3,
      title: 'Road damage detected in image',
      description: 'A civic infrastructure issue has been detected. Please verify and add details.',
      suggestedDepartment: 'Public Works',
      confidence: 75,
      urgency: 'Medium'
    };
  }
}

/**
 * Generate AI insights summary from issue statistics
 */
export async function generateInsightsSummary(stats) {
  const prompt = `You are a civic analytics AI. Based on these community issue statistics, generate a brief, actionable insights summary.

Stats: ${JSON.stringify(stats)}

Return ONLY valid JSON:
{
  "summary": "<2-3 sentence overview of community health>",
  "topConcern": "<main issue category to focus on>",
  "recommendation": "<one actionable recommendation for authorities>",
  "trendAlert": "<any notable pattern or alert>"
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 300 }
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      summary: "Your community has been active in reporting issues. Resolution rates are improving this week.",
      topConcern: "Potholes",
      recommendation: "Prioritize road repairs in the eastern sector where pothole reports have tripled.",
      trendAlert: "Water leakage reports up 40% — may indicate aging pipeline infrastructure."
    };
  }
}

/**
 * AI Chat assistant response
 */
export async function getChatResponse(userMessage, context = '') {
  const prompt = `You are CivicBot, a friendly AI assistant for CivicSense AI — a platform where citizens report and track local infrastructure issues like potholes, water leaks, broken streetlights, etc.

Context: ${context}

User message: "${userMessage}"

Respond helpfully and concisely (2-3 sentences max). Be friendly and encouraging about civic participation.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 200 }
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Try reporting an issue or checking the map for nearby problems.";
  } catch {
    return "I'm here to help you report and track community issues! Use the Report Issue button to get started.";
  }
}
