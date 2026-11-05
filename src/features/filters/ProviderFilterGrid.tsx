import React from "react";
import { StreamingProvider } from "../../types";

interface ProviderConfig {
  id: StreamingProvider;
  name: string;
  tag: string;
  color: string;
}

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  { id: "netflix", name: "Netflix", tag: "N", color: "#e50914" },
  { id: "disney", name: "Disney+", tag: "D+", color: "#113ccf" },
  { id: "prime", name: "Prime Video", tag: "Prime", color: "#00a8e1" },
  { id: "crunchyroll", name: "Crunchyroll", tag: "CR", color: "#f47521" },
  { id: "apple", name: "Apple TV+", tag: "Apple", color: "#a3a3a3" },
  { id: "paramount", name: "Paramount+", tag: "P+", color: "#0064ff" },
];

interface ProviderFilterGridProps {
  providers: Record<StreamingProvider, boolean>;
  onToggleProvider: (provider: StreamingProvider) => void;
}

/**
 * ProviderFilterGrid:
 * Decoupled filter sub-component for selecting active streaming subscriptions.
 * Complies with WCAG 2.1 AA: 44x44px touch targets, dual-encoding (icon + text), aria-pressed.
 */
export const ProviderFilterGrid: React.FC<ProviderFilterGridProps> = ({
  providers,
  onToggleProvider,
}) => {
  const activeCount = Object.values(providers).filter(Boolean).length;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-secondary text-[18px] icon-filled"
            aria-hidden="true"
          >
            subscriptions
          </span>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Aktive Streaming-Dienste
          </h3>
        </div>
        <span className="text-[11px] font-mono text-secondary font-bold">
          {activeCount} aktiv
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PROVIDER_CONFIGS.map((p) => {
          const isSelected = Boolean(providers[p.id]);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggleProvider(p.id)}
              aria-pressed={isSelected}
              className={`p-3 min-h-[48px] rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                isSelected
                  ? "bg-surface-container-low border-secondary shadow-md shadow-secondary/10 ring-1 ring-secondary/30"
                  : "bg-surface-container-low/70 border-surface-bright opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                  style={{
                    backgroundColor: isSelected ? p.color : "#222222",
                  }}
                  aria-hidden="true"
                >
                  {p.tag}
                </div>
                <span
                  className={`text-xs font-bold truncate ${
                    isSelected ? "text-white" : "text-[#d6d4d3]"
                  }`}
                >
                  {p.name}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "bg-secondary text-surface shadow-sm font-bold"
                    : "bg-surface-bright text-[#d6d4d3]"
                }`}
                aria-hidden="true"
              >
                <span className="material-symbols-outlined text-[13px] font-bold">
                  {isSelected ? "check" : "remove"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
