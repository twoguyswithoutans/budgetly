import dynamic from "next/dynamic";

export const ChartLazyLoader = dynamic(() =>
    import("@charts/BaseBarChart"),{
        ssr: false,
        loading: () => <div className="h-40 w-full animate-pulse rounded-md bg-muted" />,
    }
);