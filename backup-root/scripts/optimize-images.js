const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../temp-images'); // Directory with original images
const targetDir = path.join(__dirname, '../public/images'); // Output directory

// Create directories if they don't exist
if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
}
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const imageConfig = {
    width: 800,
    height: 600,
    fit: sharp.fit.cover,
    position: sharp.strategy.attention // Focus on the important parts of the image
};

const optimizeImage = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .resize(imageConfig.width, imageConfig.height, {
                fit: imageConfig.fit,
                position: imageConfig.position
            })
            .jpeg({
                quality: 85,
                mozjpeg: true
            })
            .toFile(outputPath);
        
        console.log(`✅ Successfully processed: ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`❌ Error processing ${path.basename(inputPath)}:`, error);
    }
};

const processAllImages = async () => {
    try {
        const files = fs.readdirSync(sourceDir);
        
        for (const file of files) {
            if (file.match(/\.(jpg|jpeg|png)$/i)) {
                const inputPath = path.join(sourceDir, file);
                const outputPath = path.join(targetDir, path.basename(file, path.extname(file)) + '.jpg');
                await optimizeImage(inputPath, outputPath);
            }
        }
        
        console.log('🎉 All images have been processed!');
    } catch (error) {
        console.error('Error processing images:', error);
    }
};

processAllImages(); 