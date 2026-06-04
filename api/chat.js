// Vercel Serverless Function — /api/chat
// Hỗ trợ: Groq (free) > OpenRouter > Gemini > Anthropic > Local Mock AI

// ═══════════════════════════════════════════════════════════
// LOCAL MOCK AI (Offline fallback — không cần API Key nào)
// ═══════════════════════════════════════════════════════════
function handleLocalMockAI(clientPayload) {
  const sys = clientPayload.system || '';
  const station = sys.includes('Trạm 1') ? 1 :
                  sys.includes('Trạm 2') ? 2 :
                  sys.includes('Trạm 3') ? 3 :
                  sys.includes('Trạm 4') ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMsg  = messages[messages.length - 1];
  const query    = lastMsg ? lastMsg.content.toLowerCase() : '';

  let text = '';

  switch (station) {
    case 1:
      if (query.includes('chip') || query.includes('giáo sư') || query.includes('lotus-x') || query.includes('nguồn gốc')) {
        text = "[PROF_IMG] 🤖 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026, thuộc Kỷ Nguyên Vươn Mình Và Trí Tuệ Tỉnh Thức. Nhiệm vụ của tôi là lưu giữ dữ liệu lịch sử và lý tưởng GĐPT qua hàng nghìn năm. ⚙️✨";
      } else if (query.includes('quy luật') || query.includes('giải mã') || query.includes('thay thế') || query.includes('phật giáo')) {
        text = "[PROF_IMG] 🤖 Giáo sư đã từng nhấn mạnh trong phát biểu: 'Phật Giáo Việt Nam như hình với bóng, Chúng ta suy cùng tấn công xây dựng.' Bạn thử tìm hiểu xem nó có liên quan gì không nhé... 🤫";
      } else if (query.includes('chai') || query.includes('nước') || query.includes('aquafina')) {
        text = "🤖 Loại nước thương hiệu Mỹ bắt đầu bằng chữ A... Giáo sư hay nhắc đến lắm 😏 Thử cuốn tờ giấy quanh thân chai xem sao!";
      } else if (query.includes('tờ giấy') || query.includes('ký tự') || query.includes('cuốn') || query.includes('mật thư')) {
        text = "🤖 Vật các bạn đang cầm có thể là chìa khóa... 🌀 Hãy thử kết hợp nó với thứ bạn luôn mang theo bên mình!";
      } else {
        text = "🤖 Chào Chiến Binh Sen Trắng! Hỏi tôi về 'tờ giấy', 'chai nước', 'giáo sư' hoặc 'quy luật giải mã' để nhận gợi ý! 🌟";
      }
      break;

    case 2:
      if (query.includes('pháp cú') || query.includes('kinh') || query.includes('kệ') || query.includes('đáp án') || query.includes('tâm')) {
        text = "🤖 Câu kệ đầu tiên Kinh Pháp Cú: '... dẫn đầu các pháp, ... là chủ, ... tạo tác'. Chữ còn thiếu xuất hiện 3 lần liên tiếp — đó chính là chìa khóa vàng bạn cần tìm! 🤫";
      } else if (query.includes('phật') || query.includes('giáo') || query.includes('ý thức')) {
        text = "🤖 Phật giáo dạy rằng vạn vật đều do tư tưởng dẫn dắt. Chữ đó liên quan đến 'tấm lòng', 'suy nghĩ', 'ý thức' của mỗi người... 🧘";
      } else {
        text = "🤖 Trạm 2: Vùng Mã Hóa Bí Ẩn. Hỏi tôi về câu kệ đầu tiên của Kinh Pháp Cú để tìm đáp án! 📖";
      }
      break;

    case 3:
      if (query.includes('chip') || query.includes('chồng') || query.includes('khớp') || query.includes('tấm') || query.includes('đặt lên') || query.includes('số') || query.includes('đường nét')) {
        text = "[ANALYZE] 🤖 LOTUS-X đang phân tích...\n\"...quét thông tin vi mạch... hoàn tất...\"\nCác con số đó hả bạn? 🤔\n\"Đôi khi con số không dùng để đếm, mà dùng để chỉ đường nét.\"\nĐáp án không nằm trên chip... mà nằm ở nơi các con số đang muốn dẫn — vẽ lên.\n🤖 \"...chúc các Chiến Binh Sen Trắng may mắn...\"";
      } else if (query.includes('phật') || query.includes('đản sinh') || query.includes('lâm') || query.includes('ấn độ') || query.includes('nepal') || query.includes('vườn')) {
        text = "🤖 Nơi Đức Phật đản sinh là một khu vườn hoàng gia nằm giữa biên giới Ấn Độ và Nepal cổ đại, tên bắt đầu bằng chữ L... 🌸";
      } else {
        text = "🤖 Trạm 3: Cổng Kết Nối Thời Gian. Hỏi tôi về cách dùng 'chip', ý nghĩa 'các con số đường nét', hoặc nơi 'Đức Phật đản sinh'! 🕰️";
      }
      break;

    case 4:
      if (query.includes('video') || query.includes('số') || query.includes('chạy') || query.includes('nhiều') || query.includes('lặp')) {
        text = "[ANALYZE] 🤖 LOTUS-X đang quét tín hiệu video...\n\"Giữa muôn vàn tiếng ồn, chỉ có kẻ tĩnh tâm mới nghe được tiếng thì thầm.\"\nĐừng đọc TẤT CẢ. Hãy để mắt thư giãn — tìm con số lặp lại đều đặn như nhịp thở giữa cơn bão. 👀\n🤖 \"...hãy quan sát... kiên nhẫn...\"";
      } else if (query.includes('ngũ') || query.includes('giới') || query.includes('5') || query.includes('phật tử') || query.includes('luật')) {
        text = "🤖 'Ngũ' trong tiếng Hán có nghĩa là bao nhiêu? Đó chính là con số thiêng liêng GĐPT ẩn trong video! 🤫";
      } else {
        text = "🤖 Trạm 4: Ngũ Giới - Lá Chắn Tâm Hồn. Hỏi tôi về cách lọc số trong 'video' hoặc ý nghĩa 'Ngũ giới' để tìm đáp án! ⚔️";
      }
      break;

    case 5:
      if (query.includes('mảnh') || query.includes('ghép') || query.includes('quy luật') || query.includes('loại trừ') || query.includes('xác suất') || query.includes('đúng') || query.includes('sai')) {
        text = "[ANALYZE] 🤖 LOTUS-X đang tổng hợp dữ liệu 4 trạm...\n\"Mỗi ký hiệu chỉ mang một GIÁ TRỊ — ĐÚNG hoặc SAI. Đứng riêng lẻ vô nghĩa. Nhưng khi đặt 4 mảnh cạnh nhau... quy luật tự hiện ra.\" 🔍\nThứ ĐÚNG được củng cố. Thứ SAI bị loại. Thứ còn lại — chính là sự thật. 😏\n🤖 \"...hãy đặt 4 mảnh lại... để quy luật tự nói chuyện... ✨\"";
      } else {
        text = "🤖 Trạm Cuối: Hội Tụ Dữ Liệu! Hãy lấy 4 mảnh giấy từ tất cả các trạm, đặt cạnh nhau và hỏi tôi về 'quy luật loại trừ' để giải mã phần thưởng cuối cùng! 🎁✨";
      }
      break;
  }

  return { content: [{ type: 'text', text }] };
}

// ═══════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════
module.exports = async (req, res) => {
  // Only accept POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const clientPayload = req.body;

    const groqApiKey       = process.env.GROQ_API_KEY;
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey     = process.env.GEMINI_API_KEY;
    const anthropicApiKey  = process.env.ANTHROPIC_API_KEY;
    const isValid = k => k && !k.startsWith('your_') && k.trim() !== '';

    // ─── GROQ (free, no card) ───
    if (isValid(groqApiKey)) {
      const messages = [];
      if (clientPayload.system) messages.push({ role: 'system', content: clientPayload.system });
      for (const m of (clientPayload.messages || [])) messages.push({ role: m.role, content: m.content });

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqApiKey}` },
        body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: clientPayload.max_tokens || 1000, messages })
      });
      const data = await groqRes.json();
      if (groqRes.ok) {
        const text = data.choices?.[0]?.message?.content || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
        res.status(200).json({ content: [{ type: 'text', text }] });
        return;
      }
    }

    // ─── OPENROUTER (free models) ───
    if (isValid(openrouterApiKey)) {
      const messages = [];
      if (clientPayload.system) messages.push({ role: 'system', content: clientPayload.system });
      for (const m of (clientPayload.messages || [])) messages.push({ role: m.role, content: m.content });

      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openrouterApiKey}` },
        body: JSON.stringify({ model: 'meta-llama/llama-3.3-70b-instruct:free', max_tokens: clientPayload.max_tokens || 1000, messages })
      });
      const data = await orRes.json();
      if (orRes.ok) {
        const text = data.choices?.[0]?.message?.content || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
        res.status(200).json({ content: [{ type: 'text', text }] });
        return;
      }
    }

    // ─── GEMINI ───
    if (isValid(geminiApiKey)) {
      const contents = (clientPayload.messages || []).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const geminiPayload = { contents, generationConfig: { maxOutputTokens: clientPayload.max_tokens || 1000 } };
      if (clientPayload.system) geminiPayload.systemInstruction = { parts: [{ text: clientPayload.system }] };

      const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });
      const data = await gemRes.json();
      if (gemRes.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
        res.status(200).json({ content: [{ type: 'text', text }] });
        return;
      }
    }

    // ─── ANTHROPIC ───
    if (isValid(anthropicApiKey)) {
      const antRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicApiKey, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify(clientPayload)
      });
      const data = await antRes.json();
      if (antRes.ok) {
        res.status(200).json(data);
        return;
      }
    }

    // ─── LOCAL MOCK AI (offline fallback) ───
    const mockResponse = handleLocalMockAI(clientPayload);
    res.status(200).json(mockResponse);

  } catch (err) {
    console.error('API Handler Error:', err);
    try {
      const mockResponse = handleLocalMockAI(req.body || {});
      res.status(200).json(mockResponse);
    } catch (e) {
      res.status(500).json({ error: { message: 'Internal Server Error' } });
    }
  }
};
