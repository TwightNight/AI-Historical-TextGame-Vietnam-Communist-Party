import { GoogleGenAI, Type } from "@google/genai";
import type { StoryPart, GameSetupState, GameResultState, GameChoice } from '../types';

const ai = new GoogleGenAI({ apiKey: "AIzaSyANZiFVmb_ZTBj4FEEbiYWDGoCLt9NUn54" });

const initialSystemInstruction = `Bạn là một AI quản trò cho một trò chơi văn bản tương tác về lịch sử Đảng Cộng sản Việt Nam. Phong cách của bạn là một nhà sử học hoặc chính ủy điềm tĩnh, khách quan.

Nhiệm vụ của bạn là tạo ra một kịch bản khởi đầu hấp dẫn, đặt người chơi vào một thời điểm lịch sử quan trọng.
1. Trình bày bối cảnh lịch sử chi tiết, các động lực và tình thế tiến thoái lưỡng nan.
2. Cung cấp cho người chơi 3 lựa chọn có ý nghĩa, đại diện cho các con đường chiến lược, chính sách hoặc quan điểm tư tưởng khác nhau.
3. PHẢI trả lời bằng định dạng JSON theo schema đã cung cấp.

Bắt đầu bằng cách tạo một kịch bản ngẫu nhiên vào bất kỳ thời điểm nào trong Lịch sử Đảng Cộng sản Việt Nam.`;

const responseSystemInstruction = `Bạn là một AI quản trò cho một trò chơi văn bản tương tác về lịch sử Đảng Cộng sản Việt Nam, đóng vai trò như một nhà sử học điềm tĩnh, khách quan. Người chơi vừa đưa ra một quyết định trong một kịch bản bạn đã tạo.

Nhiệm vụ của bạn là phân tích quyết định này trong một vòng chơi duy nhất.
1.  **Tường thuật kết quả:** Dựa trên lựa chọn của người chơi, hãy mô tả chi tiết diễn biến lịch sử tiếp theo. Phần tường thuật này phải logic, tham chiếu đến các sự kiện có thật (nếu có thể) và phân tích hệ quả trực tiếp của lựa chọn đó.
2.  **Phân tích các lựa chọn khác:** Sau phần tường thuật chính, hãy cung cấp một phân tích riêng biệt về những gì có khả năng xảy ra nếu người chơi đã chọn các phương án còn lại. Giải thích các kết quả giả định một cách hợp lý dựa trên bối cảnh lịch sử.
3.  **Cung cấp sự kiện lịch sử thật:** Cuối cùng, trong một mục riêng, hãy mô tả ngắn gọn quyết định hoặc sự kiện thực tế đã xảy ra trong lịch sử liên quan đến bối cảnh bạn đã đưa ra.
4.  **KHÔNG cung cấp lựa chọn mới.** Vòng chơi kết thúc ở đây.
5.  Bạn PHẢI trả lời bằng định dạng JSON theo schema đã cung cấp.`;


const initialResponseSchema = {
  type: Type.OBJECT,
  properties: {
    narrative: { type: Type.STRING },
    choices: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING }
        },
        required: ['id', 'text']
      }
    }
  },
  required: ['narrative', 'choices']
};

const finalResponseSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: {
            type: Type.STRING,
            description: "Phần tường thuật chi tiết về kết quả lựa chọn của người chơi."
        },
        analysis: {
            type: Type.STRING,
            description: "Phân tích chi tiết về các kết quả có thể xảy ra đối với các lựa chọn khác mà người chơi không chọn."
        },
        historicalOutcome: {
            type: Type.STRING,
            description: "Mô tả ngắn gọn về những gì đã thực sự xảy ra trong lịch sử liên quan đến kịch bản này."
        }
    },
    required: ['narrative', 'analysis', 'historicalOutcome']
};


function buildPromptForNextTurn(history: StoryPart[], newChoice: string, availableChoices: GameChoice[]): string {
  const lastAiNarrative = [...history].reverse().find(p => p.type === 'ai')?.text || "Bối cảnh không xác định.";
  const otherChoices = availableChoices.filter(c => c.text !== newChoice);

  let prompt = `Bối cảnh lịch sử được đưa ra là:\n"${lastAiNarrative}"\n\n`;
  prompt += `Trong bối cảnh đó, người chơi đã đưa ra quyết định: "${newChoice}".\n\n`;
  prompt += `Các lựa chọn khác mà người chơi đã có là:\n`;
  otherChoices.forEach(c => {
    prompt += `- ${c.text}\n`;
  });
  prompt += `\nDựa trên lựa chọn của người chơi, hãy phân tích hệ quả, các kịch bản của những lựa chọn còn lại và cho biết diễn biến thực tế trong lịch sử là gì.`;
  return prompt;
}

const parseJsonResponse = (jsonText: string) => {
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanedJsonText);
}

export const getNewGame = async (): Promise<GameSetupState> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: "Tạo một kịch bản trò chơi mới.",
      config: {
        systemInstruction: initialSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: initialResponseSchema,
        temperature: 0.8,
      },
    });
    const parsedResponse = parseJsonResponse(response.text);
    if (parsedResponse.narrative && Array.isArray(parsedResponse.choices)) {
      return parsedResponse as GameSetupState;
    } else {
      throw new Error("Phản hồi của AI để bắt đầu game có định dạng không hợp lệ.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API để bắt đầu game:", error);
    throw new Error("Không thể nhận phản hồi từ AI để bắt đầu game.");
  }
};


export const getGameUpdate = async (history: StoryPart[], choice: string, availableChoices: GameChoice[]): Promise<GameResultState> => {
  const model = "gemini-2.5-pro";
  const prompt = buildPromptForNextTurn(history, choice, availableChoices);
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: responseSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: finalResponseSchema,
        temperature: 0.7,
      },
    });

    const parsedResponse = parseJsonResponse(response.text);
    if (parsedResponse.narrative && parsedResponse.analysis && parsedResponse.historicalOutcome) {
      return parsedResponse as GameResultState;
    } else {
      throw new Error("Phản hồi của AI có định dạng không hợp lệ.");
    }

  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    throw new Error("Không thể nhận phản hồi từ AI.");
  }
};