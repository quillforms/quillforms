export enum LogicActionType {
	jump = 'jump',
	add = 'add',
	substract = 'substract',
	divide = 'divide',
	multiply = 'multiply',
}

export enum LogicConditionOperator {
	is = 'is',
	isNot = 'is_not',
	greaterThan = 'greater_than',
	lowerThan = 'lower_than',
	startsWith = 'starts_with',
	endsWith = 'ends_with',
	contains = 'contains',
	notContains = 'not_contains',
}

export enum LogicConditionVarType {
	field = 'field',
	variable = 'variable',
}

export type LogicCondition = {
	op: LogicConditionOperator;
	vars: [
		{
			type: LogicConditionVarType;
			value: string;
		},
		{
			value: string;
		}
	];
};

export type LogicAction = {
	type: LogicActionType;
	target?: string;
	conditions?: LogicCondition[][];
};

export type FormLogic = Record< string, LogicAction[] >;
