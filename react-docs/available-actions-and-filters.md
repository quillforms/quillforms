# What are actions and filters?
Actions and filters are WordPress concept mainly which is called "WordPress Hooks" but hey, this doesn't mean that this concept should be used in WordPress environment only, no, you can use it in your React app easily. <br>
It gives you much flexibility. <br>
Cool, but what are "WordPress Hooks"?
WordPress defines hooks as a way for one piece of code to interact/modify another piece of code at specific, pre-defined spots. 
Please read this [doc](https://github.com/WordPress/gutenberg/blob/208e3e2be91baefbfacb063b7046f1ee9a75c54b/packages/hooks/README.md) to have more details about "@wordpress/hooks" package that we use to let you extend some functionality easily. <br>
**That means that you should insert first @wordpress/hooks package in your package.json file and install it.
## Available actions:

### QuillForms.RendererCore.Loaded
This action is called after the form is loaded directly.
To add your own action after the form is loaded, you should do something like this:

```js
import { addAction } from "@wordpress/hooks";

addAction('QuillForms.RendererCore.Loaded', 'myOwnAction', function() {
  console.log("Form loaded");
  // your code should go here!
});
```

