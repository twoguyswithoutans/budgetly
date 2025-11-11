import type { CategoryTotalsProps } from "@models";

export default function CategoryTotals({ category, getCategoryTotals, localizeNumber }: Readonly<CategoryTotalsProps>) {
	const totals = Object.values(getCategoryTotals(category));

	return (
		<>
			{totals.map((value, i) => (
				<div key={`${value}-${i}`} className="flex-1 text-right font-semibold">
					{localizeNumber(value)}
				</div>
			))}
		</>
	)
}