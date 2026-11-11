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
          "🤖 LOTUS-X gợi ý: Trong hành trình 'TÂM SÁNG', không có sắc thái nào xuất hiện một cách tình cờ. Những con số rực rỡ ấy tựa như những nhịp đập ký ức phản chiếu từng miền đất của câu chuyện khởi nguyên... Hãy để tâm trí hồi tưởng lại tiến trình thời gian nơi thước phim mở màn, đối chiếu sự nối tiếp của từng gam màu; trật tự của chuyến hành trình năm xưa sẽ âm thầm định hình hàng ngũ cho các con số. 🌿✨",
          "🤖 LOTUS-X gợi ý: Vạn vật đều tuân theo dòng chảy của thời gian, và chiếc áo sắc màu trên từng con số cũng không hề đứng lẻ loi. Chúng tựa như linh hồn của những dấu mốc các bạn từng dừng chân trong câu chuyện dẫn đường... Hãy đặt chúng xuôi theo dòng tự sự của ký ức, nơi nào ghé lại trước, nơi nào đi qua sau; luồng sáng chân lý sẽ dần hiển lộ. 🔮🧭",
          "🤖 LOTUS-X gợi ý: Đôi mắt tinh tường sẽ nhận ra sợi chỉ vô hình nối liền hiện tại và quá khứ. Bốn gam màu các bạn nắm giữ tựa như bốn nốt nhạc vang lên theo nhịp bước của thước phim mở đầu... Hãy để tiến trình của chuyến phiêu lưu làm chiếc la bàn chỉ lối, đưa từng sắc thái hòa chung nhịp điệu thời gian; bức tranh bí mật sẽ tự khắc hoàn nguyên. 🌊💫",
          "🤖 LOTUS-X gợi ý: Bí mật không nằm ở giá trị lớn nhỏ, mà ẩn giấu trong dòng chảy ký ức của người dẫn đường. Thước phim khởi nguyên không đơn thuần là hình ảnh, mà là bản đồ những dấu mốc sắc màu tuần tự... Khi các bạn đặt từng con số về đúng tọa độ thời gian của câu chuyện ấy, dãy mật mã định mệnh sẽ tỏa sáng trọn vẹn. 🎯🗺️"
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
        query.includes('chữ số') || query.includes('chu so') ||
        query.includes('kí tự') || query.includes('ki tu') || query.includes('ký tự') || query.includes('ky tu') ||
        query.includes('kí hiệu') || query.includes('ki hieu') || query.includes('ký hiệu') || query.includes('ky hieu') ||
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
          "🤖 LOTUS-X gợi ý: Sự thật không đến từ những phỏng đoán may rủi mà thức tỉnh qua lăng kính của sự đối chiếu. Những ký hiệu trên bốn trang giấy tựa như lời hồi đáp âm thầm về mức độ tương thích của từng giả định... Hãy lắng nghe sự đồng thuận giữa các dữ kiện, kiên nhẫn loại suy những khả năng bất khả; dãy bốn chữ số bí ẩn sẽ tự khắc thành hình. 🔮💡",
          "🤖 LOTUS-X gợi ý: Tâm trí thông tuệ luôn biết nhìn thấu mối liên kết giữa những điều tưởng chừng rời rạc. Mỗi mảnh giấy trao cho bạn một mảnh phản chiếu của chân lý cổ xưa... Đừng giải quyết đơn lẻ từng phần, hãy để cả bốn mảnh thử thách và kiểm chứng lẫn nhau; điểm chạm chung nơi tất cả cùng hướng về chính là chìa khóa tối thượng. 🧩🌟",
          "🤖 LOTUS-X gợi ý: Bức màn bí mật sẽ dần vén mở khi mọi giả thuyết được soi rọi bởi tư duy loại trừ sắc bén. Bốn mảnh ghép mang theo những dấu hiệu định vị mức độ hòa hợp giữa phán đoán của bạn và thực tại... Hãy kết nối toàn bộ dữ kiện, gạn lọc đi những điều xung đột; chân tướng duy nhất sẽ tỏa sáng trong trật tự hoàn hảo. 🎯🗺️"
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
          "🤖 LOTUS-X gợi ý: Trong hành trình 'BỀN CHÍ', mọi bước tiến của hiện tại đều mang hơi thở của điểm xuất phát ban đầu. Con chip trên tay bạn không phải kẻ cô độc, mà mang tần số tương đồng với bảo vật từ chặng đầu tiên... Hãy đặt hai người bạn đồng hành ấy cạnh nhau, đối chiếu những đường nét giao thoa; luồng sáng của con số mới sẽ tự khắc hiện hình từ điểm chung ấy. ⚡🔢",
          "🤖 LOTUS-X gợi ý: Một mảnh ghép đơn lẻ chưa thể dệt nên lời giải đáp hoàn chỉnh. Linh kiện bí ẩn này tựa như một nửa bức tranh đang tìm kiếm người anh em song sinh từ Trạm 1... Hãy quan sát thật sâu đường nét trên thân hai vật phẩm, gạn lọc đi những nét đơn độc và giữ lại phần giao nhau đồng điệu; hình hài con số đích thực sẽ bừng sáng trước mắt bạn. 🧩🔍",
          "🤖 LOTUS-X gợi ý: Đôi khi chìa khóa của hiện tại lại cất giấu trong ký ức chặng khởi đầu. Hai con chip tựa như hai tấm gương cùng phản chiếu một thực thể bị phân tách... Hãy để chúng tương ngộ song hành, chắt lọc những đường nét trùng khớp cùng hiện diện ở cả hai bên; một con số hoàn toàn mới sẽ được khai sinh từ sự cộng hưởng kỳ diệu đó. 🔮✨",
          "🤖 LOTUS-X gợi ý: Sự kiên trì đối chiếu giữa chặng mở màn và chặng tiếp nối chính là quy luật kích hoạt bí mật. Vật phẩm thứ hai đang cất giữ nửa còn lại của thông điệp từ bảo vật chặng đầu... Đặt chúng cạnh nhau và tìm kiếm những nét vẽ giao thoa; chân lý sẽ tái sinh từ chính những điểm chung hoàn hảo ấy. 💫💡"
        ];
        text = chipHints[Math.floor(Math.random() * chipHints.length)];
      }
      break;
    }

    case 4: {
      const isPaperOrCylinder =
        query.includes('mảnh') || query.includes('manh') ||
        query.includes('giấy') || query.includes('giay') ||
        query.includes('tờ') || query.includes('to') ||
        query.includes('kí tự') || query.includes('ki tu') || query.includes('ký tự') || query.includes('ky tu') ||
        query.includes('chữ') || query.includes('chu') ||
        query.includes('trụ') || query.includes('tru') ||
        query.includes('quấn') || query.includes('quan') || query.includes('cuốn') || query.includes('cuon') ||
        query.includes('tâm') || query.includes('tam') || query.includes('giữa') || query.includes('giua') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('làm thế nào') || query.includes('lam the nao') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('chỉ') || query.includes('chi') || query.includes('hướng dẫn') || query.includes('huong dan') ||
        query.includes('mật thư') || query.includes('mat thu') || query.includes('mật mã') || query.includes('mat ma') ||
        query.includes('đáp án') || query.includes('dap an') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('giúp') || query.includes('giup') ||
        query.includes('giáo sư') || query.includes('giao su');

      if (isPaperOrCylinder) {
        const cylinderHints = [
          "🤖 LOTUS-X gợi ý: Trong hành trình 'SỨ MỆNH', không có thông điệp nào chịu bó hẹp trong một mặt phẳng đơn điệu. Mảnh giấy phẳng lặng kia tựa như dải lụa đang tìm kiếm một hình thể trụ tròn quen thuộc để uốn lượn và khép kín vòng tuần hoàn... Khi các con chữ đã quy tụ thành hàng lối, hãy hướng ánh nhìn vào nơi cân bằng nhất – điểm rơi trung tâm chính giữa của mỗi cụm ký tự sẽ cất lên tiếng nói đích thực. 🌀✨",
          "🤖 LOTUS-X gợi ý: Cái nhìn đa chiều luôn là chìa khóa phá tan màn sương của sự rời rạc. Dải ký tự bí ẩn này chỉ thực sự thức giấc khi được cuộn tròn nương theo thân của một vật hình trụ vững chãi... Sau khi các dòng chữ tìm thấy sự thẳng hàng, đừng vội nhìn vào hai đầu; luồng sáng chân thực luôn ngự trị tại tâm điểm đối xứng của từng nhóm chữ. 🧭💡",
          "🤖 LOTUS-X gợi ý: Chân lý thường ẩn mình sau sự chuyển hóa của không gian và điểm tựa. Hãy để mảnh giấy nương tựa quanh một đường cong hình trụ tròn bên mình để phá vỡ giới hạn hai chiều... Khi trật tự mới hiện ra qua từng dãy chữ cái, hãy lắng nghe nhịp đập ở vị trí cân bằng chính giữa của mỗi nhịp bước ký tự! 🧩🌟",
          "🤖 LOTUS-X gợi ý: Sự hòa hợp hoàn hảo luôn nằm ở điểm hội tụ của thế đối xứng. Khi dải mật bản chuyển mình thành một vòng cung khép kín ôm lấy một hình trụ tròn, các con chữ sẽ liên kết thành một thể thống nhất... Hãy để tâm trí tĩnh lặng và thu nhận điểm trung tâm của từng cụm ký tự; thông điệp ẩn giấu sẽ tự khắc bừng sáng rực rỡ. 🌟🔮"
        ];
        text = cylinderHints[Math.floor(Math.random() * cylinderHints.length)];
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
          "🤖 LOTUS-X gợi ý: Trong hành trình 'KẾT NỐI', không có dữ kiện nào từ bốn chặng đường là thừa thãi. Bốn trang mật bản tựa như bốn góc nhìn phản chiếu độ chuẩn xác của cùng một thực thể... Hãy đặt chúng cạnh nhau, đối chiếu những điểm giao thoa và gạn lọc dần những điều mâu thuẫn; con số định mệnh mở lối kho báu sẽ dần hiển lộ. 📜🧭",
          "🤖 LOTUS-X gợi ý: Cánh cổng kho báu chỉ mở ra trước một tư duy liên kết trọn vẹn và sắc bén. Bốn tờ giấy A4 chính là chiếc la bàn đo lường mức độ hòa hợp giữa từng giả định và chân lý... Đừng phân tích đơn lẻ từng mảnh, hãy để cả bốn dữ kiện bổ khuyết và thử thách lẫn nhau; điểm hội tụ duy nhất sẽ dẫn lối bạn tới phần thưởng tối thượng. 🧩✨",
          "🤖 LOTUS-X gợi ý: Bốn mảnh ghép từ bốn chặng đường đang nắm giữ những phản hồi thầm lặng về sự hiện diện và trật tự của chân lý. Hãy kết nối toàn bộ dữ kiện lại với nhau, dùng lý trí loại suy những điều xung đột... Khi mọi góc nhìn cùng đồng thuận tại một điểm chung, mật mã vinh quang sẽ lập tức tỏa sáng! 🌟🔓"
        ];
        text = paperHints[Math.floor(Math.random() * paperHints.length)];
      } else if (isLetterQuery) {
        const letterHints = [
          "🤖 LOTUS-X gợi ý: Trong hành trình 'KẾT NỐI', đôi khi để chạm tới khởi nguyên của chân lý, tâm trí lại phải bắt đầu từ nơi kết thúc. Bản mật thư này tựa như một dòng sông đang chảy ngược chiều thời gian, từ chối lối mòn nhìn nhận thông thường... Hãy thử để ánh mắt trôi từ bến cuối trở về nguồn cội; bức màn bí ẩn sẽ tự khắc vén mở. 🌀🔄",
          "🤖 LOTUS-X gợi ý: Một bước lùi về góc nhìn đôi khi lại là bước tiến lớn đến với sự thật. Những con chữ trên bản mật thư đang ẩn mình sau một trật tự đối nghịch với thói quen xuôi dòng... Khi bạn biết lật ngược dòng tự sự và lắng nghe từ điểm khép lại trở về ban đầu, thanh âm đích thực sẽ lập tức vang vọng. 🔮🪞",
          "🤖 LOTUS-X gợi ý: Sự hội nhập sâu sắc đòi hỏi khả năng thấu suốt từ chiều không gian đối lập. Nơi câu chữ dừng lại chính là nơi ý niệm bắt đầu hé lộ... Hãy thử đảo ngược hướng đi của đôi mắt từ cuối hành trình về điểm xuất phát; lời giải đáp bí mật sẽ tự nhiên hiển hiện trước mắt bạn. ⚡📜"
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
