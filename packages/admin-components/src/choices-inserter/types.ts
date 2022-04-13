export type ChoicesContextContent = {
	addChoice: ( at: number ) => void;
	labelChangeHandler: ( label: string, index: number ) => void;
	deleteChoice: ( val: string ) => void;
	handleMediaUpload: ( media: any, index: number ) => void;
	deleteImageHandler: ( index: number ) => void;
	withAttachment?: boolean;
};
