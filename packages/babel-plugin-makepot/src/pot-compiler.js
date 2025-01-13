const fs = require('fs');
const path = require('path');
const gettextParser = require('gettext-parser');

function mergePotContents(contents) {
    if (!contents || !contents.length) return null;

    const merged = gettextParser.po.parse(contents[0]);

    for (let i = 1; i < contents.length; i++) {
        const current = gettextParser.po.parse(contents[i]);

        Object.keys(current.translations).forEach(context => {
            if (!merged.translations[context]) {
                merged.translations[context] = {};
            }

            Object.keys(current.translations[context]).forEach(msgid => {
                const translation = current.translations[context][msgid];
                if (!merged.translations[context][msgid]) {
                    merged.translations[context][msgid] = translation;
                } else {
                    // Merge references
                    const existingRefs = merged.translations[context][msgid].comments.reference.split('\n');
                    const newRefs = translation.comments.reference.split('\n');
                    merged.translations[context][msgid].comments.reference =
                        [...new Set([...existingRefs, ...newRefs])].sort().join('\n');
                }
            });
        });
    }

    return gettextParser.po.compile(merged);
}

// This should be called after your build process
function compilePotFile(outputPath) {
    if (!global.__POT_CONTENTS || !global.__POT_CONTENTS.length) return;

    const mergedContent = mergePotContents(global.__POT_CONTENTS);
    if (!mergedContent) return;

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // If file exists, merge with existing content
    if (fs.existsSync(outputPath)) {
        const existing = fs.readFileSync(outputPath);
        const existingData = gettextParser.po.parse(existing);
        const newData = gettextParser.po.parse(mergedContent);

        // Merge translations
        Object.keys(newData.translations).forEach(context => {
            if (!existingData.translations[context]) {
                existingData.translations[context] = {};
            }

            Object.keys(newData.translations[context]).forEach(msgid => {
                const translation = newData.translations[context][msgid];
                if (!existingData.translations[context][msgid]) {
                    existingData.translations[context][msgid] = translation;
                } else {
                    // Merge references
                    const existingRefs = existingData.translations[context][msgid].comments.reference.split('\n');
                    const newRefs = translation.comments.reference.split('\n');
                    existingData.translations[context][msgid].comments.reference =
                        [...new Set([...existingRefs, ...newRefs])].sort().join('\n');
                }
            });
        });

        fs.writeFileSync(outputPath, gettextParser.po.compile(existingData));
    } else {
        fs.writeFileSync(outputPath, mergedContent);
    }

    // Clear the global storage
    global.__POT_CONTENTS = [];
}

module.exports = compilePotFile;