type MediaDevices = {
	lg: string;
	md: string;
	sm: string;
};
export type FormTheme = {
	font: string;
	backgroundColor: string;
	backgroundImage: string;
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
	buttonsBgColor: string;
	buttonsBorderRadius: number;
	errorsFontColor: string;
	errorsBgColor: string;
	progressBarFillColor: string;
	progressBarBgColor: string;
};
