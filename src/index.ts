// KBO Baseball Game Schema

export type GameStatus = 
	| 'SCHEDULED'  
	| 'IN_PROGRESS'  
	| 'COMPLETED'    
	| 'CANCELLED';  
	
export interface Game {
	id: string;
	date: Date;
	startTime: Date;
	endTime?: Date;
	
	// Stadium
	stadium: string;

	// Teams
	homeTeam: string;
	awayTeam: string;

	// Starting Pitchers
	homePitcher: string;
	awayPitcher: string;

	// Result Pitchers (only filled when game is done)
	winPitcher?: string;
	losePitcher?: string;
	savePitcher?: string;

	// Game Status
	status: GameStatus;
	
	// Final Score (only when game is done)
	finalScore?: {
		home: number;
		away: number;
	};
	
	// Current Score and Inning (when in progress)
	currentScore?: {
		home: number;
		away: number;
	};
	currentInning?: number;
	
	// Broadcast Information
	broadcastServices: string[];
	
	// Additional Info
	season: number;
	gameNumber: number; // Game number in the season

}

export const foo = (bar: string): string => {
	return bar;
};
