# ShortCut Studio — Vercel 배포 가이드

## 📁 폴더 구조

```
shortcut-studio/
├── api/
│   └── generate.js      ← Serverless Function (API 키 보호)
├── public/
│   └── index.html       ← 메인 앱
├── vercel.json          ← 라우팅 설정
└── README.md
```

---

## 🚀 Vercel 배포 방법

### 1단계 — GitHub에 올리기
```bash
git init
git add .
git commit -m "ShortCut Studio 초기 배포"
git remote add origin https://github.com/YOUR_NAME/shortcut-studio.git
git push -u origin main
```

### 2단계 — Vercel 연결
1. [vercel.com](https://vercel.com) 접속 → **Add New Project**
2. GitHub 저장소 선택 (`shortcut-studio`)
3. **Root Directory**: 비워두기 (기본값)
4. **Build Command**: 비워두기
5. **Output Directory**: `public`
6. **Deploy** 클릭

### 3단계 — 환경변수 설정 (중요!)
Vercel 대시보드 → **Settings → Environment Variables** 에서:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |

저장 후 **Redeploy** 하면 완료!

---

## ⚠️ 왜 이 구조가 필요한가?

| 방식 | 문제 |
|------|------|
| 브라우저에서 직접 `api.anthropic.com` 호출 | **CORS 차단** — Anthropic이 브라우저 직접 요청을 막음 |
| HTML에 API 키 하드코딩 | **보안 위험** — 키가 외부에 노출됨 |
| `/api/generate.js` 경유 (현재 방식) | ✅ **서버에서만 키 사용**, CORS 문제 없음 |

---

## 🔧 로컬 테스트

```bash
npm i -g vercel
vercel dev
```

`.env` 파일 생성:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```
