import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'orcafacil-pro' });
  });

  app.post('/api/decode-whatsapp', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'Chave da API Gemini não configurada no servidor (GEMINI_API_KEY).',
        code: 'MISSING_API_KEY',
      });
    }

    const rawText = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!rawText) {
      return res.status(400).json({ error: 'Texto do pedido não informado.' });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Extraia TODOS os materiais de madeira, serraria e projetos rurais do pedido abaixo enviado por um cliente no WhatsApp ou transcrição de áudio:\n\n"${rawText}"`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            'Você é um especialista técnico em madeireira e serraria brasileira. Interprete pedidos informais, áudios transcritos, gírias regionais (pecinha, ripinha, ripãozinho, caibrinho, morão, estaca, tora, prancha, tábua, régua, porteira, mesa rústica), frações faladas ("4 metros e meio" = 4.5, "meia dúzia" = 6, "2 dúzias" = 24), metragens lineares corridas (ex: "300m de ripão" -> isLinearOrder=true, quantity=300, length=1) e medidas em cm/m. Retorne apenas JSON estruturado válido conforme o schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              woodSpecies: {
                type: Type.STRING,
                description: 'Espécie predominante detectada (ex: Eucalipto, Ipê, Roxinho, Pinus, Cedro, Itaúba, Cumaru, Jatobá).',
              },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: {
                      type: Type.STRING,
                      description: 'Um dos tipos exatos: peca, regua, ripa, ripao, caibro, viga, tabua, prancha, pilar, tora, porteira, mesa.',
                    },
                    originalSnippet: { type: Type.STRING },
                    quantity: { type: Type.NUMBER, description: 'Quantidade de peças OU metros totais se isLinearOrder=true.' },
                    lengthMeters: { type: Type.NUMBER, description: 'Comprimento em metros (ex: 3.0, 4.5). Use 1.0 se for metro corrido.' },
                    widthCm: { type: Type.NUMBER, description: 'Largura em cm (ou largura da porteira em metros se porteira).' },
                    thicknessCm: { type: Type.NUMBER, description: 'Espessura em cm.' },
                    diameterCm: { type: Type.NUMBER, description: 'Diâmetro em cm quando for tora ou mourão roliço.' },
                    heightMeters: { type: Type.NUMBER, description: 'Altura em metros quando for porteira.' },
                    rails: { type: Type.NUMBER, description: 'Número de réguas quando for porteira.' },
                    hasBenches: { type: Type.BOOLEAN, description: 'Se mesa acompanha bancos.' },
                    isLinearOrder: { type: Type.BOOLEAN, description: 'True se pedido em metros lineares corridos sem tamanho fixo de peça.' },
                  },
                  required: ['type', 'quantity'],
                },
              },
            },
            required: ['items'],
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(jsonText);
      return res.json({
        woodSpecies: parsed.woodSpecies || 'Eucalipto',
        items: Array.isArray(parsed.items) ? parsed.items : [],
      });
    } catch (err: any) {
      console.error('Erro na rota /api/decode-whatsapp:', err);
      const status = typeof err?.status === 'number' ? err.status : 500;
      return res.status(status).json({
        error: err?.message || 'Falha ao consultar o serviço de decodificação inteligente.',
      });
    }
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OrçaFácil Pro server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
