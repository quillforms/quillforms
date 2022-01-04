export type Currency = {
	name: string;
	symbol: string;
	symbol_pos: number;
};

export type Currencies = {
	[ key: string ]: Currency;
};
