<?php
/**
 * Translation Generation Script
 * 
 * Run this script from the plugin root directory:
 * php tools/translate.php
 */

// Get plugin root directory (two levels up from this script)
define( 'QUILLFORMS_PLUGIN_DIR', dirname( dirname( __FILE__ ) ) . '/' );

// First, we need to set up WordPress environment
require_once dirname( dirname( dirname( QUILLFORMS_PLUGIN_DIR ) ) ) . '/wp-load.php';

$api_key = 'AIzaSyAlBxjgbS54nlvrO6r4YyG2yrJHSk08284';
$locales = [
    'es_ES',
    'fr_FR',
    'de_DE',
    'it_IT',
    'pt_BR',
    'nl_NL',
    'ru_RU',
    'ar',
    'ja',
    'zh_CN'
];

// Make sure languages directory exists
$languages_dir = QUILLFORMS_PLUGIN_DIR . 'languages';
if ( ! file_exists( $languages_dir ) ) {
    mkdir( $languages_dir, 0755, true );
}

echo "Starting translation generation...\n";
echo "Plugin Directory: " . QUILLFORMS_PLUGIN_DIR . "\n";
echo "Languages Directory: " . $languages_dir . "\n\n";

foreach ($locales as $locale) {
    echo "Processing locale: $locale\n";
    
    // For PHP translations
    $command = sprintf(
        'wp i18n make-pot %s %s/quillforms-%s.po --domain=quillforms --include="includes/,templates/" --exclude="node_modules/,vendor/,tests/,packages/,client/"',
        QUILLFORMS_PLUGIN_DIR,
        $languages_dir,
        $locale
    );
    echo "Executing PHP translations: $command\n";
    exec($command);
    
    // For JS translations
    $command = sprintf(
        'wp i18n make-pot %s %s/quillforms-js-%s.po --domain=quillforms --include="build/"',
        QUILLFORMS_PLUGIN_DIR,
        $languages_dir,
        $locale
    );
    echo "Executing JS translations: $command\n";
    exec($command);
}

// Function to compile .po to .mo files
function compile_po_to_mo($po_file) {
    $mo_file = str_replace('.po', '.mo', $po_file);
    $command = sprintf('msgfmt %s -o %s', $po_file, $mo_file);
    echo "Compiling: $po_file to $mo_file\n";
    exec($command);
}

// Compile all generated .po files to .mo
echo "\nCompiling .po files to .mo files...\n";
foreach (glob($languages_dir . "/*.po") as $po_file) {
    compile_po_to_mo($po_file);
}

echo "\nTranslation files generation completed!\n";