# Installation and usage

1. Add the `@quillforms/renderer-core` package

```bash
# yarn
yarn add react-beautiful-dnd

# npm
npm install @quillforms/renderer-core --save
```

2. Add the `@quillforms/react-renderer-utils` package

```bash
# npm
npm install @quillforms/react-renderer-utils --save
```

3. Use the component

```js
import { Form } from "@quillforms/renderer-core";
import "@quillforms/renderer-core/build-style/style.css";
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
const App = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Form
        formId="1"
        formObj={{
          blocks: [
            {
              name: "welcome-screen",
              id: "jg1401r",
              attributes: {
                label: "Welcome to our survey",
                description: "This is just a description",
                attachment: {
                  type: "image",
                  url:
                    "https://quillforms.com/wp-content/uploads/2022/01/4207-ai-1.jpeg"
                }
              }
            },
            {
              name: "short-text",
              id: "kd12edg",
              attributes: {
                required: true,
                label: "Let's start with your name"
              }
            },
            {
              name: "number",
              id: "wer3qdkdb",
              attributes: {
                required: true,
                label: "Great {{field:kdsfkdg}}, can you type your age?"
              }
            },
		  ]
		}}

		onSubmit={(data, { completeForm, setIsSubmitting }) => {
          setTimeout(() => {
            setIsSubmitting(false);
            completeForm();
          }, 500);
        }}

	/>

```
[View full code on Codesandbox](https://codesandbox.io/s/quizzical-forest-20uuf)
