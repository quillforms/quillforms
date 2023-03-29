# beforeGoingNext

When you pass your array of blocks in the `formObj` prop, you can define beforeGoingNext function in each block.
This function will be called before going to next block and you can completely override the default behaviour instead of going to the next block by default.

**Please note that this function won't be called if the block is the last block. You should use `onSubmit` instead in this case.**

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
Ok, cool, but what is the benefit of this function?

Actually, with this handy function, you can do a lot of things. You have a full control on the block before going to next blocks.
You can add more validation, send API request, conditionally rendering some blocks synchronously or based on third part api.


Let's discuss its possible use cases one by one:

## 1- More Validation for Core Blocks

When you use the core blocks, there might be a need to add more validation for any block. No worries, `beforeGoingNext` will handle this.

Please read this [doc](./core-blocks-validation.md) for more details.


## 2- Asynchronously Render Blocks Dynamically Based on Conditions (API Requests)

Fore more details, please read thid [doc](./async-dynamic-block-rendering.md)


## 3- Sending Some Data to Third Party or Asynchronous Validation for Any Block Based on API Request 

For more details, please read this [doc](./async-request.md).
