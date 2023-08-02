tinymce.PluginManager.add("demo", (editor, url) => {
    editor.ui.registry.addButton("demo-button", {
        text: "My Button",
        onAction: (_) => editor.dispatch("demo-event")
    });
    return {
        getMetadata: () => ({
            name: "Demo plugin",
            url: "https://example.com/docs/customplugin"
        })
    };
});
