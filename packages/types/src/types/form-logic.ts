export type LogicActionType =
	| 'jump'
	| 'add'
	| 'substract'
	| 'divide'
	| 'multiply';

export type LogicConditionOperator =
	| 'is'
	| 'is_not'
	| 'greater_than'
	| 'lower_than'
	| 'starts_with'
	| 'ends_with'
	| 'contains'
	| 'not_contains';

export type LogicConditionVarType = 'field' | 'variable';

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
	target: string;
	value?: number | { type: 'field'; fieldId: string };
	conditions: LogicCondition[][];
};

export type FormLogicActions = {
	[ BlockId: string ]: LogicAction[];
};

export type FormLogicDefaultJumpTargets = {
	[ BlockId: string ]: string;
};

export type LogicVariable = {
	label: string;
	initialValue: number;
};

export type FormLogicVariables = {
	[ VariableId: string ]: LogicVariable;
};

export type FormLogic = {
	actions: FormLogicActions;
	defaultJumpTargets: FormLogicDefaultJumpTargets;
	variables: FormLogicVariables;
};
