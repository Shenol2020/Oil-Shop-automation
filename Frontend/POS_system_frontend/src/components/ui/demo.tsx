import { SheenPillButton } from "@/components/ui/sheen-pill-button";

export default function SheenPillButtonDemo() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <SheenPillButton width={200} height={60}>
        Get started
      </SheenPillButton>
    </div>
  );
}
