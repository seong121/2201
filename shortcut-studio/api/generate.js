// api/generate.js — Vercel Serverless Function
// 환경변수 ANTHROPIC_API_KEY 를 Vercel 대시보드에서 설정하세요.

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { topic, prompt } = req.body ?? {};
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const systemPrompt = `당신은 숏폼 영상 스크립트 전문 작가입니다. 주어진 주제로 30~60초 분량의 나레이션 스크립트를 작성하세요.
규칙:
- 한국어로 작성
- 짧고 임팩트 있는 문장으로 구성
- 시청자를 끌어당기는 강렬한 오프닝 문장
- 핵심 내용 2~3가지 전달
- 마무리 CTA (구독, 좋아요 유도)
- 지문·설명·번호 없이 스크립트 본문만 출력
- 총 100~160자 내외`;

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
        system: systemPrompt,
        messages: [{ role: 'user', content: `주제: ${topic || '일반'}\n\n요청: ${prompt}` }],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: err });
    }

    const data = await upstream.json();
    const script = data.content.map(c => c.text || '').join('').trim();
    return res.status(200).json({ script });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
