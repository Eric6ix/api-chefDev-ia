import express from 'express';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; // Carrega a chave do arquivo .env

const app = express();
app.use(express.json()); // Permite que o Express entenda JSON no corpo da requisição

// Inicializa o SDK do Gemini com a chave de API
// GEMINI_API_KEY no arquivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Rota POST para interagir com o Gemini
app.post('/perguntar', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt obrigatório.' });

    let tentativas = 3;
    let sucesso = false;
    let response;

    while (tentativas > 0 && !sucesso) {
        try {
            response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: prompt,
            });
            sucesso = true; 
        } catch (error) {
            if (error.status === 503) {
                console.log(`Servidor instável (503). Tentando novamente... Restam ${tentativas - 1} tentativas.`);
                tentativas--;
                // Aguarda 2 segundos antes de 
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                // Se for outro erro (ex: 400, 403), não adianta 
                return res.status(error.status || 500).json({ error: error.message });
            }
        }
    }

    if (sucesso) {
        res.json({ resposta: response.text });
    } else {
        res.status(503).json({ error: 'O serviço do Gemini está instável no momento. Tente novamente mais tarde.' });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});