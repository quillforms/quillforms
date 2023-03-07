# Create your own custom block
Blocks are an abstract unit for structuring and interacting with the form. Quill Forms `react-renderer-utils` package exports `registerCoreBlocks` method to register core blocks that you can use directly in your app but you can register custom blocks with custom display. 
Quill Forms is flexible enough to create your own block very easily.
To create your custom block, please follow these steps:
1. Add the `@quillforms/blocks` package

```bash
# npm
npm install @quillforms/blocks --save
```

2. Import `registerBlockType` method from the package


```js
import { registerBlockType } from '@quillforms/blocks';
```

3- register your block

```js
registerBlockType("YOUR_BLOCK_UNIQUE_NAME", {
  "supports": {
    "editable": true, // If the block has an answer or not.
  },
  // The custom attributes for the block.
  "attributes": {
    "min": {
      "type": "number",
      "default": 1
    },
    "max": {
      "type": "number",
      "default": 10 
    }
  },

    // Block display, this should be a react component. 
  "display": ({ id, next, attributes, setIsValid, setIsAnswered, setValidationErr, showNextBtn,blockWithError, val, setVal, showErrMsg }) => {
    return <input type="number" value={val} onChange={e => {
      const value = e.target.value;
      const { required } = attributes
      if ( isNaN( value ) ) {
        blockWithError( 'Numbers only!' );
        return;
      }
      setVal( parseInt( value ) );
      showErrMsg( false );

      if ( value ) {
        setIsAnswered( true );
        showNextBtn( true );
        setIsValid(true);
        setValidationErr( null );
      } else {
        setIsAnswered( false );
        showNextBtn( false );
        if( required ) {
          setIsValid(false);
          setValidationErr( "The field is required!" );
        }
      }
    }} /> // This is just an example. Please see the full example on Codesandbox in the link below.
  }
})

```
For more details, please view this [full example on Codesandbox](https://codesandbox.io/s/quill-forms-custom-block-registration-xmbyiy)

