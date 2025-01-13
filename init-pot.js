const fs = require('fs');

const headers = `msgid ""
msgstr ""
"Project-Id-Version: QuillForms 2.0.0\\n"
"Report-Msgid-Bugs-To: https://github.com/quillforms/quillforms/issues\\n"
"POT-Creation-Date: 2024-01-12\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE\\n"
"Last-Translator: Mohamed Magdy\\n"
"Language-Team: LANGUAGE <LL@li.org>\\n"
"X-Generator: WP-CLI 2.8.1\\n"

`;

if (!fs.existsSync('languages')) {
    fs.mkdirSync('languages');
}

fs.writeFileSync('languages/quillforms-js.pot', headers);