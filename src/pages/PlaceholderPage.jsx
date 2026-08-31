import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import { Construction } from "lucide-react";

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <GlassPanel className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <Construction className="h-8 w-8 text-navy-400" />
        <p className="font-display text-[15px] font-semibold text-navy-50">
          Not built yet
        </p>
        <p className="max-w-sm text-[13px] text-navy-400">
          This section is scaffolded in navigation but the module itself comes in the
          next pass, once the Overview page and shell are signed off.
        </p>
      </GlassPanel>
    </div>
  );
}