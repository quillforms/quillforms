const gettextParser = require('gettext-parser');
const fs = require('fs');
const nodePath = require('path');

// Global storage for all translations across all files
const globalTranslations = new Map();

function cleanReference(reference) {
    return reference
        .replace(/\\/g, '/')
        .replace(/^.*?quillforms\/(.*)$/, '$1')
        .trim();
}

function createPOTData(headers = {}) {
    const defaultHeaders = {
        'Project-Id-Version': 'QuillForms',
        'Report-Msgid-Bugs-To': 'https://github.com/quillforms/quillforms/issues',
        'POT-Creation-Date': new Date().toISOString(),
        'PO-Revision-Date': 'YEAR-MO-DA HO:MI+ZONE',
        'Last-Translator': 'FULL NAME <EMAIL@ADDRESS>',
        'Language-Team': 'LANGUAGE <LL@li.org>',
        'Language': '',
        'MIME-Version': '1.0',
        'Content-Type': 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding': '8bit',
        'X-Generator': 'quillforms-babel-plugin-makepot',
        'Plural-Forms': 'nplurals=2; plural=(n != 1);',
        ...headers
    };

    return {
        charset: 'UTF-8',
        headers: defaultHeaders,
        translations: {
            '': {
                '': {
                    msgid: '',
                    msgstr: [
                        Object.entries(defaultHeaders)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n')
                    ]
                }
            }
        }
    };
}

function readExistingPOT(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return createPOTData();
        }
        const content = fs.readFileSync(filePath, 'utf8');
        const data = gettextParser.po.parse(Buffer.from(content));

        // Add existing translations to global cache
        Object.entries(data.translations).forEach(([context, translations]) => {
            Object.entries(translations).forEach(([msgid, translation]) => {
                if (msgid === '') return; // Skip header
                const key = `${context}|${msgid}`;
                const existingTranslation = globalTranslations.get(key);
                if (existingTranslation) {
                    // Merge references
                    const refs = new Set([
                        ...(existingTranslation.comments?.reference || '').split('\n'),
                        ...(translation.comments?.reference || '').split('\n')
                    ]);
                    translation.comments = {
                        ...translation.comments,
                        reference: Array.from(refs)
                            .filter(Boolean)
                            .map(cleanReference)
                            .sort()
                            .join('\n')
                    };
                }
                globalTranslations.set(key, translation);
            });
        });

        return data;
    } catch (error) {
        console.warn('Could not read existing POT file, creating new one');
        return createPOTData();
    }
}

function buildPOTFromGlobalTranslations(headers = {}) {
    const potData = createPOTData(headers);

    globalTranslations.forEach((translation, key) => {
        const [context, msgid] = key.split('|');
        if (!potData.translations[context]) {
            potData.translations[context] = {};
        }
        potData.translations[context][msgid] = translation;
    });

    return potData;
}

function writePOTFile(outputFile, headers) {
    try {
        // Create directory if it doesn't exist
        const dir = nodePath.dirname(outputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Read existing POT file to merge with global translations
        readExistingPOT(outputFile);

        // Build POT data from all collected translations
        const potData = buildPOTFromGlobalTranslations(headers);

        // Compile POT file
        const output = gettextParser.po.compile(potData);

        // Write to file
        fs.writeFileSync(outputFile, output);

    } catch (error) {
        console.error('Error processing POT file:', error);
        throw error;
    }
}

module.exports = function () {
    let currentFile = '';

    return {
        pre(file) {
            currentFile = file.opts.filename || 'unknown';
        },

        visitor: {
            CallExpression(path, state) {
                const callee = path.node.callee;
                if (callee.type !== 'Identifier') return;

                const functionName = callee.name;
                const validFunctions = {
                    __: ['msgid'],
                    _n: ['msgid', 'msgid_plural', 'count'],
                    _x: ['msgid', 'context'],
                    _nx: ['msgid', 'msgid_plural', 'count', 'context']
                };

                if (!validFunctions[functionName]) return;

                const args = path.node.arguments;
                const functionArgs = validFunctions[functionName];
                if (args.length < functionArgs.length) return;

                const translation = {
                    msgid: '',
                    msgstr: [''],
                    comments: {
                        reference: `${currentFile}:${path.node.loc.start.line}`
                    }
                };

                args.forEach((arg, index) => {
                    const paramName = functionArgs[index];
                    if (['msgid', 'msgid_plural', 'context'].includes(paramName)) {
                        if (arg.type === 'StringLiteral') {
                            if (paramName === 'context') {
                                translation.msgctxt = arg.value;
                            } else {
                                translation[paramName] = arg.value;
                            }
                        }
                    }
                });

                if (!translation.msgid) return;

                // Store in global translations map
                const context = translation.msgctxt || '';
                const key = `${context}|${translation.msgid}`;
                const existingTranslation = globalTranslations.get(key);

                if (existingTranslation) {
                    // Merge references
                    const refs = new Set([
                        ...(existingTranslation.comments?.reference || '').split('\n'),
                        ...(translation.comments?.reference || '').split('\n')
                    ]);
                    translation.comments.reference = Array.from(refs)
                        .filter(Boolean)
                        .map(cleanReference)
                        .sort()
                        .join('\n');
                }

                globalTranslations.set(key, translation);
            },

            Program: {
                exit(path, state) {
                    const outputFile = state.opts?.output;
                    const headers = state.opts?.headers || {};

                    if (outputFile) {
                        writePOTFile(outputFile, headers);
                    }
                }
            }
        }
    };
};