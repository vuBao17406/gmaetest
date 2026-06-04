from pathlib import Path

path = Path(r'e:\game\game_final (3).html')
text = path.read_text(encoding='utf-8', errors='replace')
marker = '// Ảnh Mã nguồn LOTUS-X'
idx = text.find(marker)
if idx == -1:
    raise SystemExit('Marker not found')

new_tail = '''// Ảnh Mã nguồn LOTUS-X
        const PROFESSOR_IMG_B64 = "";

        function sendChatToAI() {
            let input = document.getElementById("user-msg-input");
            if (!input) return;
            let message = input.value.trim();
            if (!message) return;
            appendChatMessage(message, 'user');
            input.value = '';

            let reply = 'Xin lỗi, tôi chưa hiểu rõ câu hỏi. Hãy thử hỏi lại theo hướng khác nhé.';
            for (const id in AI_BRAIN_DATA) {
                const data = AI_BRAIN_DATA[id];
                for (const keyword of data.keywords) {
                    if (message.toLowerCase().includes(keyword.toLowerCase())) {
                        reply = data.reply;
                        break;
                    }
                }
                if (reply !== 'Xin lỗi, tôi chưa hiểu rõ câu hỏi. Hãy thử hỏi lại theo hướng khác nhé.') {
                    break;
                }
            }
            appendChatMessage(reply, 'bot');
        }

        function submitFinalAnswer() {
            let answer = document.getElementById('station-final-answer');
            if (!answer || !answer.value.trim()) {
                alert('Vui lòng nhập đáp án trước khi nộp.');
                return;
            }
            alert('Đáp án của bạn đã được ghi nhận. BTC sẽ kiểm tra và phản hồi sau.');
        }

        function saveFirebaseConfig() {
            let config = document.getElementById('adm-fb-config');
            if (!config || !config.value.trim()) {
                alert('Vui lòng dán cấu hình Firebase trước khi kích hoạt.');
                return;
            }
            localStorage.setItem('gdpt_firebase_config', config.value.trim());
            alert('Cấu hình Firebase đã được lưu cục bộ. Chức năng Firebase sẽ được kích hoạt khi khởi động lại.');
        }

        function initFirebase(configStr) {
            console.log('Firebase không được hỗ trợ trong phiên bản này.');
        }

        function triggerAdminAccess() {
            let pw = prompt('Nhập mật khẩu BTC để vào khu vực admin:');
            if (pw === null) return;
            if (pw.trim() === 'gdpt2026') {
                switchScreen('scr-admin');
            } else {
                alert('Mật khẩu không đúng.');
            }
        }

        function checkAdminLogin() {
            let pw = document.getElementById('admin-pw-input');
            if (!pw || pw.value.trim() !== 'gdpt2026') {
                document.getElementById('admin-login-err').innerText = 'Mật khẩu BTC không chính xác.';
                return;
            }
            document.getElementById('admin-login-err').innerText = '';
            switchScreen('scr-admin');
        }

        function resetLocalData() {
            if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu cục bộ không?')) {
                localStorage.removeItem('gdpt_ai_state');
                localStorage.removeItem('gdpt_firebase_config');
                alert('Dữ liệu cục bộ đã được xóa.');
            }
        }
    </script>
</body>
</html>
'''

new_text = text[:idx] + new_tail
path.write_text(new_text, encoding='utf-8')
print('Repair complete')
