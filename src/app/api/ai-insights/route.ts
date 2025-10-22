import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { summary, spendingData, goals, dateRange } = await req.json();
		const prompt = `
				You are a friendly budgeting coach. Give short, practical, non-judgmental tips.
				User data (filtered for ${dateRange.from} to ${dateRange.to}):
				- Income: $${Number(summary.income || 0).toFixed(2)}
				- Expenses: $${Number(summary.expenses || 0).toFixed(2)}
				- Net Savings (net worth snapshot): $${Number(summary.savings || 0).toFixed(2)}
				Spending by category (appliedAmount totals):
				${(spendingData || [])
				.map((c: any) => `- ${c.name}: $${Number(c.value || 0).toFixed(2)}`)
				.join("\n")}
				Goals (progress %):
				${(goals || [])
				.map(
						(g: any) =>
						`- ${g.type === "debt" ? "Debt" : "Saving"}: ${g.name} — ${g.progress || 0}%`
				)
				.join("\n")}
				Please return 3-5 bullet points. Each under 20 words. Include 1 quick win and 1 longer-term habit.
		`.trim();

		const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
			},
			body: JSON.stringify({
				model: "meta-llama/llama-3.3-8b-instruct:free",
				messages: [
					{
						role: "system",
						content:
							"You are a concise, supportive budgeting coach. Avoid disclaimers. No moralizing.",
					},
					{ role: "user", content: prompt },
				],
				temperature: 0.6,
				max_tokens: 300,
			}),
		});
		if(!resp.ok) {
			const text = await resp.text();
			return NextResponse.json(
				{ error: `OpenRouter error: ${text}` },
				{ status: 500 }
			);
		}
		const data = await resp.json();
		const text =
			data?.choices?.[0]?.message?.content?.trim() ||
			"I couldn't generate your AI insight right now, sorry :(";

		return NextResponse.json({ text });
	}
	catch (e: any) {
		return NextResponse.json(
			{ error: e?.message || "Unknown error" },
			{ status: 500 }
		);
	}
}