import { Info } from "lucide-react";

interface ServerDashboardErrorStateProps {
  message?: string | null;
}

export default function ServerDashboardErrorState({
  message,
}: ServerDashboardErrorStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <Info size={40} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Server Not Found</h2>
      <p className="text-white/40 max-w-md">
        {message ||
          "The server you are looking for does not exist or you don't have permission to view it."}
      </p>
    </div>
  );
}
