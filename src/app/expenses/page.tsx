import Header from 'navbar/Header';
import ExpensesContent from 'components/expenses/ExpensesContent';

export default function Page() {
	return (
		<div className="w-full">
			<Header />
			<div>
				<ExpensesContent />
			</div>
		</div>
	)
}