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
        console.log('📄 Serving content template for ID:', contentMatch[1]);
        const templatePath = path.join(__dirname, 'contents', 'contents-template.html');
        try {
            const template = fs.readFileSync(templatePath, 'utf8');
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
        
        // 캐시 헤더 설정
        const headers = { 'Content-Type': mimeTypes[ext] || 'text/plain' };
        
        // 정적 리소스에 대한 캐시 설정
        if (['.js', '.css', '.png', '.jpg', '.jpeg', '.avif', '.svg', '.woff', '.woff2'].includes(ext)) {
            headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        } else if (ext === '.html') {
            headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
        } else {
            headers['Cache-Control'] = 'public, max-age=3600';
        }
        
        res.writeHead(200, headers);
        res.end(data);
    } catch (err) {
        console.error('❌ File not found:', filePath);
        res.writeHead(404);
        res.end('File not found');
    }
}).listen(PORT);

console.log(`🚀 Server running at http://localhost:${PORT}/`);
console.log(`📁 Project root: ${__dirname}`);