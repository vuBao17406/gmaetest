const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper to load environment variables from the .env file dynamically
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
      if (line.trim().startsWith('#') || !line.trim()) return;
      const delimiterIdx = line.indexOf('=');
      if (delimiterIdx > -1) {
        const key = line.slice(0, delimiterIdx).trim();
        let val = line.slice(delimiterIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
}

// Initial load
loadEnv();

// ═══════════════════════════════════════════════════════════
// LOCAL MOCK AI (Fallback khi không có API Key nào)
// ═══════════════════════════════════════════════════════════
function handleLocalMockAI(clientPayload) {
  const station = clientPayload.system && clientPayload.system.includes('Chặng 1') ? 1 :
                  clientPayload.system && clientPayload.system.includes('Chặng 2') ? 2 :
                  clientPayload.system && clientPayload.system.includes('Chặng 3') ? 3 :
                  clientPayload.system && clientPayload.system.includes('Chặng 4') ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMessage = messages[messages.length - 1];
  const query = lastMessage ? lastMessage.content.toLowerCase() : '';

  let responseText = '';

  switch (station) {
    case 1:
      responseText = "🤖 Chặng 1 không cần sử dụng chatbot. Các bạn hãy nỗ lực tự giải mã nhé! 🚀";
      break;
    case 2:
      responseText = "🤖 Chặng 2 không cần sử dụng chatbot. Các bạn hãy nỗ lực tự giải mã nhé! 🚀";
      break;
    case 3:
      if (query.includes('chai') || query.includes('nước') || query.includes('cuốn') || query.includes('quấn') || query.includes('aquafina')) {
        responseText = "🤖 LOTUS-X gợi ý: Có lẽ thông tin này giúp ích cho bạn có một câu nói 'Đầu XUÔI đuôi thì KẸT' 🧩";
      } else if (query.includes('giấy') || query.includes('tờ giấy') || query.includes('mảnh giấy') || query.includes('kí tự') || query.includes('ký tự')) {
        responseText = "🤖 LOTUS-X gợi ý: ĐÓ LÀ MỘT LOẠI NƯỚC CỦA NƯỚC MỸ BẮT ĐẦU LÀ TỪ A... BẠN XEM THỬ CÓ GIÚP ÍCH GÌ KHÔNG NHÉ! 💧";
      } else {
        responseText = "🤖 Chặng 3 đã kết nối. Hãy hỏi tôi về các 'kí tự' trên 'tờ giấy' hoặc sau khi đã 'cuốn chai nước' để nhận gợi ý! 🔍";
      }
      break;
    case 4:
      if (query.includes('khóa') || query.includes('mật thư') || query.includes('hai khóa') || query.includes('giải mã') || query.includes('tọa độ') || query.includes('tâm')) {
        responseText = "[ANALYZE] 🤖 LOTUS-X phân tích kết cấu mật thư...\n\"Một thông điệp bị niêm phong bởi hai tầng ấn chú. Tầng thứ nhất nằm ở điểm giao thoa giữa những con đường ngang và dọc trên sa bàn. Tầng thứ hai... vạn vật không đứng yên mà dịch chuyển không ngừng quanh một lõi trung tâm.\"\nBạn hiểu sự liên kết giữa 'lưới tọa độ' và 'sự dịch chuyển' chứ? 🌀";
      } else {
        responseText = "🤖 Chặng 4 đã kết nối. Hãy hỏi tôi về 'mật thư' hoặc 'khóa' để nhận được sự dẫn đường... 🔮";
      }
      break;
    case 5:
      if (query.includes('250') || query.includes('tcn') || query.includes('ý nghĩa') || query.includes('y nghia')) {
        responseText = "🤖 Năm 250 TCN, ám ảnh bởi sự tàn khốc của chiến tranh, Vua A Dục (Ashoka) quyết định buông gươm, quy y Phật giáo và cho dựng một trụ đá vĩ đại tại đất thiêng Sarnath. Ông muốn đây là biểu tượng của lòng từ bi thay vì uy quyền máu lửa.\n\nDưới bàn tay tài hoa của các nghệ nhân, khối sa thạch nguyên khối biến thành một kiệt tác: đỉnh cột khắc bốn con sư tử dũng mãnh nhìn ra bốn hướng để truyền bá Chánh pháp, thân cột mài nhẵn như gương khắc sắc lệnh kêu gọi muôn dân sống hòa hợp, ngừng sát sinh.\n\nNgày khánh thành, nhìn trụ đá sừng sững dưới hoàng hôn, vị minh quân khẽ mỉm cười thanh thản. Ông biết mình vừa để lại cho hậu thế một ngọn hải đăng vĩnh cửu về hòa bình và tình thương. 🌸";
      } else if (query.includes('mạch') || query.includes('mach') || query.includes('mica') || query.includes('đè') || query.includes('vẽ') || query.includes('vị trí')) {
        responseText = "🤖 LOTUS-X gợi ý: Hãy dùng sơ đồ mạch điện và đè tấm mica lên (hoặc vẽ các đường lạ trên mạch) để tìm ra các con số. Chú ý: các con số này hiện ra nhưng chưa đúng vị trí nhé! 🤫";
      } else {
        responseText = "🤖 Chặng Cuối đã kết nối. Hãy hỏi tôi về 'sơ đồ mạch điện' hoặc ý nghĩa của 'con số' bạn vừa tìm được! 🔍";
      }
      break;
  }

  return { content: [{ type: 'text', text: responseText }] };
}

// ═══════════════════════════════════════════════════════════
// GROQ API PROXY
// ═══════════════════════════════════════════════════════════
async function handleGroq(groqApiKey, clientPayload) {
  const messages = [];
  if (clientPayload.system) {
    messages.push({ role: 'system', content: clientPayload.system });
  }
  for (const msg of (clientPayload.messages || [])) {
    messages.push({ role: msg.role, content: msg.content });
  }

  const groqPayload = {
    model: 'llama-3.3-70b-versatile',
    max_tokens: clientPayload.max_tokens || 1000,
    messages: messages
  };

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqApiKey}`
    },
    body: JSON.stringify(groqPayload)
  });

  return groqResponse;
}

// ═══════════════════════════════════════════════════════════
// OPENROUTER API PROXY
// ═══════════════════════════════════════════════════════════
async function handleOpenRouter(openrouterApiKey, clientPayload) {
  const messages = [];
  if (clientPayload.system) {
    messages.push({ role: 'system', content: clientPayload.system });
  }
  for (const msg of (clientPayload.messages || [])) {
    messages.push({ role: msg.role, content: msg.content });
  }

  const orPayload = {
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    max_tokens: clientPayload.max_tokens || 1000,
    messages: messages
  };

  const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openrouterApiKey}`
    },
    body: JSON.stringify(orPayload)
  });

  return orResponse;
}

// ═══════════════════════════════════════════════════════════
// GEMINI API PROXY
// ═══════════════════════════════════════════════════════════
async function handleGemini(geminiApiKey, clientPayload) {
  const contents = (clientPayload.messages || []).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const geminiPayload = {
    contents: contents,
    generationConfig: { maxOutputTokens: clientPayload.max_tokens || 1000 }
  };

  if (clientPayload.system) {
    geminiPayload.systemInstruction = { parts: [{ text: clientPayload.system }] };
  }

  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiPayload)
  });

  return geminiResponse;
}

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // 1. Serve frontend (index.html)
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && !parsedUrl.pathname.startsWith('/api/')) {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(content);
      }
    });
    return;
  }

  // 2. Proxy endpoint for API calls
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => { body += chunk; });

    req.on('end', async () => {
      try {
        loadEnv();

        const geminiApiKey     = process.env.GEMINI_API_KEY;
        const anthropicApiKey  = process.env.ANTHROPIC_API_KEY;
        const groqApiKey       = process.env.GROQ_API_KEY;
        const openrouterApiKey = process.env.OPENROUTER_API_KEY;

        const isValid = k => k && !k.startsWith('your_') && k !== '';

        const clientPayload = JSON.parse(body);

        // ─── GROQ (free, no card needed) ───
        if (isValid(groqApiKey)) {
          console.log('[Mode] Groq API');
          const groqRes = await handleGroq(groqApiKey, clientPayload);
          const data = await groqRes.json();
          if (groqRes.ok) {
            const text = data.choices?.[0]?.message?.content || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
            return;
          }
          console.error('[Groq Error]', data);
        }

        // ─── OPENROUTER (free models available) ───
        if (isValid(openrouterApiKey)) {
          console.log('[Mode] OpenRouter API');
          const orRes = await handleOpenRouter(openrouterApiKey, clientPayload);
          const data = await orRes.json();
          if (orRes.ok) {
            const text = data.choices?.[0]?.message?.content || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
            return;
          }
          console.error('[OpenRouter Error]', data);
        }

        // ─── GEMINI ───
        if (isValid(geminiApiKey)) {
          console.log('[Mode] Gemini API');
          const gemRes = await handleGemini(geminiApiKey, clientPayload);
          const data = await gemRes.json();
          if (gemRes.ok) {
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
            return;
          }
          console.error('[Gemini Error]', data);
        }

        // ─── ANTHROPIC ───
        if (isValid(anthropicApiKey)) {
          console.log('[Mode] Anthropic API');
          const antRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': anthropicApiKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(clientPayload)
          });
          const data = await antRes.json();
          if (antRes.ok) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
            return;
          }
          console.error('[Anthropic Error]', data);
        }

        // ─── LOCAL MOCK AI (Offline fallback) ───
        console.log('[Mode] Local Mock AI (Offline)');
        const mockResponse = handleLocalMockAI(clientPayload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(mockResponse));

      } catch (err) {
        console.error('Server Error:', err);
        try {
          const mockResponse = handleLocalMockAI(JSON.parse(body));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(mockResponse));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { message: 'Internal Server Error' } }));
        }
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`  LOTUS-X Server: http://localhost:${PORT}`);
  console.log('  Thứ tự ưu tiên API:');
  console.log('  1. Groq (MIỄN PHÍ - gsk_...)');
  console.log('  2. OpenRouter (FREE models)');
  console.log('  3. Gemini (cần billing)');
  console.log('  4. Anthropic Claude (có phí)');
  console.log('  5. Local Mock AI (offline)');
  console.log('═══════════════════════════════════════');
});
