import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-date-block";

registerBlockType(name, {...metadata, ...rendererSettings});
