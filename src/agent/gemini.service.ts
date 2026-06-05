import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

interface PerguntarBody {
  prompt: string;
}

interface GeminiError {
  status?: number;
  message?: string;
}

type ReceitaEstruturada = {
  titulo?: string;
  resumo?: string;
  ingredientes?: string[];
  passo_a_passo?: string[];
  tempo_estimado_min?: number;
  dificuldade?: "fácil" | "média" | "difícil" | string;
};

const router = Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = "gemini-2.5-flash";
const MAX_PROMPT_CHARS = 8000; // (~24k caracteres) por prommpt.
const RETRIES = 3; // número de tentativas em caso de erro 503 ou 429 (instabilidade ou limite de taxa) do Gemini
const RETRY_DELAY_MS = 2000; // 2 segundos de atraso entre tentativas
const TIMEOUT_MS = 12000; // timeout de 12 segundos para a resposta do Gemini, para 
// evitar ficar esperando indefinidamente em casos de lentidão ou falha na resposta

/**Prompt de instrução para agente Gemini.
 *
 * O objetivo é guiar o modelo a responder sempre com um JSON estruturado,
 * mesmo quando a pergunta for mais aberta
 *
 * (ex: "me dê dicas para cozinhar arroz").
 *
 * Assim, garantimos uma resposta consistente e fácil de processar,
 * independentemente do tipo de pergunta do usuário.
 */
const systemPrompt =
  "Você é um agente de culinária. Responda em português do Brasil. " +
  "Se o usuário pedir uma receita, sempre retorne uma estrutura JSON com campos úteis. " +
  "Se a pergunta for apenas dicas, ainda assim retorne JSON com 'resumo' e outros campos apropriados. " +
  "Nunca retorne texto fora do JSON. Você deve responder SOMENTE com um JSON válido.";


/**buildUserText 
 * Constrói o texto de entrada para o modelo Gemini,
 * combinando o prompt do sistema (instruções) com a pergunta do usuário.
 *
 * O objetivo é garantir que o modelo entenda claramente o contexto e as expectativas de resposta,
 * aumentando a probabilidade de obter um JSON estruturado e consistente,
 * mesmo para perguntas mais abertas.
 */
function buildUserText(prompt: string) {
  return (
    `${systemPrompt}\n\n` +
    `Pergunta do usuário: ${prompt}\n\n` +
    "Retorne exatamente um JSON válido no formato:\n" +
    JSON.stringify({
      titulo: "string",
      resumo: "string",
      ingredientes: ["string"],
      passo_a_passo: ["string"],
      tempo_estimado_min: 0,
      dificuldade: "fácil|média|difícil",
    })
  );
}


/**safeParseJson
 * 
 * Tenta analisar o texto como JSON e retornar um objeto estruturado.
 * 
 * Se a análise falhar (por exemplo, se o modelo retornar texto que não é JSON válido),
 * a função captura o erro e retorna null, permitindo que o serviço lide graciosamente
 * com respostas inesperadas do modelo, sem quebrar a aplicação.
 */
function safeParseJson(text: string): ReceitaEstruturada | null {
  try {
    return JSON.parse(text) as ReceitaEstruturada;
  } catch {
    return null;
  }
}


/**generateWithRetry
 * Tenta gerar uma resposta do modelo Gemini, com lógica de retry em caso de erros temporários (503 ou 429).
 * 
 * O objetivo é aumentar a resiliência do serviço, lidando com instabilidades ou limites de taxa do Gemini,
 * sem falhar imediatamente para o usuário. A função fará até `RETRIES` tentativas, com um atraso entre elas,
 * e um timeout para cada tentativa, garantindo que o serviço permaneça responsivo mesmo em condições adversas.
 */
async function generateWithRetry(prompt: string) {
  let tentativas = RETRIES;
  let lastError: unknown;

  while (tentativas > 0) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // OBS: tipos do SDK podem variar; para evitar erro de tipagem (Part não tem `type`),
      // passamos a string completa diretamente em `contents`.
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [buildUserText(prompt)],
        // @ts-expect-error - dependendo da versão do SDK, pode haver suporte/parâmetros diferentes
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return response;
    } catch (err: unknown) {
      clearTimeout(timeout);
      lastError = err;

      const error = err as GeminiError;
      const status = error?.status;

      const shouldRetry = status === 503 || status === 429;
      if (!shouldRetry) throw err;

      tentativas--;
      if (tentativas > 0) {
        console.log(
          `Gemini instável (${status}). Tentando novamente... Restam ${tentativas} tentativas.`,
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw lastError;
}

router.post(
  "/perguntar",
  async (req: Request<{}, {}, PerguntarBody>, res: Response): Promise<void> => {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt obrigatório." });
      return;
    }

    if (prompt.length > MAX_PROMPT_CHARS) {
      res.status(413).json({
        error: `Prompt muito grande. Máximo permitido: ${MAX_PROMPT_CHARS} caracteres.`,
      });
      return;
    }

    try {
      const response = await generateWithRetry(prompt);
      const text = response.text ?? "";

      const parsed = safeParseJson(text);

      if (parsed) {
        res.json({
          respostaJson: parsed,
        });
      } else {
        res.json({
          respostaTexto: text,
        });
      }
    } catch (err: unknown) {
      const error = err as GeminiError;
      res.status(error.status || 500).json({
        error: error.message || "Erro interno",
      });
    }
  },
);

export default router;
