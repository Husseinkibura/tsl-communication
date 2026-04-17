import { CameraStatus } from "@/hooks/useCamera";
import { Loader2, CheckCircle2, AlertCircle, Camera as CamIcon } from "lucide-react";

interface Props {
  status: CameraStatus;
  modelReady: boolean;
  fps: number;
  error?: string | null;
}

export function StatusIndicator({ status, modelReady, fps, error }: Props) {
  const items = [
    {
      label: "Camera",
      ok: status === "ready",
      loading: status === "loading",
      icon: CamIcon,
    },
    {
      label: "AI Model",
      ok: modelReady,
      loading: !modelReady && !error,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="glass rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground/80">System Status</h3>
        {fps > 0 && (
          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {fps} FPS
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {items.map((it) => {
          const Icon = it.loading ? Loader2 : it.ok ? CheckCircle2 : AlertCircle;
          return (
            <div key={it.label} className="flex items-center gap-2 text-sm">
              <Icon
                className={`h-4 w-4 ${
                  it.loading
                    ? "animate-spin text-muted-foreground"
                    : it.ok
                    ? "text-success"
                    : "text-destructive"
                }`}
              />
              <span className="text-foreground/80">{it.label}</span>
              <span
                className={`ml-auto text-xs ${
                  it.ok ? "text-success" : it.loading ? "text-muted-foreground" : "text-destructive"
                }`}
              >
                {it.loading ? "Loading..." : it.ok ? "Ready" : "Error"}
              </span>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-lg p-2 mt-2">{error}</p>
      )}
    </div>
  );
}
