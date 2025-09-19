# KBO 경기 정보 라이브러리

KBO 공식 사이트에서 특정 날짜의 야구 경기 정보를 가져올 수 있는 npm 라이브러리입니다.

## 📋 개요

이 라이브러리는 KBO 공식 웹사이트에서 경기 결과를 손쉽게 조회할 수 있도록 도와줍니다.

## 🛠️ 기술 스택

- **언어**: TypeScript
- **패키지 매니저**: pnpm
- **테스트**: Vitest
- **린터**: Biome
- **사용한 AI** : Github Copilow with Claude Sonnet 4.0

## 📦 설치

```bash
npm install kbo-game
# 또는
pnpm add kbo-game
# 또는
yarn add kbo-game
```

## 🚀 사용법

```typescript
import { getGameInfo } from "kbo-game";

// 특정 날짜의 경기 정보 가져오기
const gameInfo = await getGameInfo("2024-09-19");
console.log(gameInfo);
```

## 📊 제공 기능

- 특정 날짜의 경기 일정 조회
- 경기 결과 정보

## 🔧 개발

```bash
# 의존성 설치
pnpm install

# 빌드
pnpm run build

```

## 📝 라이선스

MIT
