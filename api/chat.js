// Vercel Serverless Function — /api/chat
// Logic: Keyword Match (ưu tiên) > Groq > OpenRouter > Gemini > Anthropic > Offline Fallback

// ═══════════════════════════════════════════════════════════
// KEYWORD MATCH (Ưu tiên #1 — trả lời cố định theo từ khóa)
// Trả về object nếu khớp từ khóa, trả về null nếu không khớp
// (khi null → sẽ fallback sang API AI)
// ═══════════════════════════════════════════════════════════
function tryKeywordMatch(clientPayload) {
  const sys = clientPayload.system || '';
  const station = sys.includes('Chặng 1') ? 1 :
    sys.includes('Chặng 2') ? 2 :
      sys.includes('Chặng 3') ? 3 :
        sys.includes('Chặng 4') ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMsg = messages[messages.length - 1];
  const query = lastMsg ? lastMsg.content.toLowerCase() : '';

  let text = null;

  switch (station) {
    case 1:
      text = "🤖 Chặng 1 không cần sử dụng chatbot. Các bạn hãy nỗ lực tự giải mã nhé! 🚀";
      break;

    case 2:
      text = "🤖 Chặng 2 không cần sử dụng chatbot. Các bạn hãy nỗ lực tự giải mã nhé! 🚀";
      break;

    case 3:
      if (query.includes('cuốn') || query.includes('quấn') || query.includes('cách giải tiếp') || query.includes('tiếp theo') || query.includes('quy luật') || query.includes('thẳng hàng')) {
        text = "🤖 LOTUS-X gợi ý: Khi tờ giấy đã ôm trọn lấy thân chai, hãy để ánh mắt xuôi theo chiều dọc. Nhớ câu 'Đầu XUÔI đuôi thì KẸT'... Và đừng quên một giao ước ngầm: 'X' chỉ là lớp mặt nạ của 'J'. 🧩";
      } else if (query.includes('chai') || query.includes('nước') || query.includes('aquafina')) {
        text = "🤖 LOTUS-X gợi ý: Hãy thử dùng tờ giấy và 'cuốn' quanh chai nước xem có điều gì kỳ diệu xảy ra không nhé! 🌀";
      } else if (query.includes('giấy') || query.includes('tờ giấy') || query.includes('mảnh giấy') || query.includes('kí tự') || query.includes('ký tự')) {
        text = "🤖 LOTUS-X gợi ý: ĐÓ LÀ MỘT LOẠI NƯỚC CỦA NƯỚC MỸ BẮT ĐẦU LÀ TỪ A... BẠN XEM THỬ CÓ GIÚP ÍCH GÌ KHÔNG NHÉ! 💧";
      }
      // Không khớp từ khóa → text vẫn null → sẽ gọi API AI
      break;

    case 4:
      if (query.includes('khóa') || query.includes('mật thư') || query.includes('hai khóa') || query.includes('giải mã') || query.includes('tọa độ') || query.includes('tâm')) {
        text = "[ANALYZE] 🤖 LOTUS-X phân tích kết cấu mật thư...\n\"Một thông điệp bị niêm phong bởi hai tầng ấn chú. Tầng thứ nhất nằm ở điểm giao thoa giữa những con đường ngang và dọc trên sa bàn. Tầng thứ hai... vạn vật không đứng yên mà dịch chuyển không ngừng quanh một lõi trung tâm.\"\nBạn hiểu sự liên kết giữa 'lưới tọa độ' và 'sự dịch chuyển' chứ? 🌀";
      }
      // Không khớp từ khóa → text vẫn null → sẽ gọi API AI
      break;

    case 5:
      if (query.includes('250') || query.includes('tcn') || query.includes('ý nghĩa') || query.includes('y nghia')) {
        text = "🤖 Năm 250 TCN, ám ảnh bởi sự tàn khốc của chiến tranh, Vua A Dục (Ashoka) quyết định buông gươm, quy y Phật giáo và cho dựng một trụ đá vĩ đại tại đất thiêng Sarnath. Ông muốn đây là biểu tượng của lòng từ bi thay vì uy quyền máu lửa.\n\nDưới bàn tay tài hoa của các nghệ nhân, khối sa thạch nguyên khối biến thành một kiệt tác: đỉnh cột khắc bốn con sư tử dũng mãnh nhìn ra bốn hướng để truyền bá Chánh pháp, thân cột mài nhẵn như gương khắc sắc lệnh kêu gọi muôn dân sống hòa hợp, ngừng sát sinh.\n\nNgày khánh thành, nhìn trụ đá sừng sững dưới hoàng hôn, vị minh quân khẽ mỉm cười thanh thản. Ông biết mình vừa để lại cho hậu thế một ngọn hải đăng vĩnh cửu về hòa bình và tình thương. 🌸";
      } else if (query.includes('mạch') || query.includes('mach') || query.includes('mica') || query.includes('đè') || query.includes('vẽ') || query.includes('vị trí')) {
        text = "🤖 LOTUS-X gợi ý: Hãy dùng sơ đồ mạch điện và đè tấm mica lên (hoặc vẽ các đường lạ trên mạch) để tìm ra các con số. Chú ý: các con số này hiện ra nhưng chưa đúng vị trí nhé! 🤫";
      }
      // Không khớp từ khóa → text vẫn null → sẽ gọi API AI
      break;
  }

  if (text) {
    return { content: [{ type: 'text', text }] };
  }
  return null; // Không khớp từ khóa → fallback sang API AI
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

    // ─── ƯU TIÊN #1: KEYWORD MATCH (trả lời cố định) ───
    const keywordResult = tryKeywordMatch(clientPayload);
    if (keywordResult) {
      console.log('[Mode] Keyword Match (trả lời cố định)');
      res.status(200).json(keywordResult);
      return;
    }

    // ─── ƯU TIÊN #2: GỌI API AI (khi không khớp từ khóa) ───
    const groqApiKey = process.env.GROQ_API_KEY;
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const isValid = k => k && !k.startsWith('your_') && k.trim() !== '';

    // ─── GROQ (free, no card) ───
    if (isValid(groqApiKey)) {
      console.log('[Mode] Groq API (fallback từ keyword)');
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
      console.log('[Mode] OpenRouter API (fallback từ keyword)');
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
      console.log('[Mode] Gemini API (fallback từ keyword)');
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
      console.log('[Mode] Anthropic API (fallback từ keyword)');
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

    // ─── OFFLINE FALLBACK (không có API nào hoạt động) ───
    console.log('[Mode] Offline Fallback (không có API)');
    res.status(200).json({ content: [{ type: 'text', text: '🤖 Hiện tại không có kết nối API. Hãy thử hỏi bằng các từ khóa liên quan đến chặng hiện tại nhé! 🔌' }] });

  } catch (err) {
    console.error('API Handler Error:', err);
    res.status(200).json({ content: [{ type: 'text', text: '🤖 Đã xảy ra lỗi kết nối. Vui lòng thử lại! ⚠️' }] });
  }
};
