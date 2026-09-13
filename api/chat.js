// Vercel Serverless Function — /api/chat
// Logic: Keyword Match (ưu tiên) > Groq > OpenRouter > Gemini > Anthropic > Offline Fallback

// ═══════════════════════════════════════════════════════════
// KEYWORD MATCH (Ưu tiên #1 — trả lời cố định theo từ khóa)
// Trả về object nếu khớp từ khóa, trả về null nếu không khớp
// (khi null → sẽ fallback sang API AI)
// ═══════════════════════════════════════════════════════════
function tryKeywordMatch(clientPayload) {
  const sys = clientPayload.system || '';
  const station = (sys.includes('1') || sys.includes('KHỞI CHÈO')) ? 1 :
    (sys.includes('2') || sys.includes('VỮNG TAY')) ? 2 :
      (sys.includes('3') || sys.includes('ĐỒNG TÂM')) ? 3 :
        (sys.includes('4') || sys.includes('BỨT PHÁ')) ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMsg = messages[messages.length - 1];
  const query = lastMsg ? lastMsg.content.toLowerCase() : '';

  let text = null;

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
        text = paperHints[Math.floor(Math.random() * paperHints.length)];
      } else if (query.includes('chip') || query.includes('con chip') || query.includes('giáo sư') || query.includes('giao su') || query.includes('lotus-x') || query.includes('nguồn gốc') || query.includes('nguon goc') || query.includes('xuất xứ') || query.includes('xuat xu')) {
        text = "[PROF_IMG] Ah, câu hỏi tuyệt vời! 😄 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026, thuộc Kỷ Nguyên Vươn Mình Và Trí Tuệ Tỉnh Thức. Nhiệm vụ của tôi là lưu giữ dữ liệu lịch sử và lý tưởng BĐV qua hàng nghìn năm. ⚙️✨";
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
        text = circuitHints[Math.floor(Math.random() * circuitHints.length)];
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
        text = chipHints[Math.floor(Math.random() * chipHints.length)];
      }
      break;
    }

    case 4:
      if (query.includes('khóa') || query.includes('mật thư') || query.includes('hai khóa') || query.includes('giải mã') || query.includes('tọa độ') || query.includes('tâm') || query.includes('bảng') || query.includes('hàng') || query.includes('cột')) {
        text = "🤖 LOTUS-X gợi ý: KHÓA THỨ 1 LÀ TỌA ĐỘ BẢNG HÀNG CỘT, KHÓA THỨ 2 LẤY TÂM CỦA NHỮNG TỪ GIẢI RA Ở KHÓA 1. 🔮";
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

    const groqApiKey = process.env.GROQ_API_KEY;
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const isValid = k => k && !k.startsWith('your_') && k.trim() !== '';

    // ─── GROQ (free, no card) ───
    if (isValid(groqApiKey)) {
      console.log('[Mode] Groq API');
      const messages = [];
      if (clientPayload.system) messages.push({ role: 'system', content: clientPayload.system });
      for (const m of (clientPayload.messages || [])) messages.push({ role: m.role, content: m.content });

      const groqModels = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'llama-3.3-70b-versatile', 'openai/gpt-oss-20b'];
      for (const model of groqModels) {
        try {
          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqApiKey}` },
            body: JSON.stringify({ model, max_tokens: clientPayload.max_tokens || 1000, messages })
          });
          const data = await groqRes.json();
          if (groqRes.ok && data.choices?.[0]?.message?.content) {
            const text = data.choices[0].message.content;
            res.status(200).json({ content: [{ type: 'text', text }] });
            return;
          }
        } catch (err) {
          console.error(`[Groq ${model} Error]`, err);
        }
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
    const offlineKwResult = tryKeywordMatch(clientPayload);
    if (offlineKwResult) {
      res.status(200).json(offlineKwResult);
      return;
    }
    res.status(200).json({ content: [{ type: 'text', text: '🤖 Hiện tại không có kết nối API. Hãy thử hỏi bằng các từ khóa liên quan đến chặng hiện tại nhé! 🔌' }] });

  } catch (err) {
    console.error('API Handler Error:', err);
    try {
      const catchKwResult = tryKeywordMatch(req.body);
      if (catchKwResult) {
        res.status(200).json(catchKwResult);
        return;
      }
    } catch(e) {}
    res.status(200).json({ content: [{ type: 'text', text: '🤖 Đã xảy ra lỗi kết nối. Vui lòng thử lại! ⚠️' }] });
  }
};
