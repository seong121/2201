// api/generate.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { topic, prompt } = req.body ?? {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel Environment Variables' });

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `당신은 숏폼 영상 스크립트 전문 작가입니다.
규칙: 한국어, 짧고 임팩트 있는 문장, 강렬한 오프닝, 핵심 2~3가지, 마무리 CTA.
지문·설명 없이 스크립트 본문만 100~160자로 출력.`,
        messages: [{ role: 'user', content: `주제: ${topic || '일반'}\n요청: ${prompt}` }],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return res.status(upstream.status).json({ error: errText });
    }

    const data = await upstream.json();
    const script = data.content.map(c => c.text || '').join('').trim();
    return res.status(200).json({ script });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
