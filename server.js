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
  const station = clientPayload.system && clientPayload.system.includes('Trạm 1') ? 1 :
                  clientPayload.system && clientPayload.system.includes('Trạm 2') ? 2 :
                  clientPayload.system && clientPayload.system.includes('Trạm 3') ? 3 :
                  clientPayload.system && clientPayload.system.includes('Trạm 4') ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMessage = messages[messages.length - 1];
  const query = lastMessage ? lastMessage.content.toLowerCase() : '';

  let responseText = '';

  switch (station) {
    case 1:
      if (query.includes('chai') || query.includes('nước') || query.includes('aquafina')) {
        responseText = "🤖 LOTUS-X gợi ý: Giáo sư Lotus X thường mang theo một loại nước giải khát thương hiệu Mỹ bắt đầu bằng chữ A. Thử xem chiếc chai nhựa hình trụ đó có thể giúp gì để làm thẳng hàng các ký tự không nhé... 😏";
      } else if (query.includes('tờ giấy') || query.includes('cuốn') || query.includes('ký tự')) {
        responseText = "🤖 LOTUS-X gợi ý: Hãy quấn tờ giấy đó xung quanh thân chai nước Aquafina. Phép màu của Giáo sư sẽ sắp xếp các ký tự thẳng hàng để đọc thông điệp ẩn! 🌀";
      } else if (query.includes('quy luật') || query.includes('giải mã') || query.includes('phật giáo')) {
        responseText = "[PROF_IMG] 🤖 LOTUS-X trích xuất ghi chép của Giáo sư:\n'Phật Giáo Việt Nam như hình với bóng, Chúng ta suy cùng tấn công xây dựng.'\nĐây là câu khóa dùng để đối chiếu bảng thay thế ký tự. 🤫";
      } else if (query.includes('giáo sư') || query.includes('lotus-x')) {
        responseText = "[PROF_IMG] 🤖 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026. Nhiệm vụ của tôi là bảo vệ thông điệp lịch sử GĐPT. ⚙️✨";
      } else {
        responseText = "🤖 Chào Chiến Binh Sen Trắng! Hỏi tôi về 'tờ giấy', 'chai nước', hoặc 'quy luật giải mã' để nhận gợi ý! 🌟";
      }
      break;
    case 2:
      if (
        query.includes('nhóm 1') || query.includes('nhóm một') || query.includes('nhom 1') || query.includes('nhom mot') ||
        query.includes('mica') || query.includes('sơ đồ') || query.includes('so do') || query.includes('mạch') || query.includes('mach') ||
        query.includes('đè') || query.includes('de up') || query.includes('vẽ') || query.includes('ve') || query.includes('đường lạ') ||
        query.includes('duong la') || query.includes('bản tin') || query.includes('ban tin')
      ) {
        responseText = "🤖 LOTUS-X gợi ý Nhóm 1: Sau khi giải xong bản tin, hãy dùng sơ đồ mạch điện và đè tấm mica lên (hoặc vẽ các đường lạ trên mạch) để tìm ra một dãy gồm 5 chữ số của nhóm mình. Chú ý: dãy số này chưa đúng thứ tự nhé! 🤫";
      } else if (
        query.includes('nhóm 2') || query.includes('nhóm hai') || query.includes('nhom 2') || query.includes('nhom hai') ||
        query.includes('5 trụ') || query.includes('5 tru') || query.includes('trục') || query.includes('truc') || query.includes('trụ') ||
        query.includes('tru') || query.includes('hoàn thành') || query.includes('hoan thanh') || query.includes('toán') || query.includes('toan') ||
        query.includes('phật pháp') || query.includes('phat phap') || query.includes('kỹ năng') || query.includes('ky nang') ||
        query.includes('bài hát') || query.includes('bai hat') || query.includes('lịch sử') || query.includes('lich su')
      ) {
        responseText = "🤖 LOTUS-X gợi ý Nhóm 2: Các bạn cần vượt qua 5 trụ thử thách (Toán, Phật Pháp, Kỹ năng, Đoán bài hát, Lịch sử Đức Phật) để nhận 5 con số chỉ vị trí tương ứng. Hãy đi hết cả 5 trụ để thu thập đầy đủ dãy số vị trí nhé! 🧭";
      } else if (
        query.includes('quy luật') || query.includes('quy luat') || query.includes('liên kết') || query.includes('lien ket') ||
        query.includes('giải mã') || query.includes('giai ma') || query.includes('ghép') || query.includes('ghep') ||
        query.includes('thứ tự') || query.includes('thu tu') || query.includes('cách giải') || query.includes('cach giai') ||
        query.includes('hint') || query.includes('gợi ý') || query.includes('goi y') || query.includes('phối hợp') ||
        query.includes('phoi hop') || query.includes('đối chiếu') || query.includes('doi chieu') || query.includes('kết hợp') ||
        query.includes('ket hop') || query.includes('2 nhóm') || query.includes('2 nhom') || query.includes('làm sao') ||
        query.includes('lam sao') || query.includes('hướng dẫn') || query.includes('huong dan')
      ) {
        responseText = "🤖 LOTUS-X hướng dẫn quy luật giải mã:\n- Nhóm 1 tìm được một dãy số (đặt trên tờ giấy ghép lại).\n- Nhóm 2 tìm được dãy số vị trí sau khi hoàn thành 5 trụ.\n- Quy luật: Dãy số của Nhóm 2 chính là thứ tự để lấy các chữ số của Nhóm 1. Ví dụ, nếu Nhóm 2 có số đầu tiên là X, các bạn hãy lấy chữ số ở vị trí X của Nhóm 1 làm chữ số đầu tiên của mật mã. Cứ tương tự như vậy đối chiếu giữa 2 nhóm để ra mật mã cuối cùng! 🔑";
      } else if (
        query.includes('mật mã') || query.includes('mat ma') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('cuối cùng') || query.includes('cuoi cung') || query.includes('mật thư') || query.includes('mat thu') ||
        query.includes('kết quả') || query.includes('ket qua') || query.includes('mã') || query.includes('ma')
      ) {
        responseText = "🤖 LOTUS-X gợi ý: Mật mã cuối cùng gồm 5 chữ số. Hãy lấy dãy số tìm được ở Nhóm 1 xếp lại theo thứ tự vị trí tương ứng từ dãy số tìm được ở Nhóm 2. Hai nhóm hãy phối hợp, gọi điện hoặc trao đổi thông tin với nhau để giải nhé! 🌟";
      } else {
        responseText = "🤖 Trạm 2: Vùng Mã Hóa Bí Ẩn. Trạm này mỗi đội tách làm 2 nhóm:\n- Nhóm 1: Giải sơ đồ mạch điện đè tấm mica để tìm số.\n- Nhóm 2: Hoàn thành 5 trụ để tìm vị trí.\nHãy hỏi tôi về 'nhóm 1', 'nhóm 2' hoặc 'quy luật giải mã' để nhận gợi ý! 📡";
      }
      break;
    case 3:
      if (query.includes('chip') || query.includes('chồng') || query.includes('khớp')) {
        responseText = "[ANALYZE] 🤖 LOTUS-X phân tích đường nét...\nLấy tấm chip Trạm 1 đặt đè lên tờ giấy Trạm 3 — khi trùng khớp sẽ chỉ ra vị trí đáp án! 🔍";
      } else if (query.includes('lâm') || query.includes('phật') || query.includes('đản sinh')) {
        responseText = "🤖 LOTUS-X gợi ý: Nơi Đức Phật đản sinh là khu vườn hoàng gia giữa Ấn Độ và Nepal, bắt đầu bằng chữ L... 🌸";
      } else {
        responseText = "🤖 Trạm 3 đã kết nối. Hỏi tôi về cách dùng 'chip' hoặc nơi 'Đức Phật đản sinh'!";
      }
      break;
    case 4:
      if (query.includes('video') || query.includes('số') || query.includes('chạy')) {
        responseText = "[ANALYZE] 🤖 LOTUS-X lọc tín hiệu video...\nGiữa hàng ngàn con số, có một chữ số lặp lại cố định. Tập trung nhìn vào nửa dưới video để tìm nó! 👀";
      } else if (query.includes('ngũ') || query.includes('giới')) {
        responseText = "🤖 'Ngũ giới' tức là bao nhiêu giới luật? Con số đó chính là đáp án Trạm 4! 🤫";
      } else {
        responseText = "🤖 Trạm 4 đã kết nối. Hỏi tôi về cách lọc số trong 'video' hoặc 'Ngũ giới' để tìm đáp án!";
      }
      break;
    case 5:
      if (query.includes('mảnh') || query.includes('ghép') || query.includes('quy luật')) {
        responseText = "[ANALYZE] 🤖 LOTUS-X tổng hợp 4 trạm...\nĐặt 4 mảnh giấy cạnh nhau, loại trừ ký hiệu SAI, giữ lại ký hiệu ĐÚNG — mã nguồn cuối sẽ hiện ra! 🔍";
      } else {
        responseText = "🤖 Trạm Cuối đã kết nối. Ghép 4 mảnh giấy lại và hỏi tôi về 'quy luật loại trừ' để giải mã phần thưởng! 🎁";
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
