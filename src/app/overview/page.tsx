import OverviewContent from "@overview/OverviewContent";

export default function Page() {
    return (
        <main className="flex flex-col flex-1 h-full">
			<section className="flex-1 overflow-y-auto">
				<OverviewContent />
			</section>
		</main>
    )
}
