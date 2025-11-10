import Header from "@navbar/Header";
import ExpensesContent from "@expenses/ExpensesContent";

export default function Page() {
	return (
		<div className="flex h-full">
			<div className="flex-1 flex flex-col">
				<div className="h-[10vh]">
					<Header />
				</div>
				<div className="h-fit flex-1">
					<ExpensesContent />
				</div>
			</div>
		</div>
	)
}