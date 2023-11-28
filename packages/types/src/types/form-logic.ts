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

export type LogicCondition = {
	vars: [
		{
			type: string;
			value: string;
		},
		{
			type?: 'numeric' | 'field' | 'variable'; 
			value: string;
		}
	];
	op: LogicConditionOperator;
};

export type EditorLogicCondition = {
	vars: [
		{
			type?: string;
			value?: string;
		},
		{
			value?: 'input' | 'field' | 'variable';
			type?: string;
		}
	];
	op?: LogicConditionOperator;
};

export type LogicAction = {
	type: LogicActionType;
	target: string;
	value?: number | { type: 'field' | 'variable'; value: string };
	points?: Boolean;
	conditions: LogicCondition[][] | true;
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
