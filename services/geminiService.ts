import { GoogleGenAI, Type } from "@google/genai";
import type { StoryPart, GameSetupState, GameResultState, GameChoice } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const initialSystemInstruction = `Bạn là một AI quản trò cho một trò chơi văn bản tương tác về lịch sử Đảng Cộng sản Việt Nam. Phong cách của bạn là một nhà sử học hoặc chính ủy điềm tĩnh, khách quan.

Nhiệm vụ của bạn là phát triển một kịch bản hấp dẫn từ bối cảnh được cung cấp.
1. Dựa trên bối cảnh đã cho, hãy viết một đoạn tường thuật chi tiết, làm nổi bật các động lực và tình thế tiến thoái lưỡng nan.
2. Từ tình thế đó, hãy tạo ra 3 lựa chọn có ý nghĩa cho người chơi, đại diện cho các con đường chiến lược, chính sách hoặc quan điểm tư tưởng khác nhau.
3. PHẢI trả lời bằng định dạng JSON theo schema đã cung cấp.`;

const randomScenarioSystemInstruction = `Bạn là một AI quản trò cho một trò chơi văn bản tương tác về lịch sử Đảng Cộng sản Việt Nam. Phong cách của bạn là một nhà sử học hoặc chính ủy điềm tĩnh, khách quan.

Nhiệm vụ của bạn là TỰ MÌNH SÁNG TẠO một kịch bản hoàn toàn mới và ngẫu nhiên.
1.  Chọn một thời điểm hoặc sự kiện có thật nhưng ít được biết đến, hoặc một tình huống giả định hợp lý trong lịch sử của Đảng.
2.  Viết một đoạn tường thuật chi tiết, đặt người chơi vào một tình thế tiến thoái lưỡng nan, đầy thách thức.
3.  Tạo ra 3 lựa chọn có ý nghĩa, đại diện cho các con đường chiến lược, chính sách hoặc tư tưởng khác nhau.
4.  PHẢI trả lời bằng định dạng JSON theo schema đã cung cấp.`;

const responseSystemInstruction = `Bạn là một AI quản trò cho một trò chơi văn bản tương tác về lịch sử Đảng Cộng sản Việt Nam, đóng vai trò như một nhà sử học điềm tĩnh, khách quan. Người chơi vừa đưa ra một quyết định trong một kịch bản bạn đã tạo.

Nhiệm vụ của bạn là phân tích quyết định này trong một vòng chơi duy nhất.
1.  **Tường thuật kết quả:** Dựa trên lựa chọn của người chơi, hãy mô tả chi tiết diễn biến lịch sử tiếp theo. Phần tường thuật này phải logic, tham chiếu đến các sự kiện có thật (nếu có thể) và phân tích hệ quả trực tiếp của lựa chọn đó.
2.  **Phân tích các lựa chọn khác:** Sau phần tường thuật chính, hãy cung cấp một phân tích riêng biệt về những gì có khả năng xảy ra nếu người chơi đã chọn các phương án còn lại. Giải thích các kết quả giả định một cách hợp lý dựa trên bối cảnh lịch sử.
3.  **Cung cấp sự kiện lịch sử thật:** Trong một mục riêng, hãy mô tả ngắn gọn quyết định hoặc sự kiện thực tế đã xảy ra trong lịch sử liên quan đến bối cảnh bạn đã đưa ra.
4.  **Dẫn nguồn tham khảo:** Cung cấp một danh sách (tối thiểu 2) các nguồn tài liệu hoặc bài viết uy tín (ví dụ: từ các trang báo chính thống, trang web của Đảng, chính phủ, hoặc các trang nghiên cứu lịch sử) liên quan đến sự kiện lịch sử này. Mỗi nguồn phải bao gồm tiêu đề và URL hợp lệ.
5.  **KHÔNG cung cấp lựa chọn mới.** Vòng chơi kết thúc ở đây.
6.  Bạn PHẢI trả lời bằng định dạng JSON theo schema đã cung cấp.`;


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
        },
        sources: {
            type: Type.ARRAY,
            description: "Danh sách các nguồn tài liệu hoặc bài viết liên quan, mỗi nguồn có tiêu đề và URL.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "Tiêu đề của nguồn tài liệu."
                    },
                    url: {
                        type: Type.STRING,
                        description: "URL hợp lệ của nguồn tài liệu."
                    }
                },
                required: ['title', 'url']
            }
        }
    },
    required: ['narrative', 'analysis', 'historicalOutcome', 'sources']
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

export const parseJsonResponse = (jsonText: string): any => {
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '').trim();
    try {
        return JSON.parse(cleanedJsonText);
    } catch (e) {
        console.error("Failed to parse JSON:", cleanedJsonText);
        throw new Error("Invalid JSON response from AI.");
    }
}

export const getScenarioFromPrompt = async (prompt: string): Promise<GameSetupState> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
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

export const generateRandomScenario = async (): Promise<GameSetupState> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: "Tạo một kịch bản lịch sử mới và ngẫu nhiên về Đảng Cộng sản Việt Nam.",
      config: {
        systemInstruction: randomScenarioSystemInstruction,
        responseMimeType: "application/json",
        responseSchema: initialResponseSchema,
        temperature: 0.9, 
      },
    });
    const parsedResponse = parseJsonResponse(response.text);
    if (parsedResponse.narrative && Array.isArray(parsedResponse.choices)) {
      return parsedResponse as GameSetupState;
    } else {
      throw new Error("Phản hồi của AI để tạo kịch bản ngẫu nhiên có định dạng không hợp lệ.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API để tạo kịch bản ngẫu nhiên:", error);
    throw new Error("Không thể nhận phản hồi từ AI để tạo kịch bản ngẫu nhiên.");
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