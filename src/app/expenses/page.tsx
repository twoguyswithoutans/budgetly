import Header from "@navbar/Header";
import ExpensesContent from "@expenses/ExpensesContent";

export default function Page() {

	return (
		<main className="flex flex-col h-full flex-1">
			<header className="h-[10vh]">
				<Header />
			</header>
			<section className="flex-1 overflow-y-auto">
				<ExpensesContent />
			</section>
		</main>
	)
}