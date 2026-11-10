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
  const sys = clientPayload.system || '';
  const station = (sys.includes('1') || sys.includes('TÂM SÁNG') || sys.includes('KHỞI CHÈO')) ? 1 :
    (sys.includes('2') || sys.includes('TRÍ MỞ') || sys.includes('VỮNG TAY')) ? 2 :
      (sys.includes('3') || sys.includes('BỀN CHÍ') || sys.includes('ĐỒNG TÂM')) ? 3 :
        (sys.includes('4') || sys.includes('SỨ MỆNH') || sys.includes('BỨT PHÁ')) ? 4 : 5;

  const messages = clientPayload.messages || [];
  const lastMessage = messages[messages.length - 1];
  const query = lastMessage ? lastMessage.content.toLowerCase() : '';

  let responseText = null;

  switch (station) {
    case 1: {
      const isColorOrPuzzle = 
        query.includes('màu') || query.includes('mau') ||
        query.includes('số') || query.includes('so') ||
        query.includes('mảnh') || query.includes('manh') ||
        query.includes('giấy') || query.includes('giay') ||
        query.includes('sắp xếp') || query.includes('sap xep') ||
        query.includes('thứ tự') || query.includes('thu tu') ||
        query.includes('ghép') || query.includes('ghep') ||
        query.includes('video') || query.includes('clip') || query.includes('câu chuyện') || query.includes('cau chuyen') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an');

      if (isColorOrPuzzle) {
        const colorHints = [
          "🤖 LOTUS-X gợi ý: Mỗi con số mang trên mình một màu áo riêng biệt, nhưng chúng không hề tồn tại ngẫu nhiên... Hãy nhớ lại câu chuyện về những vùng đất mà bước chân các bạn đã từng in dấu qua lăng kính của thước phim ban đầu. Nơi ấy có một dòng chảy sắc màu gồm bốn nhịp điệu... Hãy để trật tự của những gam màu dẫn lối cho vị trí của từng con số nhé! 🌈✨",
          "🤖 LOTUS-X gợi ý: Những con số rực rỡ kia đang chờ đợi một chiếc chìa khóa định hình trật tự. Đừng vội ghép nối bừa bãi! Hành trình các bạn đã đi qua trong câu chuyện video chính là tấm bản đồ... Có một dải màu bí mật ẩn hiện qua từng dấu mốc. Khi các bạn sắp đặt những con số đồng điệu theo đúng nhịp bước của dải màu ấy, cánh cửa giải mã sẽ tự khắc mở ra! 🎬🔢",
          "🤖 LOTUS-X gợi ý: 'TÂM SÁNG' cần một đôi mắt tinh tường để kết nối quá khứ và hiện tại. Màu sắc trên từng con số là linh hồn của những điểm chạm mà các bạn đã trải qua... Hãy hồi tưởng lại thước phim mở đầu, nơi bốn sắc thái khác biệt đã lần lượt xuất hiện theo dòng tự sự. Trình tự của câu chuyện ấy chính là trật tự đích thực của những con số! 🔮🧭",
          "🤖 LOTUS-X gợi ý: Bí mật không nằm ở giá trị lớn nhỏ của các con số, mà nằm ở sắc thái mà chúng khoác lên mình. Thước phim hành trình ban đầu không chỉ để chiêm ngưỡng – nó khắc họa một chuỗi màu sắc dẫn đường gồm bốn miền giao thoa... Hãy sắp xếp các con số theo đúng dòng chảy sắc màu của câu chuyện, điều kỳ diệu sẽ xuất hiện! 🌟🎨"
        ];
        responseText = colorHints[Math.floor(Math.random() * colorHints.length)];
      } else if (query.includes('chip') || query.includes('con chip') || query.includes('giáo sư') || query.includes('giao su') || query.includes('lotus-x') || query.includes('nguồn gốc') || query.includes('nguon goc') || query.includes('xuất xứ') || query.includes('xuat xu')) {
        responseText = "[PROF_IMG] Ah, câu hỏi tuyệt vời! 😄 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026, thuộc Kỷ Nguyên Vươn Mình Và Trí Tuệ Tỉnh Thức. Nhiệm vụ của tôi là lưu giữ dữ liệu lịch sử và lý tưởng BĐV qua hàng nghìn năm. ⚙️✨";
      }
      break;
    }

    case 2: {
      const isLogicOrProbability = 
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
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('mật mã') || query.includes('mat ma');

      if (isLogicOrProbability) {
        const logicHints = [
          "🤖 LOTUS-X gợi ý: Đừng nhìn bốn mảnh giấy ấy như những con số vô định, chúng thực chất là những chiếc la bàn đo lường độ chân thực... Mỗi dòng mật mã đang thầm thì cho bạn biết có bao nhiêu phần tử đã chính xác, và có bao nhiêu con số đã vào đúng ngôi vị của mình. Hãy đối chiếu các khả năng và dùng tư duy loại suy để tìm ra con số chân thật duy nhất nhé! 🧭🔢",
          "🤖 LOTUS-X gợi ý: 'TRÍ MỞ' chính là chìa khóa để nhìn thấu quy luật ẩn giấu. Bốn trang mật bản không bắt bạn phải tính toán phức tạp, mà là một cuộc đấu trí về khả năng và sự sàng lọc... Từng con số biểu thị cho mức độ đúng – sai và trật tự vị trí. Khi bạn phân tích từng khả năng và loại bỏ dần những điều mâu thuẫn, chân tướng cuối cùng sẽ tự khắc hiển lộ! 🧩💡",
          "🤖 LOTUS-X gợi ý: Bí mật nằm ở việc cân nhắc mọi kịch bản có thể xảy ra! Những ký hiệu kỳ lạ kia chính là lời phản hồi về độ chuẩn xác: có bao nhiêu con số đã hiện diện và bao nhiêu con số đã đứng đúng hàng ngũ... Đặt bốn mảnh ghép cạnh nhau, liên kết các dữ kiện để gạn lọc xác suất cao nhất, con số chiến thắng đang chờ bạn gọi tên! 🔮✨",
          "🤖 LOTUS-X gợi ý: Bốn mảnh giấy là bốn manh mối của một bàn cờ suy luận logic đỉnh cao. Mỗi dữ kiện trao cho bạn tỷ lệ của sự thật – đúng bao nhiêu và sai vị trí như thế nào. Đừng đoán mò bừa bãi! Hãy để tư duy xác suất và phép loại trừ dẫn lối, nơi giao nhau của cả bốn gợi ý chính là con số tối thượng! 🌟🎯"
        ];
        responseText = logicHints[Math.floor(Math.random() * logicHints.length)];
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
          "🤖 LOTUS-X gợi ý: 'SỨ MỆNH - TÌNH NGUYỆN' đòi hỏi một đôi mắt sắc bén và một tâm trí tĩnh tại. Dòng chuyển động liên hồi chỉ là bức màn đánh lừa thị giác... Nếu bạn quan sát thật sâu, sẽ thấy có những ký tự từ chối cuốn theo dòng chảy, âm thầm bám trụ tại vị trí của mình. Đó chính là những viên ngọc sáng! 🔮✨",
          "🤖 LOTUS-X gợi ý: Mọi thứ dường như đang trôi đi vội vã trong thước phim ấy... Nhưng chân lý thì luôn đứng yên một chỗ. Hãy để mắt bạn lọc bỏ hết những gì xê dịch, chỉ giữ lại những dấu hiệu bất động ngoan cường qua từng giây phút. Chúng đang chờ bạn gọi tên đấy! ⏳🔢",
          "🤖 LOTUS-X gợi ý: Bí mật không thuộc về kẻ chạy nhanh nhất, mà thuộc về điểm tựa vững chãi nhất. Đừng cố đếm những chuyển động hỗn loạn! Hãy tĩnh tâm, khóa chặt ánh nhìn vào những tọa độ không hề thay đổi giữa muôn vàn sự biến thiên... Trật tự đích thực đang ngự trị ở nơi tĩnh lặng ấy! 💫🎯"
        ];
        responseText = videoHints[Math.floor(Math.random() * videoHints.length)];
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
        responseText = paperHints[Math.floor(Math.random() * paperHints.length)];
      } else if (isLetterQuery) {
        const letterHints = [
          "🤖 LOTUS-X gợi ý: Đôi khi để tìm thấy đích đến, con người ta lại phải bắt đầu từ điểm kết thúc... Hãy thử đảo ngược dòng chảy thời gian, để ánh mắt lội ngược từ cuối dòng trở về điểm khởi nguyên xem bức màn bí ẩn có hé lộ không nhé! 🌀🔄",
          "🤖 LOTUS-X gợi ý: Bản mật thư này mang quy luật của một dòng nước chảy ngược. Đừng nhìn nó theo thói quen đọc thông thường từ trước ra sau... Thử đọc từ đuôi ngược về đầu, soi chiếu như qua một chiếc gương phản chiếu xem lời giải đáp có tự sáng tỏ! 🔮🪞",
          "🤖 LOTUS-X gợi ý: 'KẾT NỐI - HỘI NHẬP TỐT' là hành trình vượt qua lối mòn tư duy. Những con chữ trên bản mật thư dường như đang quay lưng lại với bạn... Hãy thử bước lùi lại một nhịp, đọc ngược từng ký tự từ điểm kết thúc trở về ban đầu để thấu tỏ thông điệp ẩn giấu! ⚡📜",
          "🤖 LOTUS-X gợi ý: Bí mật của mật thư Trạm 5 nằm ở trật tự bị đảo lộn. Nơi câu chữ kết thúc chính là nơi ý niệm bắt đầu... Hãy thử đổi chiều góc nhìn, duyệt từ phía sau ra phía trước xem thanh âm thực sự nào sẽ vang lên! 🎯🔍"
        ];
        responseText = letterHints[Math.floor(Math.random() * letterHints.length)];
      }
      break;
    }
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
