import { TopBar } from "@/components/terminal/top-bar";
import { LeftColumn } from "@/components/terminal/left-column";
import { CenterColumn } from "@/components/terminal/center-column";
import { RightColumn } from "@/components/terminal/right-column";
import { TerminalProvider } from "@/components/terminal/terminal-context";

export default function Page() {
  return (
    <TerminalProvider>
      <main
        className="flex flex-col"
        style={{ height: "100dvh", background: "#0a0f1e", overflow: "hidden" }}
      >
        {/* Top bar */}
        <TopBar />

        {/* Three-column body */}
        <div
          className="flex flex-1 min-h-0"
          style={{ gap: 1, background: "#1e293b" }} // gap shows the border-color
        >
          <LeftColumn />
          <CenterColumn />
          <RightColumn />
        </div>
      </main>
    </TerminalProvider>
  );
}
