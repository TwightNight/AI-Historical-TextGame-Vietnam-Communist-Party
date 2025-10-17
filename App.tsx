import React, { useState, useEffect, useRef } from 'react';
import StorySegment from './components/StorySegment';
import ChoiceButton from './components/ChoiceButton';
import LoadingSpinner from './components/LoadingSpinner';
import { getNewGame, getGameUpdate } from './services/geminiService';
import type { StoryPart, GameChoice, GameSetupState, GameResultState } from './types';

// Book Icon SVG
const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0">
      <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.5a.75.75 0 00.5.707c1.728.348 3.449.555 5.25.555 1.773 0 3.493-.205 5.216-.552a.75.75 0 00.534-.709V5.25a.75.75 0 00-.534-.709A9.735 9.735 0 0012 3.75c-.563 0-1.123.033-1.68.097a.75.75 0 01-.72-.714z" />
      <path d="M12.75 5.66v12.585a8.217 8.217 0 01-1.5 0V4.533c.504-.047 1.004-.08 1.5-.08.496 0 .996.033 1.496.097a.75.75 0 01.707.721v12.585a8.217 8.217 0 01-1.5 0z" />
    </svg>
);


function App() {
  const [storyHistory, setStoryHistory] = useState<StoryPart[]>([]);
  const [currentChoices, setCurrentChoices] = useState<GameChoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [historicalOutcome, setHistoricalOutcome] = useState<string | null>(null);
  const storyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [storyHistory, isLoading, analysis, historicalOutcome]);

  const startNewGame = async () => {
    setIsLoading(true);
    setStoryHistory([]);
    setCurrentChoices([]);
    setGameEnded(false);
    setAnalysis(null);
    setHistoricalOutcome(null);
    try {
      const initialState: GameSetupState = await getNewGame();
      setStoryHistory([{ type: 'ai', text: initialState.narrative }]);
      setCurrentChoices(initialState.choices);
    } catch (error) {
      console.error("Failed to start a new game:", error);
      setStoryHistory([{ type: 'ai', text: 'Đã có lỗi xảy ra khi bắt đầu trò chơi. Vui lòng thử lại.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleChoice = async (choice: GameChoice) => {
    if (isLoading || gameEnded) return;

    const newHistory: StoryPart[] = [...storyHistory, { type: 'player', text: choice.text }];
    setStoryHistory(newHistory);

    const previousChoices = currentChoices;
    setCurrentChoices([]);
    setIsLoading(true);

    try {
      const result: GameResultState = await getGameUpdate(newHistory, choice.text, previousChoices);
      setStoryHistory(prev => [...prev, { type: 'ai', text: result.narrative }]);
      setAnalysis(result.analysis);
      setHistoricalOutcome(result.historicalOutcome);
      setGameEnded(true);
    } catch (error) {
      console.error("Failed to get game update:", error);
      setStoryHistory(prev => [...prev, { type: 'ai', text: 'Đã có lỗi xảy ra khi xử lý lựa chọn của bạn. Vui lòng bắt đầu lại.' }]);
      setGameEnded(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <main className="container mx-auto max-w-3xl p-4 md:p-8">
        <header className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-tight">Dòng Chảy Lịch Sử</h1>
            <p className="text-gray-400 mt-2 text-lg">Một trải nghiệm tương tác về Lịch sử Đảng Cộng sản Việt Nam</p>
        </header>

        <div className="bg-gray-800/40 p-4 md:p-6 rounded-xl shadow-2xl border border-gray-700/50">
          <div id="story-container" className="mb-6 space-y-4">
            {storyHistory.map((part, index) => (
              <StorySegment key={index} type={part.type} text={part.text} />
            ))}
             <div ref={storyEndRef} />
          </div>

          {isLoading && (
            <div className="flex justify-center p-4">
              <LoadingSpinner />
            </div>
          )}
          
          <div className="space-y-6">
            {!isLoading && analysis && (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 animate-fade-in">
                <h2 className="text-xl font-bold text-red-400 mb-3">Phân Tích Tình Huống</h2>
                <p className="whitespace-pre-wrap text-gray-300">{analysis}</p>
              </div>
            )}
            
            {!isLoading && historicalOutcome && (
                <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg animate-fade-in">
                    <div className="flex items-center mb-3">
                        <HistoryIcon />
                        <h2 className="text-xl font-bold text-yellow-400">Diễn Biến Lịch Sử Thực Tế</h2>
                    </div>
                    <p className="whitespace-pre-wrap text-yellow-200 font-serif leading-relaxed">{historicalOutcome}</p>
                </div>
            )}
          </div>


          {!isLoading && !gameEnded && (
            <div id="choices-container" className="space-y-3 animate-fade-in mt-6">
              {currentChoices.map((choice) => (
                <ChoiceButton
                  key={choice.id}
                  text={choice.text}
                  onClick={() => handleChoice(choice)}
                />
              ))}
            </div>
          )}
          
          {!isLoading && gameEnded && (
             <div className="mt-8 text-center animate-fade-in">
                <button
                    onClick={startNewGame}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                >
                    Chơi Lại Kịch Bản Mới
                </button>
             </div>
          )}
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Sử dụng công nghệ Gemini của Google.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
