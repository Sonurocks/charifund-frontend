const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'node_modules', 'html2canvas', 'dist', 'html2canvas.esm.js'),
  path.join(__dirname, '..', 'node_modules', 'html2canvas', 'dist', 'html2canvas.js'),
  path.join(__dirname, '..', 'node_modules', 'html2canvas', 'dist', 'lib', 'css', 'types', 'color.js'),
];

const fallbackFunction = `
var _fallbackCanvas, _fallbackCtx;
var parseFallbackColor = function (value) {
    try {
        if (typeof document !== 'undefined') {
            if (!_fallbackCtx) {
                _fallbackCanvas = document.createElement('canvas');
                _fallbackCanvas.width = 1;
                _fallbackCanvas.height = 1;
                _fallbackCtx = _fallbackCanvas.getContext('2d', { willReadFrequently: true });
            }
            if (_fallbackCtx) {
                var serialized = value.name + '(' + (value.values || []).map(function (t) {
                    if (t.type === 17) return t.number;
                    if (t.type === 16) return t.number + '%';
                    if (t.type === 15) return t.number + (t.unit || '');
                    if (t.type === 4) return ', ';
                    if (t.type === 31) return ' ';
                    return t.value !== undefined ? t.value : '';
                }).join('') + ')';
                _fallbackCtx.clearRect(0, 0, 1, 1);
                _fallbackCtx.fillStyle = 'rgba(0, 0, 0, 0)';
                _fallbackCtx.fillStyle = serialized;
                _fallbackCtx.fillRect(0, 0, 1, 1);
                var img = _fallbackCtx.getImageData(0, 0, 1, 1).data;
                return ((img[0] << 24) | (img[1] << 16) | (img[2] << 8) | img[3]) >>> 0;
            }
        }
    } catch (_e) {}
    return 0x00000000;
};
`;

let patchedCount = 0;

targetFiles.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if already patched
  if (content.includes('parseFallbackColor')) {
    patchedCount++;
    return;
  }

  // Find the throw error statement
  const targetPattern = /var colorFunction = SUPPORTED_COLOR_FUNCTIONS\[value\.name\];\s*if \(typeof colorFunction === ['"]undefined['"]\) \{\s*throw new Error\([^)]+\);\s*\}/g;

  if (targetPattern.test(content)) {
    const replacement = `var colorFunction = SUPPORTED_COLOR_FUNCTIONS[value.name];
            if (typeof colorFunction === 'undefined') {
                return parseFallbackColor(value);
            }`;

    content = fallbackFunction + '\n' + content.replace(targetPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    patchedCount++;
  }
});

console.log(`[patch-html2canvas] Successfully verified/patched ${patchedCount} html2canvas distribution files.`);
