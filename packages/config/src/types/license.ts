export type License =
	| {
			status: string;
			status_label: string;
			plan: string;
			plan_label: string;
			expires: string;
			last_check: string;
	  }
	| false;
