const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// --- 🛠️ 設定區域 (已更新輸出位置) ---

// 1. 原圖位置
const INPUT_BASE = './images'; 

// 2. 輸出位置 (改為放返入 images 資料夾)
const OUTPUT_BASE = './images'; 

// 3. 要處理的分類
const CATEGORIES = [
    'UIUX',
    'Graphic',
    '3D',
    'AI'
    // 'Video' // 如果有需要
];

const MAX_HEIGHT = 1080;
const QUALITY = 80;

// -------------------

console.log(`🚀 開始 Work Portfolio 批量壓縮 (Output to images folder)...`);

// 確保 Output Base 存在 (其實 ./images 一定存在，但照寫無妨)
if (!fs.existsSync(OUTPUT_BASE)) {
    fs.mkdirSync(OUTPUT_BASE, { recursive: true });
}

CATEGORIES.forEach(folder => {
    const inputDir = path.join(INPUT_BASE, folder);
    
    // 輸出路徑變成: images/Graphic_optimized
    const outputDir = path.join(OUTPUT_BASE, `${folder}_optimized`); 

    if (!fs.existsSync(inputDir)) {
        console.warn(`⚠️  搵唔到來源資料夾: ${inputDir} (跳過)`);
        return;
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`\n📂 正在處理: ${folder}...`);

    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error(`❌ 無法讀取: ${inputDir}`, err);
            return;
        }

        let count = 0;
        files.forEach(file => {
            if (file.match(/\.(jpg|jpeg|png|webp|tiff|JPG|JPEG|PNG)$/)) {
                const inputPath = path.join(inputDir, file);
                const outputFilename = file.split('.')[0] + '.jpg'; 
                const outputPath = path.join(outputDir, outputFilename);

                sharp(inputPath)
                    .rotate()
                    .resize({ height: MAX_HEIGHT, withoutEnlargement: true })
                    .jpeg({ quality: QUALITY, mozjpeg: true }) 
                    .toFile(outputPath)
                    .then(() => {
                        count++;
                    })
                    .catch(err => {
                        console.error(`   ❌ 失敗: ${file}`, err);
                    });
            }
        });
        console.log(`   ✨ 已排程處理 ${files.length} 張圖片 -> ${outputDir}`);
    });
});