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
// KEYWORD MATCH (Ưu tiên #1 — trả lời cố định theo từ khóa)
// Trả về object nếu khớp từ khóa, trả về null nếu không khớp
// (khi null → sẽ fallback sang API AI)
// ═══════════════════════════════════════════════════════════
function tryKeywordMatch(clientPayload) {
  const station = clientPayload.system && clientPayload.system.includes('Chặng 1') ? 1 :
                  clientPayload.system && clientPayload.system.includes('Chặng 2') ? 2 :
                  clientPayload.system && clientPayload.system.includes('Chặng 3') ? 3 :
                  clientPayload.system && clientPayload.system.includes('Chặng 4') ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMessage = messages[messages.length - 1];
  const query = lastMessage ? lastMessage.content.toLowerCase() : '';

  let responseText = null;

  switch (station) {
    case 1:
      if (query.includes('giải mã') || query.includes('gợi ý') || query.includes('giúp') || query.includes('đáp án') || query.includes('cách làm') || query.includes('mật mã') || query.includes('khóa') || query.includes('trợ giúp')) {
        responseText = "🤖 Chặng 1 không cần sử dụng chatbot. Các bạn hãy nỗ lực tự giải mã nhé! 🚀";
      }
      break;
    case 2:
      if (query.includes('giải mã') || query.includes('gợi ý') || query.includes('giúp') || query.includes('đáp án') || query.includes('cách làm') || query.includes('mật mã') || query.includes('khóa') || query.includes('trợ giúp')) {
        responseText = "🤖 Chặng 2 không cần sử dụng chatbot. Các bạn hãy nỗ lực tự giải mã nhé! 🚀";
      }
      break;
    case 3:
      if (query.includes('cuốn') || query.includes('quấn') || query.includes('cách giải tiếp') || query.includes('tiếp theo') || query.includes('quy luật') || query.includes('thẳng hàng')) {
        responseText = "🤖 LOTUS-X gợi ý: Khi tờ giấy đã ôm trọn lấy thân chai, hãy để ánh mắt xuôi theo chiều dọc. Nhớ câu 'Đầu XUÔI đuôi thì KẸT'... Và đừng quên một giao ước ngầm: 'X' chỉ là lớp mặt nạ của 'J'. 🧩";
      } else if (query.includes('chai') || query.includes('nước') || query.includes('aquafina')) {
        responseText = "🤖 LOTUS-X gợi ý: Hãy thử dùng tờ giấy và 'cuốn' quanh chai nước xem có điều gì kỳ diệu xảy ra không nhé! 🌀";
      } else if (query.includes('giấy') || query.includes('tờ giấy') || query.includes('mảnh giấy') || query.includes('kí tự') || query.includes('ký tự')) {
        responseText = "🤖 LOTUS-X gợi ý: ĐÓ LÀ MỘT LOẠI NƯỚC CỦA NƯỚC MỸ BẮT ĐẦU LÀ TỪ A... BẠN XEM THỬ CÓ GIÚP ÍCH GÌ KHÔNG NHÉ! 💧";
      }
      // Không khớp từ khóa → responseText vẫn null → sẽ gọi API AI
      break;
    case 4:
      if (query.includes('khóa') || query.includes('mật thư') || query.includes('hai khóa') || query.includes('giải mã') || query.includes('tọa độ') || query.includes('tâm') || query.includes('bảng') || query.includes('hàng') || query.includes('cột')) {
        responseText = "🤖 LOTUS-X gợi ý: KHÓA THỨ 1 LÀ TỌA ĐỘ BẢNG HÀNG CỘT, KHÓA THỨ 2 LẤY TÂM CỦA NHỮNG TỪ GIẢI RA Ở KHÓA 1. 🔮";
      }
      // Không khớp từ khóa → responseText vẫn null → sẽ gọi API AI
      break;
    case 5:
      if (query.includes('250') || query.includes('tcn') || query.includes('ý nghĩa') || query.includes('y nghia')) {
        responseText = "🤖 Năm 250 TCN, ám ảnh bởi sự tàn khốc của chiến tranh, Vua A Dục (Ashoka) quyết định buông gươm, quy y Phật giáo và cho dựng một trụ đá vĩ đại tại đất thiêng Sarnath. Ông muốn đây là biểu tượng của lòng từ bi thay vì uy quyền máu lửa.\n\nDưới bàn tay tài hoa của các nghệ nhân, khối sa thạch nguyên khối biến thành một kiệt tác: đỉnh cột khắc bốn con sư tử dũng mãnh nhìn ra bốn hướng để truyền bá Chánh pháp, thân cột mài nhẵn như gương khắc sắc lệnh kêu gọi muôn dân sống hòa hợp, ngừng sát sinh.\n\nNgày khánh thành, nhìn trụ đá sừng sững dưới hoàng hôn, vị minh quân khẽ mỉm cười thanh thản. Ông biết mình vừa để lại cho hậu thế một ngọn hải đăng vĩnh cửu về hòa bình và tình thương. 🌸";
      } else if (query.includes('mạch') || query.includes('mach') || query.includes('mica') || query.includes('đè') || query.includes('vẽ') || query.includes('vị trí')) {
        responseText = "🤖 LOTUS-X gợi ý: Hãy dùng sơ đồ mạch điện và đè tấm mica lên (hoặc vẽ các đường lạ trên mạch) để tìm ra các con số. Chú ý: các con số này hiện ra nhưng chưa đúng vị trí nhé! 🤫";
      }
      // Không khớp từ khóa → responseText vẫn null → sẽ gọi API AI
      break;
  }

  if (responseText) {
    return { content: [{ type: 'text', text: responseText }] };
  }
  return null; // Không khớp từ khóa → fallback sang API AI
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

        const clientPayload = JSON.parse(body);

        const geminiApiKey     = process.env.GEMINI_API_KEY;
        const anthropicApiKey  = process.env.ANTHROPIC_API_KEY;
        const groqApiKey       = process.env.GROQ_API_KEY;
        const openrouterApiKey = process.env.OPENROUTER_API_KEY;

        const isValid = k => k && !k.startsWith('your_') && k !== '';

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
          console.log('[Mode] OpenRouter API (fallback từ keyword)');
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
          console.log('[Mode] Gemini API (fallback từ keyword)');
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
          console.log('[Mode] Anthropic API (fallback từ keyword)');
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

        // ─── OFFLINE FALLBACK (không có API nào hoạt động) ───
        console.log('[Mode] Offline Fallback (không có API)');
        const offlineKwResult = tryKeywordMatch(clientPayload);
        if (offlineKwResult) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(offlineKwResult));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: [{ type: 'text', text: '🤖 Hiện tại không có kết nối API. Hãy thử hỏi bằng các từ khóa liên quan đến chặng hiện tại nhé! 🔌' }] }));

      } catch (err) {
        console.error('Server Error:', err);
        let fallbackPayload = {};
        try { fallbackPayload = JSON.parse(body); } catch(e) {}
        const catchKwResult = tryKeywordMatch(fallbackPayload);
        if (catchKwResult) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(catchKwResult));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content: [{ type: 'text', text: '🤖 Đã xảy ra lỗi kết nối. Vui lòng thử lại! ⚠️' }] }));
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
  console.log('  Thứ tự ưu tiên xử lý:');
  console.log('  1. Keyword Match (từ khóa → trả cố định)');
  console.log('  2. Groq API (MIỄN PHÍ - gsk_...)');
  console.log('  3. OpenRouter (FREE models)');
  console.log('  4. Gemini (cần billing)');
  console.log('  5. Anthropic Claude (có phí)');
  console.log('  6. Offline Fallback');
  console.log('═══════════════════════════════════════');
});
