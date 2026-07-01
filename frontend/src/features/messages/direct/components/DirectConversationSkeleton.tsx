export default function DirectConversationSkeleton() {
    return (
        <div className="space-y-2 px-2 py-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="flex animate-pulse items-center gap-3 rounded-xl px-3 py-3"
                >
                    <div className="h-12 w-12 rounded-full bg-white/5" />

                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 rounded bg-white/5" />
                        <div className="h-2 w-24 rounded bg-white/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}