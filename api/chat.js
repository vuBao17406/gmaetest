// Vercel Serverless Function — /api/chat
// Logic: Keyword Match (ưu tiên) > Groq > OpenRouter > Gemini > Anthropic > Offline Fallback

// ═══════════════════════════════════════════════════════════
// KEYWORD MATCH (Ưu tiên #1 — trả lời cố định theo từ khóa)
// Trả về object nếu khớp từ khóa, trả về null nếu không khớp
// (khi null → sẽ fallback sang API AI)
// ═══════════════════════════════════════════════════════════
function tryKeywordMatch(clientPayload) {
  const sys = clientPayload.system || '';
  const station = (sys.includes('1') || sys.includes('TÂM SÁNG') || sys.includes('KHỞI CHÈO')) ? 1 :
    (sys.includes('2') || sys.includes('TRÍ MỞ') || sys.includes('VỮNG TAY')) ? 2 :
      (sys.includes('3') || sys.includes('BỀN CHÍ') || sys.includes('ĐỒNG TÂM')) ? 3 :
        (sys.includes('4') || sys.includes('SỨ MỆNH') || sys.includes('BỨT PHÁ')) ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMsg = messages[messages.length - 1];
  const query = lastMsg ? lastMsg.content.toLowerCase() : '';

  let text = null;

  switch (station) {
    case 1: {
      const isChipOrProf = (query.includes('chip') || query.includes('con chip') || query.includes('giáo sư') || query.includes('giao su') || query.includes('lotus-x') || query.includes('nguồn gốc') || query.includes('nguon goc') || query.includes('xuất xứ') || query.includes('xuat xu')) && !query.includes('màu') && !query.includes('sắp xếp') && !query.includes('thứ tự');

      const isColorOrPuzzle = 
        query.includes('màu') || query.includes('mau') ||
        query.includes('số') || query.includes('so') ||
        query.includes('mảnh') || query.includes('manh') ||
        query.includes('giấy') || query.includes('giay') ||
        query.includes('sắp xếp') || query.includes('sap xep') ||
        query.includes('thứ tự') || query.includes('thu tu') ||
        query.includes('ghép') || query.includes('ghep') ||
        query.includes('dãy') || query.includes('day') ||
        query.includes('video') || query.includes('clip') || query.includes('phim') || query.includes('câu chuyện') || query.includes('cau chuyen') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('làm thế nào') || query.includes('lam the nao') ||
        query.includes('hướng dẫn') || query.includes('huong dan') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('mật mã') || query.includes('mat ma');

      if (isChipOrProf) {
        text = "[PROF_IMG] Ah, câu hỏi tuyệt vời! 😄 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026, thuộc Kỷ Nguyên Vươn Mình Và Trí Tuệ Tỉnh Thức. Nhiệm vụ của tôi là lưu giữ dữ liệu lịch sử và lý tưởng BĐV qua hàng nghìn năm. ⚙️✨";
      } else if (isColorOrPuzzle) {
        const colorHints = [
          "🤖 LOTUS-X gợi ý: Mỗi con số các bạn vừa mang về từ các thử thách không hề đứng lẻ loi; chiếc áo sắc màu mà chúng khoác lên chính là linh hồn của một miền đất đã từng đi qua. Hãy hồi tưởng lại câu chuyện khởi nguyên lúc mở màn... Dòng thời gian của thước phim ấy đã in dấu từng gam màu theo một nhịp điệu bất biến. Hãy để trật tự của chuyến hành trình dẫn lối cho vị trí của từng con số nhé! 🌿✨",
          "🤖 LOTUS-X gợi ý: 'TÂM SÁNG' cần một đôi mắt biết kết nối hiện tại với khởi nguồn. Những sắc thái trên từng con số các bạn thu thập được chính là tấm gương phản chiếu những điểm chạm trong thước phim ban đầu... Nơi nào câu chuyện ghé thăm trước, nơi nào đặt chân đến sau? Khi các bạn xếp những con số xuôi theo dòng tự sự của chuyến đi, trật tự chân chính sẽ tự khắc bừng sáng! 🔮🧭",
          "🤖 LOTUS-X gợi ý: Vạn vật đều có vị trí thuộc về mình khi tìm đúng nhịp đập của thời gian. Đừng nhìn giá trị của các con số một cách khô khan, hãy nhìn vào sắc áo mà người đồng đội đã mang về... Thước phim mở đầu không đơn thuần là hình ảnh, mà là một dòng chảy sắc màu tuần tự dẫn lối. Đặt từng con số hòa cùng nhịp bước của hành trình, mật mã sẽ tự hoàn thiện! 🌊💫",
          "🤖 LOTUS-X gợi ý: Bí mật của chặng đường này nằm ở sự giao thoa giữa những gì các bạn vừa trải nghiệm và câu chuyện người dẫn đường đã trao gửi. Bốn sắc thái kia tựa như bốn nốt nhạc xuất hiện theo tiến trình thời gian... Điểm khởi đầu ở đâu, qua những miền đất nào, và dừng lại ở đâu? Trật tự của câu chuyện ấy chính là chiếc la bàn định hình hàng ngũ cho những con số! 🎯🗺️",
          "🤖 LOTUS-X gợi ý: Hãy để tâm trí tĩnh lặng và nhớ lại khúc ca mở màn. Những màu sắc rực rỡ từ các thử thách chính là những mảnh ghép của dòng thời gian trong thước phim khởi đầu... Khi mỗi con số tìm về đúng dấu mốc màu sắc mà chuyến đi đã lần lượt đi qua, dãy số định mệnh sẽ tự động hiện hình trong ánh sáng của chân lý! 🌟✨"
        ];
        text = colorHints[Math.floor(Math.random() * colorHints.length)];
      }
      break;
    }

    case 2: {
      const isLogicOrPaper = 
        query.includes('mảnh') || query.includes('manh') ||
        query.includes('giấy') || query.includes('giay') ||
        query.includes('tờ') || query.includes('to') ||
        query.includes('số') || query.includes('so') ||
        query.includes('kí tự') || query.includes('ki tu') || query.includes('ký tự') || query.includes('ky tu') ||
        query.includes('xác suất') || query.includes('xac suat') || query.includes('xác xuất') || query.includes('xac xuat') ||
        query.includes('loại trừ') || query.includes('loai tru') ||
        query.includes('đúng') || query.includes('dung') || query.includes('sai') ||
        query.includes('vị trí') || query.includes('vi tri') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('làm thế nào') || query.includes('lam the nao') ||
        query.includes('chỉ') || query.includes('chi') || query.includes('hướng dẫn') || query.includes('huong dan') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('mật mã') || query.includes('mat ma');

      if (isLogicOrPaper) {
        const subtleStage2Hints = [
          "🤖 LOTUS-X gợi ý: Trong hành trình 'TRÍ MỞ', không có manh mối nào đứng riêng rẽ. Bốn mảnh mật bản tựa như bốn góc nhìn khác nhau phản chiếu cùng một thực thể... Hãy đặt chúng cạnh nhau, đối chiếu những điểm giao thoa và để lý trí gạt bỏ dần những điều mâu thuẫn; luồng sáng chân thực duy nhất sẽ dần hiển lộ. 🧭✨",
          "🤖 LOTUS-X gợi ý: Những ký hiệu huyền bí trên bốn trang giấy không phải câu đố để đoán mò, mà là những lời phản hồi thầm lặng cho từng phán đoán của bạn. Hãy nhìn nhận chúng như những bức tranh ghép nhiều chiều... Bằng cách quan sát sự tương thích và loại suy những khả năng bất khả, cánh cửa giải mã sẽ tự khắc mở ra. 🔮💡",
          "🤖 LOTUS-X gợi ý: Đôi mắt sáng nhìn vào hiện tượng, nhưng tâm trí thông tuệ nhìn vào sự liên kết. Bốn mảnh giấy kia trao cho bạn những manh mối đối chiếu vô cùng chặt chẽ... Đừng giải quyết đơn lẻ từng mảnh, hãy để chúng thử thách lẫn nhau. Điểm chạm chung nơi cả bốn lời gợi mở cùng hướng về chính là đích đến cuối cùng! 🧩🌟",
          "🤖 LOTUS-X gợi ý: Sự thật luôn ẩn mình sau những màn sương của các giả định. Bốn mảnh ghép đang đóng vai trò là những chiếc la bàn định vị mức độ đồng điệu giữa suy nghĩ của bạn và bí mật cổ xưa... Hãy kiên nhẫn thử nghiệm từng giả thuyết, lắng nghe sự hồi đáp từ bốn góc nhìn, bức màn bí ẩn sẽ được vén lên! 🎯🗺️"
        ];
        text = subtleStage2Hints[Math.floor(Math.random() * subtleStage2Hints.length)];
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
          "🤖 LOTUS-X gợi ý: 'BỀN CHÍ - THỂ LỰC TỐT' không chỉ là câu khẩu hiệu, mà là quy luật để kích hoạt! Con chip thứ hai này đang chờ được hội ngộ với bảo vật từ Trạm 1... Đặt chúng song hành và để ánh mắt tìm kiếm những nét tương đồng giữa các con số. Khi gạn lọc những đường nét giao thoa của hai bên, một con số hoàn toàn mới sẽ khai mở trước mắt bạn! 💫💡"
        ];
        text = chipHints[Math.floor(Math.random() * chipHints.length)];
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
          "🤖 LOTUS-X gợi ý: 'SỨ MỆNH - TÌNH NGUYỆN' đòi hỏi một đôi mắt sắc bén và một tâm trí tĩnh tại. Dòng chuyển động liên hồi chỉ là bức màn đánh lừa thị giác... Nếu bạn quan sát thật sâu, sẽ thấy có những ký tự từ chối cuốn theo dòng chảy, âm thầm bám trụ tại vị trí của mình. Đó chính là những viên ngọc sáng! 🔮✨",
          "🤖 LOTUS-X gợi ý: Mọi thứ dường như đang trôi đi vội vã trong thước phim ấy... Nhưng chân lý thì luôn đứng yên một chỗ. Hãy để mắt bạn lọc bỏ hết những gì xê dịch, chỉ giữ lại những dấu hiệu bất động ngoan cường qua từng giây phút. Chúng đang chờ bạn gọi tên đấy! ⏳🔢",
          "🤖 LOTUS-X gợi ý: Bí mật không thuộc về kẻ chạy nhanh nhất, mà thuộc về điểm tựa vững chãi nhất. Đừng cố đếm những chuyển động hỗn loạn! Hãy tĩnh tâm, khóa chặt ánh nhìn vào những tọa độ không hề thay đổi giữa muôn vàn sự biến thiên... Trật tự đích thực đang ngự trị ở nơi tĩnh lặng ấy! 💫🎯"
        ];
        text = videoHints[Math.floor(Math.random() * videoHints.length)];
      }
      break;
    }

    case 5: {
      const isPaperQuery =
        query.includes('mảnh giấy') || query.includes('manh giay') ||
        query.includes('4 mảnh') || query.includes('bon manh') ||
        query.includes('tờ giấy') || query.includes('to giay') ||
        query.includes('4 tờ') || query.includes('bon to') ||
        query.includes('a4') || query.includes('tờ a4') ||
        query.includes('kí tự') || query.includes('ki tu') || query.includes('ký tự') || query.includes('ky tu') ||
        query.includes('đúng sai') || query.includes('dung sai') ||
        query.includes('vị trí') || query.includes('vi tri') ||
        query.includes('kho báu') || query.includes('kho bau') ||
        query.includes('phần thưởng') || query.includes('phan thuong');

      const isLetterQuery =
        query.includes('mật thư') || query.includes('mat thu') ||
        query.includes('bạch văn') || query.includes('bach van') ||
        query.includes('cách giải') || query.includes('cach giai') ||
        query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') ||
        query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('đáp án') || query.includes('dap an') ||
        query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('manh mối') || query.includes('manh moi') ||
        query.includes('giúp') || query.includes('giup');

      if (isPaperQuery) {
        const paperHints = [
          "🤖 LOTUS-X gợi ý: Bốn trang giấy từ bốn chặng đường không đơn thuần là những con số ngẫu nhiên. Chúng chính là chiếc la bàn đo lường độ chuẩn xác! Mỗi ký hiệu đang thầm thì cho bạn biết có bao nhiêu 'sự thật' đã xuất hiện, và có bao nhiêu con số đã tìm đúng 'tọa độ định mệnh' của mình... Hãy liên kết cả 4 mảnh ghép để giải mã vị trí tối thượng! 📜🧭",
          "🤖 LOTUS-X gợi ý: Đừng nhìn các ký hiệu trên 4 mảnh giấy như những phép tính rời rạc! Chúng là những lời phán quyết: cái nào đúng, cái nào sai, và có bao nhiêu con số đang ngự trị chuẩn xác ở ngôi thứ của nó. Hãy dùng tư duy loại trừ để gom nhặt những con số đứng đúng vị trí nhất dẫn lối tới kho báu! 🧩✨",
          "🤖 LOTUS-X gợi ý: 4 mảnh giấy là 4 manh mối của trò chơi thử thách trí tuệ tối thượng. Những con số bí ẩn kia biểu thị cho tỷ lệ chuẩn xác và số lượng vị trí đã được sắp đặt đúng đắn... Đối chiếu dữ kiện đúng – sai và vị trí của từng tờ, chìa khóa kho báu cuối cùng sẽ lộ diện trước mắt bạn! 🔮🗝️",
          "🤖 LOTUS-X gợi ý: Hãy liên kết cả 4 tờ giấy lại với nhau! Mỗi tờ mang một gợi ý về độ đúng sai cùng số lượng con số đã vào đúng vị trí hàng ngũ. Khi bạn tìm ra quy luật vị trí đích thực từ 4 gợi ý ấy, cánh cổng mở ra mã nguồn kho báu tại Trạm Phần Thưởng sẽ khai mở! 🌟🔓"
        ];
        text = paperHints[Math.floor(Math.random() * paperHints.length)];
      } else if (isLetterQuery) {
        const letterHints = [
          "🤖 LOTUS-X gợi ý: Đôi khi để tìm thấy đích đến, con người ta lại phải bắt đầu từ điểm kết thúc... Hãy thử đảo ngược dòng chảy thời gian, để ánh mắt lội ngược từ cuối dòng trở về điểm khởi nguyên xem bức màn bí ẩn có hé lộ không nhé! 🌀🔄",
          "🤖 LOTUS-X gợi ý: Bản mật thư này mang quy luật của một dòng nước chảy ngược. Đừng nhìn nó theo thói quen đọc thông thường từ trước ra sau... Thử đọc từ đuôi ngược về đầu, soi chiếu như qua một chiếc gương phản chiếu xem lời giải đáp có tự sáng tỏ! 🔮🪞",
          "🤖 LOTUS-X gợi ý: 'KẾT NỐI - HỘI NHẬP TỐT' là hành trình vượt qua lối mòn tư duy. Những con chữ trên bản mật thư dường như đang quay lưng lại với bạn... Hãy thử bước lùi lại một nhịp, đọc ngược từng ký tự từ điểm kết thúc trở về ban đầu để thấu tỏ thông điệp ẩn giấu! ⚡📜",
          "🤖 LOTUS-X gợi ý: Bí mật của mật thư Trạm 5 nằm ở trật tự bị đảo lộn. Nơi câu chữ kết thúc chính là nơi ý niệm bắt đầu... Hãy thử đổi chiều góc nhìn, duyệt từ phía sau ra phía trước xem thanh âm thực sự nào sẽ vang lên! 🎯🔍"
        ];
        text = letterHints[Math.floor(Math.random() * letterHints.length)];
      }
      break;
    }
  }

  if (text) {
    text = text.replace(/\*+/g, '');
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
        let text = data.choices?.[0]?.message?.content || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
        text = text.replace(/\*+/g, '');
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
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
        text = text.replace(/\*+/g, '');
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
