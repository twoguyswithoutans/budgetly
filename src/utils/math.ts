export function safeAdd(a: unknown, b: unknown): number {
	const numA = Number(a);
	const numB = Number(b);
	return Number.isFinite(numA) && Number.isFinite(numB) ? numA + numB : numA;
}

export function safeDiff(a: unknown, b: unknown): number {
	const numA = Number(a);
	const numB = Number(b);
	return Number.isFinite(numA) && Number.isFinite(numB) ? numA - numB : numA;
}