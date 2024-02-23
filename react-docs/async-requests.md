## Asynchronous Requests Handling before submission

Quill Forms gives you the ability to handle the asynchronous requests easily.
By saying "Asynchronous Requests", we almost refer to api requests or any other promise based callbacks.

**Please note we are talking here about asynchronous request BEFORE the submission since AFTER the submission Async requests can be handled easily with onSubmit prop**

Let's divide these asynchronous requests to two categories:

### 1- Blocking Asynchronous Requests
Blocking Asynchronous Requests are requests that you need to implement in a specific field before going to the next field and block the field from being swiped waiting for your request to get resolved.
In this case, you need to use `beforeGoingNext` prop and you can get more details about it [here](https://github.com/quillforms/quillforms/blob/master/react-docs/beforeGoingNext.md).
**You Should use `setIsPending` and set it with `true` before the request to block the user from swiping to next field**

In the following example, we are validating a specific field based on API request:
```js
<Form
  formId="1"
  beforeGoingNext={async ({
    setIsFieldValid,
    setIsPending,
    currentBlockId,
    answers,
    setFieldValidationErr,
    setIsCurrentBlockSafeToSwipe,
    goToField,
    goNext,
  }) => {
    if (currentBlockId === "first-question") {
      setIsPending(true); // Very important to let Quill Forms blocks the user form going to the next question and showing a spinner to him.
      const res = await MY_API_REQUEST_FUNCTION();
      setIsPending(false);
      if (res === "something") {
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
  }}
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
            url: "https://quillforms.com/wp-content/uploads/2022/10/ludovic-migneault-B9YbNbaemMI-unsplash_50-scaled.jpeg",
          },
          layout: "split-right",
          required: true,
          label: "Let's start with your name",
        },
      },
      {
        name: "long-text",
        id: "gqr1294c",
        attributes: {
          label: "Please type your message!",
          required: true,
        },
      },
    ],
  }}
/>
```

### 2- Non Blocking Asynchronous Requests
In this case, you need to implement asynchronous request but without blocking the user from swiping the form.
You can still use `beforeGoingNext` like before but also, you can use the following approach if your case is simple.
In this example, we send an API request when the user reaches a specific question:

```js 
import { useCurrentBlock, useFormAnswers } from "@quillforms/renderer-core";

const currentBlock = useCurrentBlock();
const formAnswers = useFormAnswers();

useEffect( () => {
   if(currentBlock?.id === 'THE_FIELD_ID_I_NEED') {
     // send your api request here
   }
}, [currentBlock] )
```

