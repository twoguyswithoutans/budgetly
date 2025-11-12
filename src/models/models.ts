import { ChangeEvent } from "react";

// Core Types
type GoalType = "saving" | "debt";
type OnTriggerRefresh = () => void;
type OnClose = () => void;
type OnDelete = (id: string) => void;
type OnSave = (updatedItem?: any) => void;
// Core Data Models
export interface Item {
	id: string;
	title: string;
	total: number;
	appliedAmount: number;
	dateAdded: string;
	repeatMonthly: boolean;
	category_id: string;
	dueDate?: string | null;
}
export interface Category {
	id: string;
	name: string;
	items: Item[];
}
export interface CategoryTotal {
	applied: number;
	due: number;
	total: number;
}
export interface Transaction {
	id: string;
	title: string;
	category: string;
	amount: number;
	date: string;
	notes?: string;
}
export interface Goal {
	id: string;
	type: GoalType;
	name: string;
	target: number;
	current: number;
	due: string;
}
// UI Props
export interface EmptyStateProps {
    simple?: boolean;
    message?: string;
    graph?: boolean;
}
export interface NavItem {
	name: string;
	path: string;
	icon: React.ComponentType<{ size?: string | number }>;
}
export interface HeaderProps {
	triggerRefreshAction?: number;
	onMonthChange?: (month: Date) => void;
}
export interface DashboardContentProp {
	onTriggerRefreshAction: OnTriggerRefresh
	currentMonth: Date;
}
export interface AddItemPopupProps {
    newItemName: string;
    setNewItemName: (item: string) => void;
    onCancel: () => void;
    onAdd: () => void;
}
export interface ContentSidePanelProps {
	item: Item;
	onSaveAction: OnSave;
	onDeleteAction: OnDelete;
	onCloseAction: OnClose;
}
export interface CategoryTotalsProps {
	category: Category;
	getCategoryTotals: (category: Category) => CategoryTotal;
	localizeNumber: (value: number) => string;
}
export interface ItemFormProps {
	editable: any;
	addAmount: number | null;
	currentDate: string;
	isRepeat: boolean;
	onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
	onAddAmountAction: (e: ChangeEvent<HTMLInputElement>) => void;
	onToggleRepeatAction: () => void;
	onCompleteAmountAction: () => void;
}
export interface ExpensesChartCardProps {
	totalSpending: number;
	filteredCount: number;
	dateFrom: string;
	dateTo: string;
	chartData: ChartItem[];
}
export interface ActiveGoalsProp {
	name: string;
	progress: number;
	type: string;
	dateAdded?: string;
}
export interface GoalsContentProp {
	onTriggerRefreshAction: OnTriggerRefresh;
}
export interface CategoryItemsProps {
	items: Item[];
	handleSelectedItem: (item: Item) => void;
	localizeNumber: (value: number) => string;
}
// Charts
export interface ChartItem {
	name: string;
	value: number;
	color?: string;
}
export interface ChartDataProps {
	chartData: ChartItem[];
	otherData?: any[];
	comparison?: boolean;
}