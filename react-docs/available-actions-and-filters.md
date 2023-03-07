# What are actions and filters?
Actions and filters are WordPress concept mainly which is called "WordPress Hooks" but hey, this doesn't mean that this concept should be used in WordPress environment only, no, you can use it in your React app easily. <br>
It gives you much flexibility. <br>
Cool, but what are "WordPress Hooks"?
WordPress defines hooks as a way for one piece of code to interact/modify another piece of code at specific, pre-defined spots. <br>
Think about it like custom events fired in different positions and you can add your own listener on any of these events. <br>
Please read this [doc](https://github.com/WordPress/gutenberg/blob/208e3e2be91baefbfacb063b7046f1ee9a75c54b/packages/hooks/README.md) to have more details about "@wordpress/hooks" package that we use to let you extend some functionality easily. <br>
Also, please read this [doc](https://developer.wordpress.org/plugins/hooks/) to have a detailed explaination about hooks. <br>
**That means that you should insert first @wordpress/hooks package in your package.json file and install it.**

## What are some use cases for this?
Well, there are a lot of use cases. 
For example, if you would like to add some functionality or send the form data to a third party after the user answers a specific question.
Or you would like to track your users after each question answer, ... etc.

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

### QuillForms.RendererCore.FieldActive
This action is called after a specific field becomes active.
To add your own action after the field has been active, you should do something like this:

```js
import { addAction } from "@wordpress/hooks";

addAction('QuillForms.RendererCore.FieldActive', 'myOwnAction', function({ id, label} ) {
  console.log(`field ${id} with label ${label} is active`);
  // your code should go here!
  // id is the field id
  // label is the field label
});
```

### QuillForms.RendererCore.FieldAnswered
This action is called after a specific field is answered and the user has already swiped it to the next question.
To add your own action after the field is answered and swiped, you should do something like this:

```js
import { addAction } from "@wordpress/hooks";

addAction('QuillForms.RendererCore.FieldAnswered', 'myOwnAction', function({ id, label} ) {
  console.log(`field ${id} with label ${label} is answered and swiped`);
  // your code should go here!
  // id is the field id
  // label is the field label
});
```

### QuillForms.RendererCore.FieldAnsweredActive
This action is called after a specific field is answered while it is still active.
To add your own action after the field is answered while it is active, you should do something like this:

```js
import { addAction } from "@wordpress/hooks";

addAction('QuillForms.RendererCore.FieldAnsweredActive', 'myOwnAction', function({ id, label} ) {
  console.log(`field ${id} with label ${label} is answered and still active`);
  // your code should go here!
  // id is the field id
  // label is the field label
});
```

### QuillForms.RendererCore.WelcomeScreenPassed
This action is called after the welcome screen is passed.
To add your own action after the welcome screen is passed, you should do something like this:

```js
import { addAction } from "@wordpress/hooks";

addAction('QuillForms.RendererCore.WelcomeScreenPassed', 'myOwnAction', function({ id} ) {
  console.log(`Welcome screen ${id} has been passed!`);
  // your code should go here!
});
```

