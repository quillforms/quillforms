## Custom CSS

Quill Forms gives you the ability to add custom css easily.
To add custom css, you should pass `customCSS` property to your `formObj` prop like the following
```js
<Form 
  formObj={{
    ...formObj,
    customCSS: `
      input: {
        border: 1px solid #e3e3e3 !important;
        box-shadown: none !important;
        border-radius: 4px !important;
        padding: 8px !important;
      }
    `
  }}
/>
```
