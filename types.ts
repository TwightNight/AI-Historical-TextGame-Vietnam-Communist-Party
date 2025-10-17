
export interface StoryPart {
  type: 'ai' | 'player';
  text: string;
}

export interface GameChoice {
  id: string;
  text: string;
}

export interface Source {
  title: string;
  url: string;
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
  sources: Source[]; // Nguồn tham khảo liên quan
}
