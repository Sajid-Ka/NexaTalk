export default function ChatMessagesSkeleton() {
    return (
        <div className="space-y-5 p-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="flex animate-pulse gap-3"
                >
                    <div className="h-10 w-10 rounded-full bg-white/5" />

                    <div className="space-y-2">
                        <div className="h-4 w-24 rounded bg-white/5" />
                        <div className="h-12 w-64 rounded-xl bg-white/5" />
                    </div>
                </div>
            ))}
        </div>
    );
}