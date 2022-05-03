import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-statement-block";

registerBlockType(name, {...metadata, ...rendererSettings});
