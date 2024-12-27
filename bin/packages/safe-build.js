const path = require('path');
const fs = require('fs-extra');
const glob = require('fast-glob');
const { spawn } = require('child_process');

async function safeBuild() {
    // 1. Create temporary backup of critical files
    const criticalFiles = await glob(['./packages/**/*(php|txt)', './packages/**/assets/**']);
    const backupDir = path.join(__dirname, '../.backup');
    await fs.ensureDir(backupDir);

    for (const file of criticalFiles) {
        const backupPath = path.join(backupDir, path.relative('./packages', file));
        await fs.copy(file, backupPath);
    }

    try {
        // 2. Run build
        await new Promise((resolve, reject) => {
            const build = spawn('node', ['./bin/packages/build.js'], {
                stdio: 'inherit'
            });

            build.on('close', code => {
                code === 0 ? resolve() : reject(new Error(`Build failed with code ${code}`));
            });
        });

        // 3. Restore critical files if they were removed
        for (const file of criticalFiles) {
            const backupPath = path.join(backupDir, path.relative('./packages', file));
            if (!fs.existsSync(file) && fs.existsSync(backupPath)) {
                await fs.copy(backupPath, file);
            }
        }
    } finally {
        // 4. Clean up backup
        await fs.remove(backupDir);
    }
}

safeBuild().catch(console.error);
