const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// MIME 타입 매핑
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml'
};

http.createServer((req, res) => {
    const url = req.url;
    console.log('📝 Request:', {
        url: url,
        method: req.method,
        timestamp: new Date().toISOString()
    });
    
    // /contents/{number} 패턴 체크
    const contentMatch = url.match(/^\/contents\/(\d+)$/);
    if (contentMatch) {
        const contentId = contentMatch[1];
        console.log('📄 Serving content template for ID:', contentId);
        
        try {
            // contents-data.js 파일에서 데이터 로드
            const dataPath = path.join(__dirname, 'scripts', 'contents-data.js');
            const dataContent = fs.readFileSync(dataPath, 'utf8');
            
            // cardData 객체 추출 (간단한 방법)
            const cardDataMatch = dataContent.match(/window\.cardData\s*=\s*({[\s\S]*?});/);
            if (!cardDataMatch) {
                throw new Error('cardData not found');
            }
            
            const cardData = eval(`(${cardDataMatch[1]})`);
            const contentData = cardData[contentId];
            
            if (!contentData) {
                res.writeHead(404);
                res.end('Content not found');
                return;
            }
            
            // 템플릿 로드
            const templatePath = path.join(__dirname, 'contents', 'contents-template.html');
            let template = fs.readFileSync(templatePath, 'utf8');
            
            // 메타태그 동적 생성
            const baseUrl = 'https://hicsters.com';
            const currentUrl = `${baseUrl}/contents/${contentId}`;
            const description = `${contentData.writer}: ${contentData.title}`;
            const imageUrl = `${baseUrl}/images/thumb/thumb-${contentId}.avif`;
            
            // 메타태그 HTML 생성
            const metaTags = `
    <meta name="description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Hiccsters">
    <meta property="og:title" content="Hicsters: ${contentData.title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${currentUrl}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${contentData.title} 썸네일">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Hicsters: ${contentData.title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">`;
            
            // 템플릿에 메타태그 삽입
            template = template.replace('</head>', `${metaTags}\n</head>`);
            
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(template);
            return;
        } catch (err) {
            console.error('❌ Template load error:', err);
            res.writeHead(500);
            res.end('Server Error');
            return;
        }
    }

    // 정적 파일 처리
    let filePath = path.join(__dirname, url);
    // 루트(/) 요청 시 index.html 반환
    if (url === '/' || url === '') {
        filePath = path.join(__dirname, 'index.html');
    }
    console.log('🔍 Looking for file:', filePath);
    try {
        const data = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(data);
    } catch (err) {
        console.error('❌ File not found:', filePath);
        res.writeHead(404);
        res.end('File not found');
    }
}).listen(PORT);

console.log(`🚀 Server running at http://localhost:${PORT}/`);
console.log(`📁 Project root: ${__dirname}`);