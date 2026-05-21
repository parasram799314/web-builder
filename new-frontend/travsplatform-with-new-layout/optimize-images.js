const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directories = [
  'public/assets',
  'src/assets'
];

async function optimize() {
  for (const dir of directories) {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const inputPath = path.join(dirPath, file);
        const fileName = path.parse(file).name;
        const outputPath = path.join(dirPath, `${fileName}.webp`);

        console.log(`Optimizing ${file}...`);
        try {
          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
          
          const oldSize = fs.statSync(inputPath).size;
          const newSize = fs.statSync(outputPath).size;
          console.log(`  Done! Size reduced: ${Math.round(oldSize/1024)}KB -> ${Math.round(newSize/1024)}KB`);
        } catch (err) {
          console.error(`  Error optimizing ${file}:`, err);
        }
      }
    }
  }
}

optimize();
