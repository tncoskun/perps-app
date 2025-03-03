// scripts/copy-tradingview.js
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root paths
const SUBMODULE_ROOT = path.resolve(__dirname, '../app');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Define specific paths to copy
const COPY_PATHS = [
  {
    source: path.join(SUBMODULE_ROOT, 'tradingview/charting_library/bundles'),
    dest: path.join(PUBLIC_DIR, 'tradingview/charting_library/bundles')
  },
  {
    source: path.join(SUBMODULE_ROOT, 'tradingview/datafeeds/udf/dist/bundle.js'),
    dest: path.join(PUBLIC_DIR, 'tradingview/datafeeds/udf/dist/bundle.js')
  }
];

// Perform the copy operations
try {
  console.log('Copying TradingView files to public directory...');
  
  // Copy each path
  COPY_PATHS.forEach(({ source, dest }) => {
    // Check if source exists
    if (!fs.existsSync(source)) {
      console.error(`Source path does not exist: ${source}`);
      return;
    }
    
    // Create destination directory if needed
    fs.ensureDirSync(path.dirname(dest));
    
    // Check if we're copying a directory or file
    const stats = fs.statSync(source);
    if (stats.isDirectory()) {
      console.log(`Copying directory: ${source} -> ${dest}`);
      fs.copySync(source, dest, { overwrite: true });
    } else {
      console.log(`Copying file: ${source} -> ${dest}`);
      fs.copySync(source, dest, { overwrite: true });
    }
  });
  
  console.log('TradingView files copied successfully!');
} catch (error) {
  console.error('Error copying TradingView files:', error);
  process.exit(1);
}
