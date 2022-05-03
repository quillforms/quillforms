import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-short-text-block";

registerBlockType(name, {...metadata, ...rendererSettings});
