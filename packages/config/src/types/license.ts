export type License =
	| {
			status: string;
			plan: string;
			plan_label: string;
			expires: string;
	  }
	| false;
