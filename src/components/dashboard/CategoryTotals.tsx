import { Category, CategoryTotal } from "@models";

interface CategoryTotalsProps {
    category: Category;
    getCategoryTotals: (category: Category) => CategoryTotal;
    localizeNumber: (value: number) => string;
}

export default function CategoryTotals({ category, getCategoryTotals, localizeNumber }: CategoryTotalsProps) {
    const { applied, total, due } = getCategoryTotals(category);
    const totals = [applied, total, due];

    return (
        <>
            {totals.map((value, index) => (
                <div key={index} className="flex-1 text-right font-semibold">
                    {localizeNumber(value)}
                </div>
            ))}
        </>
    )
}