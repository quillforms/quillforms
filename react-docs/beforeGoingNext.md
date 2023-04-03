# beforeGoingNext prop

When you create your Form component, you can define beforeGoingNext prop same like onSubmit.
This function will be called before going to next block and you can completely override the default behaviour instead of going to the next block by default.


``` js
 <Form
        formId="1"
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
           if (
            currentBlockId === "first-question" &&
            answers[currentBlockId].value === "aaa"
          ) {
            setIsFieldValid(currentBlockId, false);
            setFieldValidationErr(currentBlockId, "This is a test");
            setIsCurrentBlockSafeToSwipe(false);
          } else {
            setIsFieldValid(currentBlockId, true);
            setFieldValidationErr(currentBlockId, "");
            setIsCurrentBlockSafeToSwipe(true);
            goNext();
          }
        }
        formObj={{
          blocks: [
            {
              name: "short-text",
              id: "first-question",
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
Ok, cool, but what is the benefit of this function?

Actually, with this handy function, you can do a lot of things. You have a full control on the block before going to next blocks.
You can add more validation, send API request, conditionally rendering some blocks synchronously or based on third part api.


Let's discuss its possible use cases one by one:

## 1- More Validation for Core Blocks

When you use the core blocks, there might be a need to add more validation for any block. No worries, `beforeGoingNext` will handle this.

Please read this [doc](./core-blocks-validation.md) for more details.

## 2- Sending Some Data to Third Party or Asynchronous Validation for Any Block Based on API Request 

You should use async await concept here.
Please read this [doc](./async-requests.md).
