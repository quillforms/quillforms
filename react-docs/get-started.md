# Getting Started

## Installation and usage

1. Add the `@quillforms/renderer-core` package

```bash
# npm
npm install @quillforms/renderer-core --save
```

2. Add the `@quillforms/react-renderer-utils` package

```bash
# npm
npm install @quillforms/react-renderer-utils --save
```

3. Use the component

```js
import { Form } from "@quillforms/renderer-core";
import "@quillforms/renderer-core/build-style/style.css";
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
registerCoreBlocks();
const App = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Form
        formId="1"
        formObj={{
          blocks: [
            {
              name: "welcome-screen",
              id: "jg1401r",
              attributes: {
                label: "Welcome to our survey",
                description: "This is just a description",
                attachment: {
                  type: "image",
                  url:
                    "https://quillforms.com/wp-content/uploads/2022/01/4207-ai-1.jpeg"
                }
              }
            },
            {
              name: "short-text",
              id: "kd12edg",
              attributes: {
                required: true,
                label: "Let's start with your name"
              }
            },
            {
              name: "multiple-choice",
              id: "gqr1294c",
              attributes: {
                required: true,
                multiple: true,
                verticalAlign: false,
                label: "Which subjects do you love the most?",
                choices: [
                  {
                    label: "Physics",
                    value: "physics"
                  },
                  {
                    label: "Math",
                    value: "math"
                  },
                  {
                    label: "English",
                    value: "english"
                  },
                  {
                    label: "Biology",
                    value: "biology"
                  }
                ]
              }
            },
          ],
        }}
        onSubmit={(data, { completeForm, setIsSubmitting, goToBlock, setSubmissionErr }) => {
          setTimeout(() => {
            setIsSubmitting(false);
            completeForm();
          }, 500);
        }}
      />
    </div>

```

[View full code on Codesandbox](https://codesandbox.io/s/quill-forms-example-20uuf)

## `<Form>` Props

```js
//
// Types:
// 

// Block default attributes
type DefaultAttributes = {
  // The block label
  label?: string;

  // The block description
  description?: string;

  // The block required flag
  required?: boolean;

  // The block attachment
  attachment?: {
    type: 'image';
    url: string;
  };
};

// Each block can have custom attribtues as well as the default attributes
interface BlockAttributes extends DefaultAttributes {
	[ x: string ]: unknown;
}

// Form block 
type FormBlock = {
  // The block id. Must be a unique id.
	id: string;

  // The name of the block. You should make sure that the block is registered before using its name.
  // By exporting `registerCoreBlocks` from `@quillforms/react-renderer-utils`, you are registering
  // the core blocks that come with Quill Forms which are: welcome-screen, date, email, short-text,
  // long-text website, dropdown, multiple-choice, number and statement.
  // To register your own custom block, read the section below.
	name: string;

  // The attributes for the block.
	attributes?: BlockAttributes;
};

// Form messages
type FormMessages = {
	'label.button.ok'?: string; // Default: 'Ok'
	'label.hintText.enter'?: string; // Default: "press <strong>Enter ↵</strong>",
	'label.hintText.multipleSelection'?: string; // Default: "Choose as many as you like"
	'block.dropdown.placeholder'?: string; // Default: "Type or select an option"
	'block.dropdown.noSuggestions'?: string; // Default: "No Suggestions!"
	'block.shortText.placeholder'?: string; // Default: "Type your answer here"
	'block.longText.placeholder'?: string; // Default: "Type your answer here"
	'block.longText.hint'?: string; // Default: "<strong>Shift ⇧ + Enter ↵</strong> to make a line break"
	'block.number.placeholder'?: string; // Default: "Type your answer here"
	'block.email.placeholder'?: string; // Default: "Type your email here"
	'block.defaultThankYouScreen.label'?: string; // Default: "Thanks for filling this in.\n\n We will contact you soon"
	'label.hintText.key'?: string; // Default: "Key"
	'label.progress.percent'?: string; // Default: "{{progress:percent}}% completed"
	'label.errorAlert.required'?: string; // Default: "This field is required!"
	'label.errorAlert.date'?: string; // Default: "Invalid date!"
	'label.errorAlert.number'?: string; // Default: "Numbers only!"
	'label.errorAlert.selectionRequired'?: string; // Default: "Please make at least one selection!"
	'label.errorAlert.email'?: string; // Default: "Invalid email!"
	'label.errorAlert.url'?: string; // Default: "Invalid url!"
	'label.errorAlert.range'?: string; // Default: "Please enter a number between {{attribute:min}} and {{attribute:max}}"
	'label.errorAlert.minNum'?: string; // Default: "Please enter a number greater than {{attribute:min}}"
	'label.errorAlert.maxNum'?: string; // Default: "Please enter a number lower than {{attribute:max}}"
	'label.errorAlert.maxCharacters'?: string; // Default: "Maximum characters reached!"
	'label.submitBtn'?: string; // Default: "Submit"
	[ x: string ]: string | undefined;
};

// Form theme
type FormTheme = {
	font: string;
	backgroundColor: string;
	backgroundImage: string;
	logo: {
		type?: string;
		src?: string;
	};
	questionsColor: string;
	answersColor: string;
	buttonsFontColor: string;
	buttonsBgColor: string;
	buttonsBorderRadius: number;
	errorsFontColor: string;
	errorsBgColor: string;
	progressBarFillColor: string;
	progressBarBgColor: string;
};


type FormObj = {
	blocks: FormBlock[];
	theme: Partial< FormTheme >;
	messages?: Partial< FormMessages >;
	settings?: {
		disableProgressBar?: boolean;
		disableWheelSwiping?: boolean;
		disableNavigationArrows?: boolean;
		animationDirection: 'vertical' | 'horizontal';
	};
};

type SubmissionData = {
  answers: object;
}
type SubmissionDispatchers = {
	setIsSubmitting: ( flag: boolean ) => void;
	setIsReviewing: ( flag: boolean ) => void;
	goToBlock: ( id: string ) => void;
	setIsFieldValid: ( id: string, flag: boolean ) => void;
	setFieldValidationErr: ( id: string, err: string ) => void;
	completeForm: () => void;
	setSubmissionErr: ( value: string ) => void;
};

//
// Props:
//
{
	formId?: number;
	formObj: FormObj;
	onSubmit: ( data: SubmissionData, dispatchers: SubmissionDispatchers ) => void;
}
```

## Core blocks
Quill Forms comes with some core blocks. You should make sure that you registered them via `registerCoreBlocks` imported from `@quillforms/react-renderer-utils`.
Each block can have default attributes: 
```js
{
  label: string;
  description: string;
  required: boolean;
  attachment: {
    type: 'image';
    url: string;
  };
}
```
And it can have some custom attributes.
Here is the list of the core blocks with the possible custom attributes that the block can have:

### 1- Welcome Screen
```js
{
  name: "welcome-screen",
  attributes: {
    "buttonText": string; // Default: "Let's start"
  }
}
```
### 2- Short Text
``` js
{
 name: "short-text",
 attributes: {
   "setMaxCharacters": boolean; // Default: false
   "maxCharacters": number;
 }
}
```
### 3- Date
``` js
{
  name: "date",
  attributes: {
    "format": "MMDDYYYY" | "DDMMYYYY" | "YYYYMMDD"; //"default": "MMDDYYYY"
    "separator": "/" | "-" | "."; // default: "/"
  }
}
```
### 4- Email
``` js
{
  name: "email",
  attributes: {}
}
```
### 5- Dropdown
``` js
{
  name: "dropdown",
  attributes: {
    "choices": { 
	    "value":  string;
	    "label": string;
    }[]; // Default:  [ { "value": "123e45z7o89b",	"label": "Choice 1" }]
  }
}
```
### 6- Long Text
``` js
{
  name: "long-text",
  attributes: {
    "setMaxCharacters": boolean; // Default: false
    "maxCharacters": number;
  }
}
```
### 7- Multiple Choice
``` js
{
  name: "multiple-choice",
  attributes: {
    "choices": { 
      "value":  string;
      "label": string;
    }[];  // Default:  [ { "value": "123e45z7o89b",	"label": "Choice 1" }]
    "verticalAlign": boolean; // Default : false
    "multiple": boolean; // Default : false
  }
}
```
### 8- Number
``` js
{
  name: "number",
  attributes: {
    "set_max": boolean; // Default: false
    "max": number; // Default: 0
    "set_max": boolean; // Default: false
    "max": number; 
  }
}
```
### 9- Website
``` js
{
  name: "website",
  attributes: {}
}
```

### 10- Statement

``` js
{
  name: "statement",
  attributes: {
    "buttonText": string; // Default: "Continue"
    "quotationMarks": boolean; // Default: true
  }
}
```
## Create your own custom block
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
[View full example on Codesandbox](https://codesandbox.io/s/quill-forms-custom-block-registration-xmbyiy)


## Available Hooks

Here is a list  of the available hooks that you can export from `@quillforms/renderer-core` package

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

### useTheme

Retrieves the theme
```js
const theme = useTheme();
```

### useMessages

Retrieves form messages
```js
const messages = useMessages();
```

