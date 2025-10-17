export interface StoryPart {
  type: 'ai' | 'player';
  text: string;
}

export interface GameChoice {
  id: string;
  text: string;
}

// Dùng để thiết lập một vòng chơi mới
export interface GameSetupState {
  narrative: string;
  choices: GameChoice[];
}

// Dùng để chứa kết quả sau khi người chơi đã chọn
export interface GameResultState {
  narrative: string; // Kết quả của lựa chọn
  analysis: string; // Phân tích các lựa chọn khác
  historicalOutcome: string; // Sự kiện diễn ra trong lịch sử thực tế
}
