# useRendererStoreActions Hook
Quill Forms Renderer core package uses a Redux store to dispatch actions via the reducers.
useRendererStoreActions hook provides a quick way to access the actions in this store and dispatch them quickly!

You can see the full list of actions used [here](https://github.com/quillforms/quillforms/blob/master/packages/renderer-core/src/store/actions.ts)

## This is the list of the important actions:

### goToBlock(Block_Id: String)
This action is used to go to a specific block
It expects to pass the block id.
```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { goToBlock } = useRendererStoreActions();
```

### goNext()
This action is used to go to the next block

```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { goNext } = useRendererStoreActions();
```

### goPrev()
This action is used to go to the previous block.
To add your own action after the field is answered while it is active, you should do something like this:

```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { goNext } = useRendererStoreActions();
```

### setFieldAnswer(Field_Id: string, value: any)
This action is used to set any field answer
It expects two args (Field_Id and the value)

```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { setFieldAnswer } = useRendererStoreActions();
```

### setIsFieldValid(Field_Id: string, flag: boolean)
This action is used to the field isValid boolean flag
It expects two args (Field_Id and the flag)

```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { setIsFieldValid } = useRendererStoreActions();
```

### setFieldValidationErr(Field_Id: string, val: string)
This action is used to the set the validation error message that will appear to the user for a specific field.
It expects two args (Field_Id and the value)

```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { setFieldValidationErr } = useRendererStoreActions();
```

### completeForm()
This action is used to show the thank you screen and complete the form
```js
import { useRendererStoreActions } from "@quillforms/renderer-core";

const { completeForm } = useRendererStoreActions();
```

