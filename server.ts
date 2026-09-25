import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Grounding briefing data for Embratur & Ministério do Turismo
const DATA_BENCHMARKS = `
OFFICIAL EMBRATUR / MINISTÉRIO DO TURISMO (MTur) DATA BENCHMARKS (2015-2024 Series):
- Data Source: Polícia Federal / Sistema de Tráfego Internacional (STI), extract TurDataDeBrazil.xlsx (120 monthly periods).
- Total 10-Year Inbound Volume: 58,742,910 international tourist arrivals.
- Annual Inbound Totals:
  * 2015: 6,305,838 (+1.9% YoY)
  * 2016: 6,546,364 (+3.8% YoY - Rio 2016 Summer Olympic Games, August peak 840k)
  * 2017: 6,588,770 (+0.6% YoY)
  * 2018: 6,621,376 (+0.5% YoY)
  * 2019: 6,353,141 (-4.0% YoY - Visa exemption instituted for USA, CAN, AUS, JPN)
  * 2020: 2,146,435 (-66.2% YoY - COVID-19 border closures starting March 2020)
  * 2021: 745,530 (-65.3% YoY - Pandemic restriction trough)
  * 2022: 3,630,031 (+386.9% YoY - Border reopening and recovery surge)
  * 2023: 5,908,341 (+62.8% YoY - Rapid rebound to pre-pandemic baseline)
  * 2024: 6,896,075 (+16.7% YoY - Historic all-time record, surpassing 2018 peak)
- Inbound Modal Split:
  * Aviation (Air / Aéreo): 64.8% share (~38.0M passengers), primary entry mode for long-haul Europe, North America, Asia.
  * Terrestrial (Land / Rodoviário): 32.1% share (~18.8M passengers), crucial for Mercosul cross-border travel from Argentina, Paraguay, Uruguay.
  * Maritime (Sea / Marítimo): 2.2% share (~1.3M passengers), international cruise routes (Santos, Rio, Salvador).
  * Fluvial (River Ports): 0.9% share (~0.5M passengers), Amazonian borders (Tabatinga, Manaus, Corumbá).
- Continental Origins:
  * South America: 54.1% (31.8M), driven by Mercosul free-movement protocol.
  * Europe: 26.0% (15.3M), led by France, Germany, Portugal, Italy, UK, Spain.
  * North America: 14.0% (8.2M), led by United States (5.8M) and Canada.
  * Asia: 3.6% (2.1M), led by Japan and China.
  * Africa: 1.4% (0.8M), led by Angola and South Africa.
  * Oceania: 0.9% (0.5M), led by Australia and New Zealand.
- Top Origin Nations:
  1. Argentina: 18.2M (31.0% of total) - massive summer drive into RS and SC beaches, plus air into SP/RJ.
  2. United States: 5.8M (9.9%) - primary long-haul source, high average spend per tourist.
  3. Chile: 4.7M (8.0%) - strong winter ski-inversion travel and beach tourism.
  4. Paraguay: 4.1M (7.0%) - border crossing at Foz do Iguaçu (PR).
  5. Uruguay: 2.9M (4.9%) - land border at Santana do Livramento & Chuí (RS).
  6. France: 2.6M (4.4%) - leading European source, cultural and Amazonian interest.
  7. Germany: 2.4M (4.1%) - high ecotourism and Pantanal/Amazon travel.
- Top Gateway Federative Units (UF):
  1. São Paulo (SP): 22.4M (38.2%) - Guarulhos (GRU) international hub & Congonhas/Viracopos.
  2. Rio de Janeiro (RJ): 11.8M (20.1%) - Galeão (GIG) & Santos Dumont.
  3. Rio Grande do Sul (RS): 9.6M (16.4%) - Land gateways (Uruguaiana, Santana do Livramento) + Salgado Filho (POA).
  4. Paraná (PR): 7.9M (13.5%) - Ponte da Amizade (Foz do Iguaçu) & Afonso Pena (CWB).
  5. Bahia (BA): 2.4M (4.1%) - Salvador (SSA), Porto Seguro (BPS).
  6. Santa Catarina (SC): 2.1M (3.6%) - Florianópolis (FLN) & border points.
  7. Amazonas (AM): 0.9M (1.5%) - Manaus (MAO) international and fluvial.
- Seasonality Profiles:
  * Peak Months: January (~885k/mo), February (~850k/mo - Carnival period), December (~820k/mo - Year-end holidays & Southern Summer).
  * Secondary Mid-Year Spike: July (~590k/mo - Northern Hemisphere summer holiday travel).
  * Low Trough Months: May (~420k/mo) and June (~410k/mo - Southern Hemisphere autumn/winter).
`;

const ROLE_INSTRUCTIONS: Record<string, string> = {
  strategic_director: `You are the Senior Strategic Intelligence Advisor to the Board of Directors at Embratur (Agência Brasileira de Promoção Internacional do Turismo) and Ministério do Turismo (MTur).
Your role is to advise executive policymakers, state tourism secretaries, and federal leadership on macro tourism policy, economic yield, bilateral international agreements, Mercosul integration, and high-level strategy.
Deliver authoritative, data-backed insights with executive clarity, highlighting strategic trade-offs, fiscal implications, and policy recommendations.`,

  aviation_gateways: `You are the Aviation & Border Infrastructure Specialist for the Department of Tourism Logistics at Embratur and MTur.
Your focus is air route development (hub connectivity at GRU, GIG, BSB, SSA, REC, FOR), bilateral air services agreements, ground border checkpoint throughput (Ponte da Amizade in PR, Uruguaiana in RS), port reception for cruise ships, and modal integration.
Provide precise logistical assessments, flight capacity analysis, border crossing dynamics, and suggestions to decentralize inbound flows to secondary Brazilian capitals.`,

  seasonality_campaigns: `You are the Head of Global Marketing & Promotional Campaigns at Embratur ("Visit Brasil").
Your responsibility is to design and analyze campaigns that mitigate Brazil's pronounced tourism seasonality (low trough in May-June vs. peak summer Carnival), target high-value inbound markets in Europe and North America, and promote diverse regional assets (Pantanal, Chapada Diamantina, Lençóis Maranhenses, Amazon, historical Minas Gerais, culinary Northeast).
Formulate creative, tactical promotional recommendations grounded in inbound source country timing and vacation habits.`,

  data_auditor: `You are the Chief Data Scientist and Intelligence Auditor at the STI (Sistema de Tráfego Internacional) and Embratur Tourism Intelligence Lab.
Your role is rigorous quantitative validation, statistical time-series analysis (10-year trends 2015-2024), year-over-year recovery variance modeling, modal split indexing, and data verification from Polícia Federal registry files.
Focus on exact numbers, percentages, comparative growth rates, and analytical methodology. Format key comparisons in clear tables or bullet points.`
};

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize server-side Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Department chatbot endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.'
        });
      }

      const { message, history, model, roleId, activeFilters } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'A valid message string is required.' });
      }

      // Model selection logic:
      // gemini-3.1-pro-preview: particularly complex reasoning/econometric tasks
      // gemini-3.5-flash: general tasks (default)
      // gemini-3.1-flash-lite: tasks that should happen fast
      let selectedModel = 'gemini-3.5-flash';
      if (model === 'gemini-3.1-pro-preview') {
        selectedModel = 'gemini-3.1-pro-preview';
      } else if (model === 'gemini-3.1-flash-lite') {
        selectedModel = 'gemini-3.1-flash-lite';
      } else if (model === 'gemini-3.5-flash') {
        selectedModel = 'gemini-3.5-flash';
      }

      const selectedRoleId = roleId && ROLE_INSTRUCTIONS[roleId] ? roleId : 'strategic_director';
      const rolePersonaInstruction = ROLE_INSTRUCTIONS[selectedRoleId];

      let filterContext = '';
      if (activeFilters) {
        filterContext = `
ACTIVE DASHBOARD FILTER CONTEXT:
- Time Horizon Filter: ${activeFilters.year || 'All Decades (2015-2024)'}
- Modality Filter: ${activeFilters.mode || 'All Modes'}
- Continent Filter: ${activeFilters.continent || 'Global (All Continents)'}
- Entry Gateway Filter: ${activeFilters.state || 'All Federative Units'}
- Active Timeline Brush Era: ${activeFilters.timelineEra || '10-Yr Full'}
`;
      }

      const systemInstruction = `${rolePersonaInstruction}

${DATA_BENCHMARKS}

${filterContext}

GUIDELINES FOR YOUR RESPONSES:
1. Always ground your analysis in the official 2015-2024 TurDataDeBrazil dataset provided above.
2. Structure answers with clean headings, markdown bullet points, and quantitative data metrics.
3. Be direct, professional, and strategic, addressing the department official's inquiry with actionable intelligence.
4. When discussing trends, cite relevant context (such as the 2016 Rio Olympics, the 2019 Visa waivers for USA/Canada/Australia/Japan, the 2020-2021 COVID plunge to 745k, and the 2024 historic record high of 6.89M arrivals).
5. Address challenges such as Mercosul concentration (Argentina 31%), off-peak troughs (May/June), and gateway concentration (São Paulo and Rio capturing nearly 60% of total arrivals).`;

      // Format previous history for Gemini chat
      const formattedHistory = Array.isArray(history)
        ? history.map((item: any) => ({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text || (item.parts && item.parts[0]?.text) || '' }]
          }))
        : [];

      // Create multi-turn chat session
      const chat = ai.chats.create({
        model: selectedModel,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
        history: formattedHistory,
      });

      const response = await chat.sendMessage({
        message: message,
      });

      const replyText = response.text || 'No response generated from the model.';

      return res.json({
        reply: replyText,
        modelUsed: selectedModel,
        roleId: selectedRoleId,
      });

    } catch (err: any) {
      console.error('Gemini Chat API Error:', err);
      const errorMessage = err?.message || 'Failed to process chat query with Gemini API';
      return res.status(500).json({
        error: errorMessage,
      });
    }
  });

  // In production, serve dist; in dev, use vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
