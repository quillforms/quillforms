# Installation and usage

1. Add the `@quillforms/renderer-core` package

```bash
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
registerCoreBlocks();
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
            {
              name: "date",
              id: "a213rsew",
              attributes: {
                required: true,
                label: "Please type your birth of date!"
              }
            },
            {
              name: "email",
              id: "iqfrqwr13r",
              attributes: {
                required: true,
                label: "Thanks {{field:kdsfkdg}}, please insert your email!"
              }
            },
            {
              name: "dropdown",
              id: "nb913rqw",
              attributes: {
                required: true,
                label: "Please select one choice",
                choices: [
                  {
                    label: "Choice 1",
                    value: "choice-1"
                  },
                  {
                    label: "Choice 2",
                    value: "choice-2"
                  },
                  {
                    label: "Choice 2",
                    value: "choice-3"
                  }
                ]
              }
            },
            {
              name: "multiple-choice",
              id: "gqr1294c",
              attributes: {
                required: true,
                multiple: true,
                verticalAlign: false,
                label: "Which subjects do you love the most?",
                choices: [
                  {
                    label: "Physics",
                    value: "physics"
                  },
                  {
                    label: "Math",
                    value: "math"
                  },
                  {
                    label: "English",
                    value: "english"
                  },
                  {
                    label: "Biology",
                    value: "biology"
                  }
                ]
              }
            },
            {
              name: "statement",
              id: "g91imf1023",
              attributes: {
                label: "You are doing great so far!",
                buttonText: "Continue",
                quotationMarks: true
              }
            },
            {
              name: "website",
              id: "bv91em9123",
              attributes: {
                required: true,
                multiple: true,
                label: "Please insert your website url!"
              }
            }
          ],
          settings: {
            animationDirection: "vertical",
            disableWheelSwiping: false,
            disableNavigationArrows: false,
            disableProgressBar: false
          },
          theme: {
            font: "Roboto",
            buttonsBgColor: "#9b51e0",
            logo: {
              src: ""
            },
            questionsColor: "#000",
            answersColor: "#0aa7c2",
            buttonsFontColor: "#fff",
            buttonsBorderRadius: 25,
            errorsFontColor: "#fff",
            errorsBgColor: "#f00",
            progressBarFillColor: "#000",
            progressBarBgColor: "#ccc"
          }
        }}
        onSubmit={(data, { completeForm, setIsSubmitting }) => {
          setTimeout(() => {
            setIsSubmitting(false);
            completeForm();
          }, 500);
        }}
      />
    </div>

```

[View full code on Codesandbox](https://codesandbox.io/s/quizzical-forest-20uuf)
