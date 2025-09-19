#!/usr/bin/env node

// KBO Game API 테스트 예제
import { getGame } from "./dist/index.js";

async function testKboGame() {
  console.log("🏟️  KBO Game API 테스트 시작...\n");

  try {
    // 오늘 날짜로 게임 조회
    const today = new Date();
    console.log(`📅 ${today.toLocaleDateString("ko-KR")} 경기 조회 중...`);

    const games = await getGame(today);

    if (!games || games.length === 0) {
      console.log("❌ 오늘 경기가 없습니다.");

      // 어제 날짜로 시도
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      console.log(
        `\n📅 ${yesterday.toLocaleDateString("ko-KR")} 경기 조회 중...`
      );

      const yesterdayGames = await getGame(yesterday);
      if (!yesterdayGames || yesterdayGames.length === 0) {
        console.log("❌ 어제도 경기가 없습니다.");
        return;
      }

      console.log(`✅ ${yesterdayGames.length}개의 경기를 찾았습니다!\n`);
      displayGames(yesterdayGames);
    } else {
      console.log(`✅ ${games.length}개의 경기를 찾았습니다!\n`);
      displayGames(games);
    }
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
  }
}

function displayGames(games) {
  games.forEach((game, index) => {
    console.log(`🏟️  경기 ${index + 1}`);
    console.log(`   🏠 홈팀: ${game.homeTeam}`);
    console.log(`   🏃 어웨이팀: ${game.awayTeam}`);
    console.log(`   🏟️  구장: ${game.stadium}`);
    console.log(`   ⏰ 시간: ${game.startTime}`);
    console.log(`   📊 스코어: ${game.score.away} - ${game.score.home}`);
    console.log(`   📺 상태: ${game.status}`);
    if (game.currentInning) {
      console.log(`   🥎 현재 이닝: ${game.currentInning}`);
    }
    console.log("");
  });
}

// 실행
testKboGame().catch(console.error);
