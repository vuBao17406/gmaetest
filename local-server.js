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

  let text = null;

switch (station) {
    case 1: {
      const isChipOrProf = (query.includes('chip') || query.includes('con chip') || query.includes('giáo sư') || query.includes('giao su') || query.includes('lotus-x') || query.includes('nguồn gốc') || query.includes('nguon goc') || query.includes('xuất xứ') || query.includes('xuat xu')) && !query.includes('màu') && !query.includes('sắp xếp') && !query.includes('thứ tự') && !query.includes('oa') && !query.includes('viettel') && !query.includes('tammi');

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
        query.includes('bài viết') || query.includes('bai viet') ||
        query.includes('kênh') || query.includes('kenh') ||
        query.includes('thông tin') || query.includes('thong tin') ||
        query.includes('oa') || query.includes('viettel') || query.includes('tammi') ||
        query.includes('đoàn trường') || query.includes('doan truong') ||
        query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') ||
        query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') ||
        query.includes('làm thế nào') || query.includes('lam the nao') ||
        query.includes('hướng dẫn') || query.includes('huong dan') ||
        query.includes('ý nghĩa') || query.includes('y nghia') ||
        query.includes('manh mối') || query.includes('manh moi') || query.includes('gợi ý') || query.includes('goi y') ||
        query.includes('giúp') || query.includes('giup') || query.includes('đáp án') || query.includes('dap an') ||
        query.includes('mật mã') || query.includes('mat ma');

      if (isChipOrProf) {
        text = "Ah, câu hỏi tuyệt vời! 😄 Tôi là Cổ Máy LOTUS-X, được chế tạo bởi Giáo sư Lotus X vào năm 3026, thuộc Kỷ Nguyên Vươn Mình Và Trí Tuệ Tỉnh Thức. Nhiệm vụ của tôi là lưu giữ dữ liệu lịch sử và lý tưởng BĐV qua hàng nghìn năm. ⚙️✨";
      } else if (isColorOrPuzzle) {
        const colorHints = [
          "🤖 LOTUS-X gợi ý: Trong hành trình 'TÂM SÁNG', không có sắc màu nào đứng riêng rẽ. Những con số rực rỡ thu về sau các thử thách tựa như những nhịp đập ký ức đang tìm kiếm chiếc chìa khóa định hình trật tự... BTC đã âm thầm gửi gắm chiếc chìa khóa ấy trong bài viết trên kênh thông tin mới của đoàn trường là 'OA TUỔI TRẺ VIETTEL TAMMI'. Hãy ghé thăm nơi ấy, lắng đọng cùng thước phim và bài viết để dõi theo dòng chảy của 4 sắc màu; khi đối chiếu từng con số các bạn đang nắm giữ với thứ tự màu sắc ấy, dãy mật mã hoàn chỉnh sẽ tự khắc hiển lộ. 🌿✨",
          "🤖 LOTUS-X gợi ý: Chiếc chìa khóa mở lối cho những con số mang sắc màu không nằm ở nơi các bạn đang đứng, mà ẩn mình giữa làn sóng thông điệp mới. Hãy hướng tầm mắt về kênh thông tin của đoàn trường mang tên 'OA TUỔI TRẺ VIETTEL TAMMI'... Nơi bài viết mới nhất đang âm thầm cất giấu một chuỗi gồm 4 sắc thái tuần tự. Đối chiếu màu sắc của những con số các bạn đã thu thập được với trật tự xuất hiện nơi bài viết ấy, bức tranh mật mã sẽ hoàn nguyên trọn vẹn. 🔮🧭",
          "🤖 LOTUS-X gợi ý: Vạn vật đều có trật tự tương sinh, và các con số sau mỗi thử thách cũng đang tìm kiếm người dẫn lối. Hãy tìm về bài viết đặc biệt vừa được BTC đăng tải trên kênh 'OA TUỔI TRẺ VIETTEL TAMMI'... Dòng chảy sắc màu lồng ghép trong đó chính là chiếc la bàn soi sáng thứ tự của 4 gam màu. Đặt từng con số về đúng vị trí màu sắc tương ứng, thông điệp định mệnh của chặng 1 sẽ bừng sáng trước mắt bạn. 🌊💫",
          "🤖 LOTUS-X gợi ý: Bốn con số mang những sắc màu riêng biệt chính là linh hồn của chặng khởi đầu, nhưng chỉ khi liên kết với bài viết dẫn đường thì bí mật mới thức tỉnh. Tọa độ ấy đang được lưu giữ trong bài viết trên kênh thông tin mới 'OA TUỔI TRẺ VIETTEL TAMMI'... Hãy quan sát thật tinh tường chuỗi 4 màu sắc lồng ghép trong đó, sắp xếp các con số theo đúng vị trí màu sắc dẫn lối; hành trình TÂM SÁNG sẽ chính thức khai thông. 🎯🗺️"
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
        responseText = subtleStage2Hints[Math.floor(Math.random() * subtleStage2Hints.length)];
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
        responseText = chipHints[Math.floor(Math.random() * chipHints.length)];
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
        responseText = cylinderHints[Math.floor(Math.random() * cylinderHints.length)];
      }
      break;
    }

    case 5: {
      const isDone5 = Boolean(clientPayload.isDone5 || sys.includes('ĐÃ GIẢI THÀNH CÔNG'));

      const isBlue = query.includes('xanh') || query.includes('xanh dương') || query.includes('bảng chữ cái') || query.includes('bang chu cai') || query.includes('chữ cái') || query.includes('chu cai') || query.includes('dịch chuyển') || query.includes('dich chuyen') || query.includes('lùi') || query.includes('lui');

      const isRed = query.includes('đỏ') || query.includes('do') || query.includes('mica') || query.includes('chồng') || query.includes('chong') || query.includes('đặt chồng') || query.includes('dat chong') || query.includes('cộng') || query.includes('cong') || query.includes('cộng dồn') || query.includes('cong don');

      const isYellow = query.includes('vàng') || query.includes('vang') || query.includes('chấm đen') || query.includes('cham den') || query.includes('hướng') || query.includes('huong') || query.includes('đông') || query.includes('dong') || query.includes('tây') || query.includes('tay') || query.includes('nam') || query.includes('bắc') || query.includes('bac') || query.includes('đtnb') || query.includes('dtnb') || query.includes('la bàn') || query.includes('la ban') || query.includes('di chuyển') || query.includes('di chuyen') || query.includes('lộ trình') || query.includes('lo trinh');

      const isPurple = query.includes('tím') || query.includes('tim') || query.includes('dạ quang') || query.includes('da quang') || query.includes('dấu x') || query.includes('dau x') || query.includes('bản đồ') || query.includes('ban do') || query.includes('soi') || query.includes('ánh sáng') || query.includes('anh sang');

      const isTreasure = query.includes('kho báu') || query.includes('kho bau') || query.includes('phần thưởng') || query.includes('phan thuong') || query.includes('giấy màu') || query.includes('giay mau') || query.includes('tờ giấy') || query.includes('to giay') || query.includes('2 tờ') || query.includes('hai tờ') || query.includes('cùng màu') || query.includes('cung mau') || query.includes('màu sắc') || query.includes('mau sac') || query.includes('mật khẩu') || query.includes('mat khau') || query.includes('4 ô') || query.includes('bon o') || query.includes('mảnh giấy') || query.includes('manh giay') || query.includes('a4');

      const isLetterQuery = query.includes('mật thư') || query.includes('mat thu') || query.includes('bạch văn') || query.includes('bach van') || query.includes('bàn phím') || query.includes('ban phim') || query.includes('phím') || query.includes('phim') || query.includes('điện thoại') || query.includes('dien thoai') || query.includes('iphone') || query.includes('cách giải') || query.includes('cach giai') || query.includes('giải sao') || query.includes('giai sao') || query.includes('giải như thế nào') || query.includes('giai nhu the nao') || query.includes('làm sao') || query.includes('lam sao') || query.includes('gợi ý') || query.includes('goi y') || query.includes('manh mối') || query.includes('manh moi') || query.includes('giúp') || query.includes('giup');

      if (!isDone5) {
        // Chưa giải xong mật thư Chặng 5: Từ chối tiết lộ thông tin phần thưởng
        if (isBlue || isRed || isYellow || isPurple || isTreasure) {
          const lockedRewardHints = [
            "🤖 LOTUS-X thông báo: Cánh cửa kho báu tối thượng Chặng 5 vẫn đang được phong tỏa nghiêm ngặt! 🔐✨ Để đánh thức bí mật của các sắc màu và phần thưởng vĩ đại, trước tiên đội của bạn phải giải mã thành công bản Mật thư Chặng 5 do Ban Tổ chức phát và gửi đáp án chính xác lên hệ thống. Hãy dồn toàn tâm trí vượt qua cửa ải mật thư này trước nhé!",
            "🤖 LOTUS-X thông báo: Nguồn năng lượng giải mã phần thưởng Chặng 5 chưa được kích hoạt! ⚡ Bạn cần giải phóng phong ấn của Mật thư Chặng 5 trước tiên. Hãy quan sát thật kỹ các ký tự trên mật thư BTC trao và giải mã thành công; khi hệ thống ghi nhận hoàn thành Chặng 5, mọi bí mật về các sắc màu định mệnh sẽ tự động khai mở! 📜🧭",
            "🤖 LOTUS-X thông báo: Dữ liệu về phần thưởng và kho báu Chặng 5 hiện đang ở trạng thái khóa mã! 🛡️ Chìa khóa duy nhất để mở khóa tầng thông tin này là đáp án chính xác của Mật thư Chặng 5. Hãy hoàn thành việc giải mật thư và xác nhận hoàn thành chặng trên hệ thống, tôi sẽ lập tức đồng hành cùng bạn chinh phục kho báu! 💎🌟"
          ];
          text = lockedRewardHints[Math.floor(Math.random() * lockedRewardHints.length)];
        } else if (isLetterQuery) {
          const letterHints = [
            "🤖 LOTUS-X gợi ý: Trong hành trình 'KẾT NỐI', đôi khi chiếc chìa khóa vĩ đại nhất lại nằm ngay nơi thiết bị mang biểu tượng trái táo khuyết trong lòng bàn tay các bạn. Hãy mở giao diện bàn phím số quen thuộc của chiếc điện thoại ấy – nơi những con chữ latin nép mình bên dưới từng con số tròn trịa... Sự đối chiếu tương ngộ giữa chữ và số trên từng phím chạm sẽ tự khắc vén mở bức màn bí mật của Chặng 5. 📱🍎✨",
            "🤖 LOTUS-X gợi ý: Bí mật của chặng cuối là sự giao thoa kỳ diệu giữa thông điệp cổ điển và giao diện công nghệ hiện đại. Bản mật thư này đang chờ đợi được soi chiếu qua lăng kính bàn phím số của chiếc điện thoại nhà Táo... Nơi các phím bấm kinh điển cưu mang cả những con số lẫn các ký tự ngôn từ; hãy để chúng tương ngộ và hoán đổi cho nhau, lời giải đáp đích thực sẽ bừng sáng. 🔮💬",
            "🤖 LOTUS-X gợi ý: Chiếc la bàn dẫn lối không ở đâu xa, mà ẩn mình sau những phím chạm tinh tế của chiếc điện thoại iPhone bạn luôn mang bên mình. Hãy mở giao diện bấm số cuộc gọi quen thuộc, quan sát sự gắn kết giữa chữ cái và con số trên từng phím bấm; mỗi tọa độ số sẽ gọi tên một ký tự đích thực để hoàn nguyên mật thư. ⚡🧭",
            "🤖 LOTUS-X gợi ý: Khởi nguyên của thông điệp Chặng 5 ẩn sau sự quy ước giữa những con số và chữ cái trên màn hình chạm của người bạn mang biểu tượng quả táo cắn dở. Hãy đối chiếu các ký tự mật thư với vị trí của chúng trên bàn phím số cuộc gọi ấy; sự đồng điệu công nghệ ấy chính là chìa khóa mở toang cánh cửa cuối cùng. 🎯📜"
          ];
          text = letterHints[Math.floor(Math.random() * letterHints.length)];
        }
      } else {
        // Đã giải xong mật thư Chặng 5: Mở khóa hướng dẫn giải phần thưởng
        if (isBlue) {
          const blueHints = [
            "🤖 LOTUS-X gợi ý: Trong hành trình 'KẾT NỐI', sắc xanh dương mang linh hồn của những bước lùi thời gian. Những con chữ các bạn nắm giữ dường như đang khoác lên một mật mã dịch chuyển... Thử để mỗi ký tự lùi lại một vài nhịp bước trên dòng hành trình chữ cái alphabet (A–Z) quen thuộc; hình hài con số bí ẩn sẽ tự khắc khai sinh từ chính những ký tự nguyên bản ấy. 🌊🔤",
            "🤖 LOTUS-X gợi ý: Với sắc xanh dương, đôi khi lùi bước lại là chìa khóa để tiến tới chân lý. Thông điệp trên trang giấy đang ẩn sau một quy luật hoán vị của bảng chữ cái tiếng Anh... Hãy thử đảo ngược bánh xe chữ cái về phía trước vài vị trí cố định; những con chữ ẩn mình sẽ trả về con số đích thực mà các bạn đang tìm kiếm. 🔷📖",
            "🤖 LOTUS-X gợi ý: Đừng vội đọc những con chữ sắc xanh theo lẽ thông thường. Hãy lắng nghe dòng chảy ngược dòng của bảng mẫu tự alphabet, đưa mỗi ký tự lùi về vài nhịp bước quá khứ; một thông điệp sáng tỏ sẽ định hình nên con số mở kho báu. 🌐✨"
          ];
          text = blueHints[Math.floor(Math.random() * blueHints.length)];
        } else if (isRed) {
          const redHints = [
            "🤖 LOTUS-X gợi ý: Sắc đỏ của nhiệt huyết chỉ tỏa sáng trọn vẹn khi có sự giao thoa giữa hai tầng thực thể. Tấm màng trong suốt các bạn nắm giữ tựa như chiếc gương định vị ánh sáng... Hãy đặt khớp nối tấm mica ấy lên trang giấy màu đỏ một cách chuẩn xác; những nét vẽ giao duyên sẽ hòa làm một, gom góp và cộng dồn lại để định hình nên con số quyền lực. 🔴✨",
            "🤖 LOTUS-X gợi ý: Chân lý sắc đỏ nằm ở sự cộng hưởng không gian. Khi tấm màng mica trong suốt tìm thấy điểm tựa vừa vặn trên bề mặt trang giấy đỏ, những nét ký họa rời rạc sẽ lập tức hội tụ thành những phép tính diệu kỳ... Hãy cộng dồn những giá trị xuất hiện sau lớp màng ấy để tìm ra con số đích thực. 🟥🔍",
            "🤖 LOTUS-X gợi ý: Tấm mica không che khuất tầm nhìn, mà là lăng kính hội tụ cho trang giấy sắc đỏ. Đặt tấm màng trong suốt chồng khít lên giấy, quan sát những điểm giao thoa và cộng dồn các giá trị hiển lộ; con số mở lối sẽ hiện ra trước mắt bạn. 🧭❤️"
          ];
          text = redHints[Math.floor(Math.random() * redHints.length)];
        } else if (isYellow) {
          const yellowHints = [
            "🤖 LOTUS-X gợi ý: Sắc vàng của trí tuệ khởi hành từ những chấm đen tĩnh lặng và bước chuyển mình của các phương hướng. Chiếc la bàn trong tay các bạn chính là kim chỉ nam định hướng hành trình... Hãy lần theo những bước dịch chuyển Đ–T–N–B từ điểm khởi đầu; mỗi nhịp bước trên lưới tọa độ sẽ dần dệt nên đường nét của con số bí mật. 🟡🧭",
            "🤖 LOTUS-X gợi ý: Tấm giấy vàng là một mê cung phương hướng đang chờ chiếc la bàn đánh thức. Lắng nghe tiếng gọi của bốn phương Đông – Tây – Nam – Bắc, di chuyển từng bước chuẩn xác từ vị trí chấm đen ban đầu; hành trình bạn vẽ nên sẽ kết tinh thành con số cần tìm. 🟨🗺️",
            "🤖 LOTUS-X gợi ý: Không có bước chân nào là vô nghĩa trên trang giấy sắc vàng. Khi la bàn xoay chuyển và từng tọa độ Đông – Tây – Nam – Bắc được kết nối liền mạch từ điểm đen xuất phát, một con số hoàn chỉnh sẽ tự khắc lộ diện. ☀️🧭"
          ];
          text = yellowHints[Math.floor(Math.random() * yellowHints.length)];
        } else if (isPurple) {
          const purpleHints = [
            "🤖 LOTUS-X gợi ý: Sắc tím huyền bí đòi hỏi một nguồn sáng đặc biệt để đánh thức những dấu tích đang say ngủ. Tấm bản đồ kia chỉ thực sự cất lời khi gặp được tia sáng dạ quang khai mở... Hãy soi tỏ màn đêm để tìm kiếm những điểm giao thoa hình dấu X đang ẩn mình; số lượng những dấu ấn kỳ diệu các bạn đếm được chính là chiếc chìa khóa số của sắc tím. 🟣🔍",
            "🤖 LOTUS-X gợi ý: Dưới ánh sáng thường, tấm bản đồ màu tím giữ trọn sự trầm mặc, nhưng ngọn đèn dạ quang sẽ soi tỏ những tọa độ bí mật. Hãy quan sát thật kỹ từng dấu X phát sáng được đánh dấu trên bản đồ; chính tổng số lượng những điểm giao nhau ấy sẽ trao cho bạn con số định mệnh. 🔮🗺️",
            "🤖 LOTUS-X gợi ý: Ánh sáng huyền ảo của bút dạ quang chính là chiếc chìa khóa đánh thức bí mật sắc tím. Khi soi tỏ lên bản đồ, những dấu tích chữ X sẽ lần lượt xuất hiện; hãy đếm trọn vẹn số lượng của chúng, con số ấy sẽ đưa bạn tới gần kho báu hơn một bước. 💜🔦"
          ];
          text = purpleHints[Math.floor(Math.random() * purpleHints.length)];
        } else if (isTreasure) {
          const treasureHints = [
            "🤖 LOTUS-X gợi ý: Trong suốt hành trình hội tụ về Chặng 5, mỗi chặng dừng chân đều để lại cho các bạn những gợi ý trên hai tờ giấy sắc màu. Hãy nhớ rằng hai tờ giấy cùng một màu sắc mới dệt nên một bộ gợi ý hoàn chỉnh để mở ra một con số duy nhất... Bốn sắc màu (xanh dương, đỏ, vàng, tím) tương ứng với bốn quy luật giải mã riêng biệt; khi bốn con số cùng quy tụ vào các ô màu định mệnh, kho báu vĩ đại sẽ mở ra! 🌈💎",
            "🤖 LOTUS-X gợi ý: Cánh cửa kho báu tối thượng đòi hỏi sự kết hợp của 4 con số tương ứng với 4 sắc màu mà các bạn đã thu thập qua các chặng. Mỗi sắc màu đại diện cho một cách thức giải mã độc lập: xanh dương chuyển dịch ký tự, đỏ chồng ghép mica cộng dồn, vàng vạch lộ trình theo la bàn, và tím soi sáng dấu tích bản đồ... Hãy đối chiếu từng cặp giấy cùng màu để hoàn thiện chiếc chìa khóa cuối cùng. 🗝️✨"
          ];
          text = treasureHints[Math.floor(Math.random() * treasureHints.length)];
        } else if (isLetterQuery) {
          const letterHints = [
            "🤖 LOTUS-X gợi ý: Trong hành trình 'KẾT NỐI', đôi khi chiếc chìa khóa vĩ đại nhất lại nằm ngay nơi thiết bị mang biểu tượng trái táo khuyết trong lòng bàn tay các bạn. Hãy mở giao diện bàn phím số quen thuộc của chiếc điện thoại ấy – nơi những con chữ latin nép mình bên dưới từng con số tròn trịa... Sự đối chiếu tương ngộ giữa chữ và số trên từng phím chạm sẽ tự khắc vén mở bức màn bí mật của Chặng 5. 📱🍎✨",
            "🤖 LOTUS-X gợi ý: Bí mật của chặng cuối là sự giao thoa kỳ diệu giữa thông điệp cổ điển và giao diện công nghệ hiện đại. Bản mật thư này đang chờ đợi được soi chiếu qua lăng kính bàn phím số của chiếc điện thoại nhà Táo... Nơi các phím bấm kinh điển cưu mang cả những con số lẫn các ký tự ngôn từ; hãy để chúng tương ngộ và hoán đổi cho nhau, lời giải đáp đích thực sẽ bừng sáng. 🔮💬",
            "🤖 LOTUS-X gợi ý: Chiếc la bàn dẫn lối không ở đâu xa, mà ẩn mình sau những phím chạm tinh tế của chiếc điện thoại iPhone bạn luôn mang bên mình. Hãy mở giao diện bấm số cuộc gọi quen thuộc, quan sát sự gắn kết giữa chữ cái và con số trên từng phím bấm; mỗi tọa độ số sẽ gọi tên một ký tự đích thực để hoàn nguyên mật thư. ⚡🧭",
            "🤖 LOTUS-X gợi ý: Khởi nguyên của thông điệp Chặng 5 ẩn sau sự quy ước giữa những con số và chữ cái trên màn hình chạm của người bạn mang biểu tượng quả táo cắn dở. Hãy đối chiếu các ký tự mật thư với vị trí của chúng trên bàn phím số cuộc gọi ấy; sự đồng điệu công nghệ ấy chính là chìa khóa mở toang cánh cửa cuối cùng. 🎯📜"
          ];
          text = letterHints[Math.floor(Math.random() * letterHints.length)];
        }
      }
      break;
    }
  }

  if (text) {
    text = text.replace(/\*+/g, '').replace(/\[PROF_IMG\]/g, '').trim();
    return { content: [{ type: 'text', text: text }] };
  }
  return null; // Không khớp từ khóa → fallback sang API AI
}

// ═══════════════════════════════════════════════════════════
// GROQ API PROXY
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// HỖ TRỢ PHÂN LUỒNG NHIỀU API KEY THEO ĐỘI CHƠI (LOAD BALANCING + FAILOVER)
// ═══════════════════════════════════════════════════════════
function parseKeyList(envListVal, envSingleVal) {
  const combined = (envListVal || '') + ',' + (envSingleVal || '');
  return combined
    .split(/[,;\n]+/)
    .map(k => k.trim())
    .filter(k => k && !k.startsWith('your_') && k.length > 5);
}

function getTeamKeyIndex(teamName, totalKeys) {
  if (!teamName || totalKeys <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = ((hash << 5) - hash) + teamName.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % totalKeys;
}

async function handleGroq(groqKeysInput, clientPayload) {
  const groqKeys = Array.isArray(groqKeysInput) ? groqKeysInput : [groqKeysInput];
  const teamName = (clientPayload.team || 'guest').trim();
  const startKeyIdx = getTeamKeyIndex(teamName, groqKeys.length);

  const messages = [];
  if (clientPayload.system) {
    messages.push({ role: 'system', content: clientPayload.system });
  }
  for (const msg of (clientPayload.messages || [])) {
    messages.push({ role: msg.role, content: msg.content });
  }

  const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

  for (let offset = 0; offset < groqKeys.length; offset++) {
    const keyIdx = (startKeyIdx + offset) % groqKeys.length;
    const currentApiKey = groqKeys[keyIdx];
    const isFailover = offset > 0;
    console.log(`[Groq Pool] Đội "${teamName}" -> Luồng/Key #${keyIdx + 1}/${groqKeys.length}${isFailover ? ' (Failover dự phòng)' : ''}`);

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
            'Authorization': `Bearer ${currentApiKey}`
          },
          body: JSON.stringify(groqPayload)
        });

        if (groqResponse.ok) {
          return groqResponse;
        }

        if (groqResponse.status === 429) {
          console.warn(`[Groq 429 Rate Limit] Luồng #${keyIdx + 1} hết hạn mức, đang chuyển sang luồng tiếp theo...`);
          break; // chuyển sang key tiếp theo ngay
        }
      } catch (err) {
        console.error(`[Groq ${model} Error trên Luồng #${keyIdx + 1}]`, err.message);
      }
    }
  }

  return { ok: false, json: async () => ({ error: 'All Groq keys failed' }) };
}

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
        const groqKeys = parseKeyList(process.env.GROQ_API_KEYS, process.env.GROQ_API_KEY);
        const openrouterKeys = parseKeyList(process.env.OPENROUTER_API_KEYS, process.env.OPENROUTER_API_KEY);
        const isValid = k => k && !k.startsWith('your_') && k !== '';

        // ─── GROQ POOL (Chia luồng theo Đội + Tự động Failover) ───
        if (groqKeys.length > 0) {
          const groqRes = await handleGroq(groqKeys, clientPayload);
          const data = await groqRes.json();
          if (groqRes.ok) {
            let text = data.choices?.[0]?.message?.content || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
            text = text.replace(/\*+/g, '').replace(/\[PROF_IMG\]/g, '').trim();
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
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tín hiệu nhiễu... Thử lại nhé! 📡';
            text = text.replace(/\*+/g, '').replace(/\[PROF_IMG\]/g, '').trim();
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
            if (data.content && Array.isArray(data.content)) {
              data.content.forEach(c => { if (c.type === 'text' && c.text) c.text = c.text.replace(/\*+/g, ''); });
            }
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
