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

export type LogicActionBlockId = string;

export type LogicAction = {
	type: LogicActionType;
	target: string;
	value?: number;
	conditions: LogicCondition[][];
};

export type FormLogicActions = Record< LogicActionBlockId, LogicAction[] >;

export type LogicVariableId = string;

export type LogicVariable = {
	label: string;
	initialValue: number;
};

export type FormLogicVariables = Record< LogicVariableId, LogicVariable >;

export type FormLogic = {
	actions: FormLogicActions;
	variables: FormLogicVariables;
};
