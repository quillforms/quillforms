## Asynchronous Requests Handling

Quill Forms gives you the ability to handle the asynchronous requests easily.
By saying "Asynchronous Requests", we almost refer to api requests or any other promise based callbacks.

**Please note we are not talking here about asynchronous request after the submission since it can be handled easily with onSubmit prop**

Let's divide these asynchronous requests to two categories:

### 1- Blocking Asynchronous Requests
Blocking Asynchronous Requests are requests that you need to implement in a specific field before going to the next field and block the field from being swiped waiting for your request to get resolved.
In this case, you need to use `beforeGoingNext` prop and you can get more details about it [here](https://github.com/quillforms/quillforms/blob/master/react-docs/beforeGoingNext.md).
In the following example, we are validating a specific field based on API request:
```js
 <Form
        formId="1"
	 beforeGoingNext: async ({
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
            currentBlockId === "first-question" 
          ) {
            setIsPending(true) // Very important to let Quill Forms blocks the user form going to the next question and showing a spinner to him.
            const res = await MY_API_REQUEST_FUNCTION(); 
            if(res === 'something') {
                setIsFieldValid(currentBlockId, false);
                setFieldValidationErr(currentBlockId, "This is a test");
                setIsCurrentBlockSafeToSwipe(false);
            }
            else {
              setIsFieldValid(currentBlockId, true);
              setFieldValidationErr(currentBlockId, "");
              setIsCurrentBlockSafeToSwipe(true);
              goNext();
            }
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
