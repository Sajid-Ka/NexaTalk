import { Hash, Volume2 } from "lucide-react";
import { ChannelType } from "../../../shared/constants/channel.const";
import type { Channel } from "../types";

interface ChannelMainPaneProps {
  channel: Channel | null;
}

export default function ChannelMainPane({ channel }: ChannelMainPaneProps) {
  if (!channel) {
    return (
      <main className="flex min-w-0 flex-1 items-center justify-center bg-[#111214] px-6">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-white">No channel selected</h2>
          <p className="mt-2 text-sm leading-6 text-white/45">
            Create a text or voice channel to prepare this server for future chat and
            voice features.
          </p>
        </div>
      </main>
    );
  }

  const isText = channel.type === ChannelType.TEXT;
  const Icon = isText ? Hash : Volume2;

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#111214]">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/5 px-5">
        <Icon size={20} className="text-white/45" />
        <h1 className="truncate text-base font-bold text-white">{channel.name}</h1>
      </header>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] text-white/70">
            <Icon size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isText ? `# ${channel.name}` : channel.name}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/45">
            {isText
              ? "This text channel is ready. Messaging will be added in the next chat module."
              : "This voice channel is ready. Voice and streaming will be added in the future voice module."}
          </p>
        </div>
      </div>
    </main>
  );
}
