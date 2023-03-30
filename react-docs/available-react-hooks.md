## Available React Hooks

Here is a list  of the available React hooks that you can export from `@quillforms/renderer-core` package

### useCurrentBlock
Gets the current block
```js
import { useCurrentBlock } from "@quillforms/renderer-core";
const currentBlock = useCurrentBlock();
```

### useFormAnswers

Retrieves form answers
```js
import { useFormAnswers } from "@quillforms/renderer-core";
const formAnswers = useFormAnswers();
```

### useFieldAnswer

Retrieves the field answer
```js
import { useFieldAnswer } from "@quillforms/renderer-core";
const fieldAnswer = useFieldAnswer(fieldId);
```

### useTheme

Retrieves the theme
```js
import { useTheme } from "@quillforms/renderer-core";
const theme = useTheme();
```

### useMessages

Retrieves form messages
```js
import { useMessages } from "@quillforms/renderer-core";
const messages = useMessages();
```
