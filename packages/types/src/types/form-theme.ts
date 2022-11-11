type MediaDevices = {
	lg: string;
	md: string;
	sm: string;
};
export type FormTheme = {
	font: string;
	backgroundColor: string;
	backgroundImage: string;
	backgroundImageFocalPoint: {
		x: number;
		y: number;
	};
	logo: {
		type?: string;
		src?: string;
	};
	questionsColor: string;
	questionsLabelFont: string;
	questionsLabelFontSize: MediaDevices;
	questionsLabelLineHeight: MediaDevices;
	questionsDescriptionFont: string;
	questionsDescriptionFontSize: MediaDevices;
	questionsDescriptionLineHeight: MediaDevices;
	answersColor: string;
	buttonsFontColor: string;
	buttonsFontSize: MediaDevices;
	buttonsPadding: {
		top: MediaDevices;
		bottom: MediaDevices;
		left: MediaDevices;
		right: MediaDevices;
	};
	buttonsBgColor: string;
	buttonsBorderRadius: number;
	buttonsBorderWidth: number;
	buttonsBorderColor: string;
	errorsFontColor: string;
	errorsBgColor: string;
	progressBarFillColor: string;
	progressBarBgColor: string;
	formFooterBgColor: MediaDevices;
};
