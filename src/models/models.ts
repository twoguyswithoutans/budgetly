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
export interface HeaderProps {
	triggerRefresh?: number;
	onMonthChange?: (month: Date) => void;
}
export interface DashboardContentProp {
	onTriggerRefresh: OnTriggerRefresh
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
	onSave: OnSave;
	onDelete: OnDelete;
	onClose: OnClose;
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
	onTriggerRefresh: OnTriggerRefresh;
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