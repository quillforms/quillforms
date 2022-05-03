import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-multiple-choice-block";

registerBlockType(name, {...metadata, ...rendererSettings});
