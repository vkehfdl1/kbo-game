// KBO Baseball Game Schema

export type GameStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Game {
  id: string;
  date: Date;
  startTime: string; // e.g., "18:30"

  // Stadium
  stadium: string;

  // Teams
  homeTeam: string;
  awayTeam: string;

  // Starting Pitchers
  homePitcher?: string;
  awayPitcher?: string;

  // Result Pitchers (only filled when game is done)
  winPitcher?: string;
  losePitcher?: string;
  savePitcher?: string;

  // Game Status
  status: GameStatus;

  // Final Score (only when game is done)
  score?: {
    home: number;
    away: number;
  };
  currentInning?: number;

  // Broadcast Information
  broadcastServices: string[];

  // Additional Info
  season: number;
}

export const getGame = async (date: Date): Promise<Game[] | null> => {
	//date conversion to YYYYMMDD
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
	const dd = String(date.getDate()).padStart(2, '0');
	const formattedDate = `${yyyy}${mm}${dd}`;

	//fetch game data from KBO API
	const gameData = await getKboGamesForDate(formattedDate);
	if (!gameData) {
		return null;
	}

	const games = gameData.game;
	if (games.length === 0) {
		return null; // No games found for the date
	}

	//map KBO game data to Game schema
	const parsedGames: Game[] = games.map(parseKboGameData);
	return parsedGames;
}

const parseKboGameData = (data: KboGameData): Game => {
	return {
		id: data.G_ID,
		date: new Date(data.G_DT.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
		startTime: data.G_TM,
		stadium: data.S_NM,
		homeTeam: data.HOME_NM,
		awayTeam: data.AWAY_NM,
		homePitcher: data.B_PIT_P_NM,
		awayPitcher: data.T_PIT_P_NM,
		winPitcher: data.W_PIT_P_NM,
		losePitcher: data.L_PIT_P_NM,
		savePitcher: data.SV_PIT_P_NM,
		status: mapGameState(data),
		score:{
			home: Number.parseInt(data.B_SCORE_CN),
			away: Number.parseInt(data.T_SCORE_CN)
		},
		currentInning: data.GAME_INN_NO,
		broadcastServices: data.TV_IF ? data.TV_IF.split(',') : [],
		season: data.SEASON_ID,
	};
}

const mapGameState = (data: KboGameData): GameStatus => {
	const gameStatus = data.GAME_STATE_SC;

	switch (gameStatus) {
		case "1":
			return "SCHEDULED";
		case "2":
			return "IN_PROGRESS";
		case "3":
			return "COMPLETED";
		case "4":
			return "CANCELLED";
		default:
			return "SCHEDULED"; // Default to scheduled if unknown
	}
}

// KBO API Types
interface KboGameListParams {
  leId: number; // League ID (1 for KBO)
  srId: string; // Series IDs (e.g., "0,1,3,4,5,6,7,8,9")
  date: string; // Date in YYYYMMDD format
}

interface KboGameData {
  LE_ID: number;
  SR_ID: number;
  SEASON_ID: number;
  G_DT: string;
  G_DT_TXT: string;
  G_ID: string;
  HEADER_NO: number;
  G_TM: string;
  S_NM: string;
  AWAY_ID: string;
  HOME_ID: string;
  AWAY_NM: string;
  HOME_NM: string;
  T_PIT_P_ID: number;
  T_PIT_P_NM: string;
  B_PIT_P_ID: number;
  B_PIT_P_NM: string;
  W_PIT_P_ID: number | null;
  W_PIT_P_NM: string;
  SV_PIT_P_ID: number | null;
  SV_PIT_P_NM: string;
  L_PIT_P_ID: number | null;
  L_PIT_P_NM: string;
  T_D_PIT_P_ID: number | null;
  T_D_PIT_P_NM: string;
  B_D_PIT_P_ID: number | null;
  B_D_PIT_P_NM: string;
  GAME_STATE_SC: string;
  CANCEL_SC_ID: string;
  CANCEL_SC_NM: string;
  GAME_INN_NO: number;
  GAME_TB_SC: string;
  GAME_TB_SC_NM: string;
  GAME_RESULT_CK: number;
  T_SCORE_CN: string;
  B_SCORE_CN: string;
  TV_IF: string;
  VS_GAME_CN: number;
  STRIKE_CN: number;
  BALL_CN: number;
  OUT_CN: number;
  B1_BAT_ORDER_NO: number;
  B2_BAT_ORDER_NO: number;
  B3_BAT_ORDER_NO: number;
  T_P_ID: number;
  T_P_NM: string;
  B_P_ID: number;
  B_P_NM: string;
  GAME_SC_ID: number;
  GAME_SC_NM: string;
  IE_ENTRY_CK: number;
  START_PIT_CK: number;
  T_GROUP_SC: string | null;
  T_RANK_NO: number;
  B_GROUP_SC: string | null;
  B_RANK_NO: number;
  ROUND_SC: string | null;
  DETAIL_SC: string | null;
  GAME_NO: string | null;
  LINEUP_CK: number;
  VOD_CK: number;
  KBOT_SE: number;
  SCORE_CK: string;
  CHECK_SWING_CK: boolean;
}

interface KboGameListResponse {
  game: KboGameData[];
  code: string;
  msg: string;
}

/**
 * Fetches KBO game list data using POST request
 * @param params - Parameters for the KBO game list API
 * @returns Promise containing the game list data
 */
const getKboGameList = async (
  params: KboGameListParams
): Promise<KboGameListResponse> => {
  const url = "https://www.koreabaseball.com/ws/Main.asmx/GetKboGameList";

  // Prepare form data
  const formData = new URLSearchParams();
  formData.append("leId", params.leId.toString());
  formData.append("srId", params.srId);
  formData.append("date", params.date);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        Origin: "https://www.koreabaseball.com",
        Referer: "https://www.koreabaseball.com/",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching KBO game list:", error);
    throw error;
  }
};

/**
 * Helper function to get KBO games for a specific date
 * @param date - Date string in YYYYMMDD format
 * @returns Promise containing the game list data
 */
const getKboGamesForDate = async (
  date: string
): Promise<KboGameListResponse> => {
  return getKboGameList({
    leId: 1, // KBO League ID
    srId: "0,1,3,4,5,6,7,8,9", // All series IDs
    date: date,
  });
};
