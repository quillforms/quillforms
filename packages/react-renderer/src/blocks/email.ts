import { registerBlockType } from "@quillforms/blocks";
import { name, metadata, rendererSettings } from "@quillforms/blocklib-email-block";

registerBlockType(name, {...metadata, ...rendererSettings});
