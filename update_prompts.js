const fs = require('fs');

let data = fs.readFileSync('index.html', 'utf8');

// Find the exact boundaries
const startMarker = '    const PROMPTS = {';
const endMarker = "    };\n\n    function addMsg";

const startIdx = data.indexOf(startMarker);
const endIdx = data.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  // Try with \r\n
  const endMarker2 = "    };\r\n\r\n    function addMsg";
  const endIdx2 = data.indexOf(endMarker2, startIdx);
  if (startIdx === -1 || endIdx2 === -1) {
    console.log('ERROR: Could not find markers. startIdx=' + startIdx + ' endIdx2=' + endIdx2);
    process.exit(1);
  }
  const before = data.substring(0, startIdx);
  const after = data.substring(endIdx2 + endMarker2.length);
  
  const newBlock = `    const PROMPTS = {
      1: \`Ban la LOTUS-X cua Chang 1. Nhiem vu cua ban o chang nay la KHONG ho tro.
LUON LUON tra loi duy nhat 1 cau cho MOI cau hoi: "🤖 Chang 1 khong can su dung chatbot. Cac ban hay no luc tu giai ma nhe! 🚀"\`,

      2: \`Ban la LOTUS-X cua Chang 2. Nhiem vu cua ban o chang nay la KHONG ho tro.
LUON LUON tra loi duy nhat 1 cau cho MOI cau hoi: "🤖 Chang 2 khong can su dung chatbot. Cac ban hay no luc tu giai ma nhe! 🚀"\`,

      3: \`PLACEHOLDER_3\`,

      4: \`PLACEHOLDER_4\`,

      5: \`PLACEHOLDER_5\`
    };\r\n\r\n    function addMsg`;
  
  data = before + newBlock + after;
  fs.writeFileSync('index.html', data, 'utf8');
  console.log('Phase 1 done (CRLF mode). Now replacing placeholders...');
} else {
  const before = data.substring(0, startIdx);
  const after = data.substring(endIdx + endMarker.length);
  
  const newBlock = `    const PROMPTS = {
      1: \`placeholder\`,
      2: \`placeholder\`,
      3: \`placeholder\`,
      4: \`placeholder\`,
      5: \`placeholder\`
    };\n\n    function addMsg`;
  
  data = before + newBlock + after;
  fs.writeFileSync('index.html', data, 'utf8');
  console.log('Phase 1 done (LF mode).');
}
