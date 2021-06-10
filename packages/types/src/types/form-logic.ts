export enum BlockLogicActionType {
	jump = 'jump',
	add = 'add',
	substract = 'substract',
	divide = 'divide',
	multiply = 'multiply',
}

export enum BlockLogicActionConditionOperators {
	is = 'is',
	isNot = 'is_not',
	greaterThan = 'greater_than',
	lowerThan = 'lower_than',
	startsWith = 'starts_with',
	endsWith = 'ends_with',
	contains = 'contains',
	notContains = 'not_contains',
}

export enum BlockLogicActionConditionVarTypes {
	field = 'field',
	variable = 'variable',
}

export type BlockLogicActionCondition = {
	op: BlockLogicActionConditionOperators;
	vars: [
		{
			type: BlockLogicActionConditionVarTypes;
			value: string;
		},
		{
			value: string;
		}
	];
};
export type BlockLogicAction = {
	type: BlockLogicActionType;
	target?: string;
	conditions?: BlockLogicActionCondition[][];
};

export type BlockLogic = {
	blockId: string;
	actions: BlockLogicAction[];
};

export type FormLogic = BlockLogic[];
