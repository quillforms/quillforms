# Adding More Validation for Core Blocks

using `beforeGoingNext`, you can add more validation for Quill Forms core blocks.
Example: 
``` js
 <Form
        formId="1"
        formObj={{
          blocks: [
            {
              name: "short-text",
              id: "kd12edg",
              attributes: {
                classnames: "my-first-block",
                nextBtnLabel: "Great",
                attachment: {
                  type: "image",
                  url:
                    "https://quillforms.com/wp-content/uploads/2022/10/ludovic-migneault-B9YbNbaemMI-unsplash_50-scaled.jpeg"
                },
                layout: "split-right",
                required: true,
                label: "Let's start with your name"
              },
              beforeGoingNext: ({
                setIsFieldValid,
                setIsPending,
                currentBlockId,
                answers,
                setFieldValidationErr,
                setIsCurrentBlockSafeToSwipe,
                goToField,
                goNext
              }) => {
                if (answers[currentBlockId].value === "aaa") {
                  setIsFieldValid(currentBlockId, false);
                  setFieldValidationErr(currentBlockId, "This is a test");
                  setIsCurrentBlockSafeToSwipe(false);
                } else {												
		  setIsFieldValid(currentBlockId, true);
                  setFieldValidationErr(currentBlockId, '');
                  setIsCurrentBlockSafeToSwipe(true);
                  goNext();
                }
              }
            },
            {
              name: "long-text",
              id: "gqr1294c",
              attributes: {
                label: "Please type your message!"
                required: true,
      
              }
            }
          ]
       }}
/>
```
In this example, we throw error if the answer of the first question is 'aaa'

## CodeSandbox
Please view this example in action at [this CodeSandbox](https://codesandbox.io/s/quill-forms-example-extra-validation-ri1mhi)
