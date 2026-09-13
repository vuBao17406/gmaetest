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
  const station = (clientPayload.system && (clientPayload.system.includes('1') || clientPayload.system.includes('KHỞI CHÈO'))) ? 1 :
    (clientPayload.system && (clientPayload.system.includes('2') || clientPayload.system.includes('VỮNG TAY'))) ? 2 :
      (clientPayload.system && (clientPayload.system.includes('3') || clientPayload.system.includes('ĐỒNG TÂM'))) ? 3 :
        (clientPayload.system && (clientPayload.system.includes('4') || clientPayload.system.includes('BỨT PHÁ'))) ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMessage = messages[messages.length - 1];
  const query = lastMessage ? lastMessage.content.toLowerCase() : '';

  let responseText = null;

  switch (station) {
    case 1: {
      const isPaperOrPuzzle = query.includes('giấy') || query.includes('giay') ||
        query.includes('kí tự') || query.includes('ki tu') || query.includes('ký tự') || query.includes('ky tu') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y');

      if (isPaperOrPuzzle) {
        const paperHints = [
          "🤖 LOTUS-X gợi ý: Những kí tự rời rạc trên trang giấy phẳng lặng ấy chưa thể tự cất lời đâu... Hãy thử tìm một vật thể hình trụ tròn quen thuộc luôn đồng hành trong ba lô của bạn – một thứ mang dấu ấn của chữ 'A' – rồi để mảnh giấy ôm trọn lấy thân nó xem điều kỳ diệu gì sẽ xuất hiện! 🌀✨",
          "🤖 LOTUS-X gợi ý: Đôi khi chân lý không nằm trên một mặt phẳng. Mảnh giấy bí ẩn kia đang tìm kiếm một điểm tựa hình trụ tròn trong hành trang của các bạn... Có một vật dụng quen thuộc mang biểu tượng chữ 'A' đang đợi trang giấy quấn quanh lấy nó đấy. Thử xem nhé! 🔮🔍",
          "🤖 LOTUS-X gợi ý: Tờ giấy ấy mang một mật mã bị phân tách. Nó cần được uốn cong quanh một vật thể hình trụ quen thuộc luôn ở bên bạn – thứ gì đó bắt đầu bằng chữ 'A' thì phải... Hãy để chúng hòa làm một xem trật tự mới có mở ra không! 🌀💫",
          "🤖 LOTUS-X gợi ý: Bí mật đang ẩn giấu ngay trong chiếc ba lô đồng hành cùng bạn! Hãy chú ý đến một vật dụng thân hình trụ tròn có liên quan mật thiết đến chữ 'A'. Nếu bạn để những dòng kí tự này bao bọc xung quanh nó, điều bất ngờ sẽ tự khắc sáng tỏ... 🧩✨"
        ];
        responseText = paperHints[Math.floor(Math.random() * paperHints.length)];
      } else if (query.includes('chip') || query.includes('con chip') || query.includes('giáo sư') || query.includes('giao su') || query.includes('lotus-x') || query.includes('nguồn gốc') || query.includes('nguon goc') || query.includes('xuất xứ') || query.includes('xuat xu')) {
        responseText = "[PROF_IMG] Ah, câu hỏi tuyệt vời! 😄 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026, thuộc Kỷ Nguyên Vươn Mình Và Trí Tuệ Tỉnh Thức. Nhiệm vụ của tôi là lưu giữ dữ liệu lịch sử và lý tưởng BĐV qua hàng nghìn năm. ⚙️✨";
      }
      break;
    }
    case 2: {
      const isCircuitOrPuzzle = 
        query.includes('mạch') || query.includes('mach') ||
        query.includes('sơ đồ') || query.includes('so do') ||
        query.includes('đường nét') || query.includes('duong net') || query.includes('nét') || query.includes('net') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('bản vẽ') || query.includes('ban ve') ||
        query.includes('tờ') || query.includes('to') || query.includes('giấy') || query.includes('giay') ||
        query.includes('2 nhóm') || query.includes('hai nhóm') || query.includes('hai nhom') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('mật mã') || query.includes('mat ma');

      if (isCircuitOrPuzzle) {
        const circuitHints = [
          "🤖 LOTUS-X gợi ý: Một bản vẽ đơn độc chỉ là những đường nét đứt gãy chưa hoàn chỉnh... Hãy nhớ rằng các bạn đang nắm giữ hai nửa của cùng một nguồn năng lượng. Thử đưa hai trang giấy về cùng một góc nhìn dưới ánh sáng xem, liệu những khoảng trống có tự tìm thấy câu trả lời? ⚡🔍",
          "🤖 LOTUS-X gợi ý: Dòng điện không bao giờ có thể thông suốt nếu chỉ đi một nhánh. Hai nhóm đang mang hai mảnh ghép của một chỉnh thể... Khi hai tầm nhìn được hòa quyện làm một và soi rọi dưới ánh sáng, những nét vẽ dường như sẽ tự tìm về đúng vị trí của nó! 🌀✨",
          "🤖 LOTUS-X gợi ý: Đôi khi đáp án không nằm ở việc giải từng phần, mà nằm ở sự giao thoa. Hãy thử tìm điểm tương đồng giữa hai bản vẽ của hai nhóm rồi để chúng hợp nhất tại cùng một vị trí... Ánh sáng sẽ là chiếc cầu nối bí mật! 🔌💡",
          "🤖 LOTUS-X gợi ý: Sức mạnh của 'VỮNG TAY CHÈO' là sự đồng lòng của cả hai phía. Hai mảnh giấy rời rạc đang chờ đợi một cuộc gặp gỡ trọn vẹn... Thử để chúng cùng xuất hiện tại một tọa độ dưới luồng sáng xem điều kỳ diệu nào sẽ được thắp lên! 🧩⚡"
        ];
        responseText = circuitHints[Math.floor(Math.random() * circuitHints.length)];
      }
      break;
    }
    case 3: {
      const isChipOrPuzzle = 
        query.includes('chip') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('làm gì') || query.includes('lam gi') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('số') || query.includes('so') ||
        query.includes('đường nét') || query.includes('duong net') || query.includes('nét') || query.includes('net') ||
        query.includes('trùng') || query.includes('trung') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('mật mã') || query.includes('mat ma');

      if (isChipOrPuzzle) {
        const chipHints = [
          "🤖 LOTUS-X gợi ý: Cổ máy nhận thấy một sự cộng hưởng quen thuộc... Con chip trên tay bạn dường như không phải kẻ cô độc, nó mang một tần số tương đồng với vật phẩm bạn từng thu thập được từ điểm xuất phát của hành trình. Thử đặt hai người bạn đồng hành ấy cạnh nhau, đối chiếu từng nét khắc của các con số... Nơi nào có sự giao thoa và nét chung giữa cả hai, nơi đó trật tự mới sẽ hiện hữu! ⚡🔢",
          "🤖 LOTUS-X gợi ý: Đôi khi chìa khóa của hiện tại lại ẩn giấu trong ký ức của chặng đầu tiên. Linh kiện bí ẩn này đang tìm kiếm người anh em song sinh của nó từ Trạm 1... Hãy thử so sánh các con số trên thân hai con chip, tìm ra những nét vẽ đồng điệu cùng xuất hiện trên cả hai xem hình hài con số bí ẩn nào sẽ thành hình nhé! 🧩🔍",
          "🤖 LOTUS-X gợi ý: Một mảnh ghép đơn lẻ không thể tạo nên lời giải. Vật phẩm mới này có một sợi dây liên kết vô hình với con chip ban đầu mà bạn đã mang theo... Hãy quan sát thật kỹ các ký hiệu số trên cả hai: chỉ những đường nét trùng khớp và cùng tồn tại giữa chúng mới là sự thật, hãy chắt lọc những điểm chung ấy lại xem sao! 🔮✨",
          "🤖 LOTUS-X gợi ý: 'ĐỒNG TÂM HỢP LỰC' không chỉ là câu khẩu hiệu, mà là quy luật để kích hoạt! Con chip thứ hai này đang chờ được hội ngộ với bảo vật từ Trạm 1... Đặt chúng song hành và để ánh mắt tìm kiếm những nét tương đồng giữa các con số. Khi gạn lọc những đường nét giao thoa của hai bên, một con số hoàn toàn mới sẽ khai mở trước mắt bạn! 💫💡"
        ];
        responseText = chipHints[Math.floor(Math.random() * chipHints.length)];
      }
      break;
    }

    case 4: {
      const isVideoOrPuzzle =
        query.includes('video') || query.includes('clip') || query.includes('phim') ||
        query.includes('chạy') || query.includes('chay') ||
        query.includes('số') || query.includes('so') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('đứng yên') || query.includes('dung yen') ||
        query.includes('mật thư') || query.includes('mat thu') || query.includes('mật mã') || query.includes('mat ma') ||
        query.includes('đáp án') || query.includes('dap an') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('giúp') || query.includes('giup');

      if (isVideoOrPuzzle) {
        const videoHints = [
          "🤖 LOTUS-X gợi ý: Giữa một dòng chảy cuồn cuộn không ngừng, thứ khiến mắt bạn hoa lên chưa chắc đã là sự thật... Đừng mải mê đuổi theo những gì đang lướt qua quá nhanh. Hãy tập trung tìm kiếm sự tĩnh lặng kiên định, những kẻ bất biến không hề dao động giữa cơn bão số ấy! 🌀👁️",
          "🤖 LOTUS-X gợi ý: 'BỨT PHÁ DẪN ĐƯỜNG' đòi hỏi một đôi mắt sắc bén và một tâm trí tĩnh tại. Dòng chuyển động liên hồi chỉ là bức màn đánh lừa thị giác... Nếu bạn quan sát thật sâu, sẽ thấy có những ký tự từ chối cuốn theo dòng chảy, âm thầm bám trụ tại vị trí của mình. Đó chính là những viên ngọc sáng! 🔮✨",
          "🤖 LOTUS-X gợi ý: Mọi thứ dường như đang trôi đi vội vã trong thước phim ấy... Nhưng chân lý thì luôn đứng yên một chỗ. Hãy để mắt bạn lọc bỏ hết những gì xê dịch, chỉ giữ lại những dấu hiệu bất động ngoan cường qua từng giây phút. Chúng đang chờ bạn gọi tên đấy! ⏳🔢",
          "🤖 LOTUS-X gợi ý: Bí mật không thuộc về kẻ chạy nhanh nhất, mà thuộc về điểm tựa vững chãi nhất. Đừng cố đếm những chuyển động hỗn loạn! Hãy tĩnh tâm, khóa chặt ánh nhìn vào những tọa độ không hề thay đổi giữa muôn vàn sự biến thiên... Trật tự đích thực đang ngự trị ở nơi tĩnh lặng ấy! 💫🎯"
        ];
        responseText = videoHints[Math.floor(Math.random() * videoHints.length)];
      }
      break;
    }

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

  const groqModels = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'llama-3.3-70b-versatile', 'openai/gpt-oss-20b'];
  for (const model of groqModels) {
    try {
      const groqPayload = {
        model: model,
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

      if (groqResponse.ok) {
        return groqResponse;
      }
    } catch (e) {
      console.error(`[Groq ${model} Error]`, e);
    }
  }

  // Cuối cùng thử model mặc định
  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqApiKey}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      max_tokens: clientPayload.max_tokens || 1000,
      messages: messages
    })
  });
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
  // 1. Serve frontend and static files
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && !parsedUrl.pathname.startsWith('/api/')) {
    let filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'public', parsedUrl.pathname);
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/html; charset=utf-8';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.json') contentType = 'application/json';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Error loading file');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
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

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;
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
        try { fallbackPayload = JSON.parse(body); } catch (e) { }
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
