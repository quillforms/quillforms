export type License =
	| {
			status: string;
			status_label: string;
			plan: string;
			plan_label: string;
			expires: string;
			upgrades: {
				[ plan: string ]: {
					plan_label: string;
					url: string;
				};
			};
			last_update: string;
			last_check: string;
	  }
	| null;
