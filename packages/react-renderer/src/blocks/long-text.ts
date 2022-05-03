import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-long-text-block";

registerBlockType(name, {...metadata, ...rendererSettings});
