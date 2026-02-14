
import { GoogleGenAI } from "@google/genai";
import { ScriptConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAdvancedLua = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a GameGuardian Lua Script Expert. 
      Generate a professional and clean Lua script for GameGuardian based on this user request: "${prompt}".
      
      Requirements:
      1. Include a beautiful menu using gg.choice.
      2. Use comments to explain each step for beginners.
      3. Use gg.toast for notifications.
      4. Ensure proper error handling (e.g., checking if results were found).
      5. Add a simple credits section in the script.
      
      ONLY return the Lua code, no extra text.`,
    });
    
    return response.text || '-- Erro ao gerar script';
  } catch (error) {
    console.error("Gemini Error:", error);
    return `-- Erro: ${error instanceof Error ? error.message : 'Falha na conexão'}`;
  }
};

export const formatStandardScript = (config: ScriptConfig): string => {
  const featuresLua = config.features.map(f => `
function feature_${f.id.replace(/-/g, '_')}()
  gg.clearResults()
  gg.searchNumber("${f.search}", ${f.type})
  local count = gg.getResultCount()
  if count > 0 then
    gg.getResults(count)
    gg.editAll("${f.replace}", ${f.type})
    gg.toast("${f.name} Ativado!")
  else
    gg.toast("${f.name} não encontrado.")
  end
end`).join('\n');

  const menuItems = config.features.map(f => `"${f.name}"`).join(', ');
  
  return `
-- Script gerado por GG Script Master
-- Autor: ${config.author}
-- Versão: ${config.version}

function Main()
  menu = gg.choice({
    ${menuItems},
    "Sair"
  }, nil, "${config.title}")

  if menu == nil then else
    ${config.features.map((f, i) => `if menu == ${i + 1} then feature_${f.id.replace(/-/g, '_')}() end`).join('\n    ')}
    if menu == ${config.features.length + 1} then os.exit() end
  end
  gg.setVisible(false)
end

${featuresLua}

while true do
  if gg.isVisible(true) then
    gg.setVisible(false)
    Main()
  end
  gg.sleep(100)
end
  `.trim();
};
