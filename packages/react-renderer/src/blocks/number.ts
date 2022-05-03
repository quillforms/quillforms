import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-number-block";

registerBlockType(name, {...metadata, ...rendererSettings});
