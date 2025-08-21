/**
 * Stop Tests Script
 * 
 * This script helps stop stuck test processes and clean up browser sessions.
 * Use this when tests get stuck in infinite loops or browser sessions are invalid.
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Stopping test processes and cleaning up...');

// Function to kill processes by name
function killProcess(processName) {
    return new Promise((resolve) => {
        const command = process.platform === 'win32' 
            ? `taskkill /f /im ${processName} 2>nul || echo No ${processName} processes found`
            : `pkill -f ${processName} || echo No ${processName} processes found`;
        
        exec(command, (error, stdout, stderr) => {
            if (stdout) console.log(stdout.trim());
            if (stderr) console.log(stderr.trim());
            resolve();
        });
    });
}

// Function to clean up temporary files
function cleanupTempFiles() {
    const tempDirs = ['screenshots', 'logs', 'allure-results', 'test-results'];
    
    tempDirs.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (fs.existsSync(dirPath)) {
            try {
                const files = fs.readdirSync(dirPath);
                if (files.length > 0) {
                    console.log(`Cleaning up ${dir} directory...`);
                    files.forEach(file => {
                        const filePath = path.join(dirPath, file);
                        try {
                            if (fs.statSync(filePath).isFile()) {
                                fs.unlinkSync(filePath);
                            }
                        } catch (err) {
                            // Ignore errors for individual files
                        }
                    });
                }
            } catch (err) {
                console.log(`Could not clean up ${dir}: ${err.message}`);
            }
        }
    });
}

// Main cleanup function
async function performCleanup() {
    console.log('1. Stopping Chrome processes...');
    await killProcess('chrome.exe');
    
    console.log('2. Stopping ChromeDriver processes...');
    await killProcess('chromedriver.exe');
    
    console.log('3. Stopping Node.js test processes...');
    await killProcess('node.exe');
    
    console.log('4. Cleaning up temporary files...');
    cleanupTempFiles();
    
    console.log('5. Checking for any remaining processes...');
    await killProcess('wdio');
    
    console.log('Cleanup completed!');
    console.log('');
    console.log('If you still have issues:');
    console.log('1. Restart your terminal/command prompt');
    console.log('2. Run: npm run clean:all');
    console.log('3. Try running the test again: npm test');
}

// Run cleanup
performCleanup().catch(error => {
    console.error('Error during cleanup:', error.message);
    process.exit(1);
}); 