export default function Loader({title}: Readonly<{title: string}>) {
    const text = `Loading ${title}...`;
    const testSplit = text.split("");

    return (
        <div className="h-[90vh] flex justify-center items-center gap-1 text-lg font-medium">
            {testSplit.map((letter, index) => (
                <span
                    key={letter + index}
                    className="animate-bounce"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    {letter}
                </span>
            ))}
        </div>
    )
}
