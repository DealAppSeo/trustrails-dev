const fs = require('fs');
const path = require('path');

const dirPath = __dirname;

let smallestFont = 999;
let replacedFonts = [];
let replacedColors = [];

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && (filePath.endsWith('.tsx') || filePath.endsWith('.ts'))) {
            callback(filePath);
        } else if (stat.isDirectory() && name !== 'node_modules' && name !== '.next' && name !== '.git') {
            walkSync(filePath, callback);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Color Replacements
    content = content.replace(/#475569/gi, () => { replacedColors.push('#475569'); return '#94a3b8'; });
    content = content.replace(/#64748b/gi, () => { replacedColors.push('#64748b'); return '#8b9ab0'; });
    content = content.replace(/#334155/gi, () => { replacedColors.push('#334155'); return '#64748b'; });

    // Font Size Replacements (string)
    content = content.replace(/fontSize:\s*['"]?(\d+)px['"]?/gi, (match, p1) => {
        let size = parseInt(p1);
        if (size < smallestFont) smallestFont = size;
        
        if (filePath.includes('layout.tsx') && size === 11) {
            size = 12; // Special case for footer
        } else {
            if (size < 13) size = 13;
            else if (size === 13) size = 14;
            else if (size === 14) size = 15;
        }
        return match.replace(p1, size.toString());
    });

    // Font Size Replacements (number)
    content = content.replace(/fontSize:\s*(\d+)/gi, (match, p1) => {
        let size = parseInt(p1);
        if (size > 50) return match; // ignore large numbers just in case
        if (size < smallestFont) smallestFont = size;
        
        if (size < 13) size = 13;
        else if (size === 13) size = 14;
        else if (size === 14) size = 15;
        return `fontSize: ${size}`;
    });

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath.replace(__dirname, '')}`);
    }
}

walkSync(dirPath, processFile);
console.log(`\nSmallest font found: ${smallestFont}px`);
