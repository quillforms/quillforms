import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-website-block";

registerBlockType(name, {...metadata, ...rendererSettings});
