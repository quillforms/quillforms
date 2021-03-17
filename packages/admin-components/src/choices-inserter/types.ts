export type ChoicesContextContent = {
	addChoice: ( at: number ) => void;
	labelChangeHandler: ( label: string, index: number ) => void;
	deleteChoice: ( val: string ) => void;
};
