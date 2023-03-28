# Dynamic Blocks Rendering
You can easily show, hide, add or remove questions based on form answers. 
You have 2 useful hooks that you can use for that:

### useFormAnswers

Retrieves form answers
```js
const formAnswers = useFormAnswers();
```

### useFieldAnswer

Retrieves the field answer
```js
const fieldAnswer = useFieldAnswer(fieldId);
```
## Example
Please view this [codesandbox example](https://codesandbox.io/s/quill-forms-conditional-blocks-rendering-0r9x2e) for more details.
