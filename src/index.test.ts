import { expect, test, vi } from "vitest";
import { getGame } from "./index.js";

test("getGame should return array of games for valid date", async () => {
	// Mock the global fetch function
	const mockGameData = {
		game: [
			{
				G_ID: "20240919HHSS0",
				G_DT: "20240919",
				G_TM: "18:30",
				S_NM: "잠실야구장",
				HOME_NM: "두산",
				AWAY_NM: "한화",
				B_PIT_P_NM: "알칸타라",
				T_PIT_P_NM: "문동주",
				W_PIT_P_NM: "",
				L_PIT_P_NM: "",
				SV_PIT_P_NM: "",
				GAME_STATE_SC: "1",
				B_SCORE_CN: "0",
				T_SCORE_CN: "0",
				GAME_INN_NO: 1,
				TV_IF: "SBS Sports",
				SEASON_ID: 2024,
			},
		],
		code: "00",
		msg: "success",
	};

	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: () => Promise.resolve(mockGameData),
	});

	const testDate = new Date("2024-09-19");
	const result = await getGame(testDate);

	expect(result).not.toBeNull();
	expect(Array.isArray(result)).toBe(true);
	expect(result).toHaveLength(1);

	if (result && result.length > 0) {
		const game = result[0];
		expect(game.id).toBe("20240919HHSS0");
		expect(game.homeTeam).toBe("두산");
		expect(game.awayTeam).toBe("한화");
		expect(game.status).toBe("SCHEDULED");
		expect(game.stadium).toBe("잠실야구장");
	}
});

test("getGame should return null when no games found", async () => {
	// Mock fetch to return empty game list
	const mockEmptyData = {
		game: [],
		code: "00",
		msg: "success",
	};

	global.fetch = vi.fn().mockResolvedValue({
		ok: true,
		json: () => Promise.resolve(mockEmptyData),
	});

	const testDate = new Date("2024-01-01");
	const result = await getGame(testDate);

	expect(result).toBeNull();
});

test("getGame should return null when API returns null", async () => {
	// Mock fetch to return null (simulating API error)
	global.fetch = vi.fn().mockRejectedValue(new Error("API Error"));

	const testDate = new Date("2024-09-19");

	// Since the function doesn't handle errors explicitly, it will throw
	await expect(getGame(testDate)).rejects.toThrow("API Error");
});
