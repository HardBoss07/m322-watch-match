import React, { useState } from 'react';
import { FilterSettings, StreamingProvider } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface SettingsModalProps {
  filters: FilterSettings;
  onSave: (newFilters: FilterSettings) => void;
  onClose: () => void;
  onOpenOnboarding?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  filters,
  onSave,
  onClose,
  onOpenOnboarding,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterSettings>({ ...filters });
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const toggleProvider = (p: StreamingProvider) => {
    setLocalFilters((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [p]: !prev.providers[p],
      },
    }));
  };

  const handleSave = () => {
    onSave(localFilters);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 900);
  };

  const providerConfigs: { id: StreamingProvider; name: string; tag: string; color: string; icon: string }[] = [
    { id: 'netflix', name: 'Netflix', tag: 'N', color: '#e50914', icon: 'subscriptions' },
    { id: 'disney', name: 'Disney+', tag: 'D+', color: '#113ccf', icon: 'tv' },
    { id: 'prime', name: 'Prime Video', tag: 'Prime', color: '#00a8e1', icon: 'play_circle' },
    { id: 'crunchyroll', name: 'Crunchyroll', tag: 'CR', color: '#f47521', icon: 'animation' },
    { id: 'apple', name: 'Apple TV+', tag: 'Apple', color: '#a3a3a3', icon: 'tv' },
    { id: 'paramount', name: 'Paramount+', tag: 'P+', color: '#0064ff', icon: 'movie' },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-[#131313] overflow-y-auto flex flex-col animate-in fade-in duration-150">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-30 bg-[#131313]/90 backdrop-blur-xl border-b border-[#262626] h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={onClose}
            aria-label="Zurück"
            variant="ghost"
            size="md"
            radius="full"
            className="-ml-2 text-white hover:text-[#d80b69]"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </IconButton>
          <h1 className="text-sm font-bold text-white">Filter & Einstellungen</h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          radius="md"
          onClick={handleSave}
          leftIcon={<span className="material-symbols-outlined text-[15px]">check</span>}
        >
          Speichern
        </Button>
      </header>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 gap-5 pb-24">
        {/* Intro */}
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Streaming & Filter</h2>
          <p className="text-xs text-[#a3a3a3] mt-0.5">Präferenzen für das Swipe-Deck verwalten</p>
        </div>

        {/* Section 1: Streaming Providers */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#d80b69] text-[18px] icon-filled">
              subscriptions
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Aktive Streaming-Dienste
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {providerConfigs.map((p) => {
              const isSelected = localFilters.providers[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProvider(p.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#1c1b1b] border-[#3a3a3a] shadow-sm'
                      : 'bg-[#161616]/60 border-[#262626] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                      style={{ backgroundColor: isSelected ? p.color : '#222222' }}
                    >
                      {p.tag}
                    </div>
                    <span className="text-xs font-bold text-white truncate">{p.name}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#d80b69] text-white shadow-sm'
                        : 'bg-[#262626] text-[#737373]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {isSelected ? 'check' : 'remove'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Filters & Preferences */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ffd405] text-[18px] icon-filled">
              tune
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Filter & Präferenzen
            </h3>
          </div>

          <div className="flex flex-col bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl overflow-hidden divide-y divide-[#262626]">
            {/* German Audio Switch */}
            <div
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, onlyDeAudio: !prev.onlyDeAudio }))
              }
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#201f1f] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#ffd405]">
                  <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Nur deutsche Tonspur (DE Audio)</span>
                  <span className="text-[10px] text-[#a3a3a3]">Deutsche Synchronisation bevorzugen</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localFilters.onlyDeAudio}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  localFilters.onlyDeAudio ? 'bg-[#d80b69] justify-end' : 'bg-[#2a2a2a] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* Unreleased Titles Switch */}
            <div
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, hideUnreleased: !prev.hideUnreleased }))
              }
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#201f1f] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#737373]">
                  <span className="material-symbols-outlined text-[18px]">event_busy</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Unveröffentlichte Titel ausblenden</span>
                  <span className="text-[10px] text-[#a3a3a3]">Nur sofort streambare Titel anzeigen</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localFilters.hideUnreleased}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  localFilters.hideUnreleased ? 'bg-[#d80b69] justify-end' : 'bg-[#2a2a2a] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* Runtime Slider */}
            <div className="p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#ffd405]">
                    <span className="material-symbols-outlined text-[18px]">timelapse</span>
                  </div>
                  <span className="text-xs font-bold text-white">Maximale Filmlänge</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-[#0e0e0e] border border-[#2a2a2a] text-[#ffd405] font-bold text-xs font-mono">
                  {localFilters.maxRuntimeMinutes >= 210
                    ? 'Kein Limit'
                    : `${localFilters.maxRuntimeMinutes} min`}
                </span>
              </div>

              <input
                type="range"
                min={80}
                max={210}
                step={10}
                value={localFilters.maxRuntimeMinutes}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    maxRuntimeMinutes: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full h-2 rounded-lg bg-[#262626] appearance-none accent-[#ffd405] cursor-pointer mt-1"
              />
              <div className="flex justify-between text-[10px] text-[#737373]">
                <span>80 min</span>
                <span>150 min</span>
                <span>210+ min (Kein Limit)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Notifications & Alerts */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#d80b69] text-[18px] icon-filled">
              notifications_active
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Benachrichtigungen & Alerts
            </h3>
          </div>

          <div className="flex flex-col bg-[#1c1b1b] border border-[#2a2a2a] rounded-xl overflow-hidden divide-y divide-[#262626]">
            {/* New Seasons Switch */}
            <div
              onClick={() =>
                setLocalFilters((prev) => ({ ...prev, pushNewSeasons: !prev.pushNewSeasons }))
              }
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#201f1f] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#d80b69]">
                  <span className="material-symbols-outlined text-[18px]">update</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Neue Staffeln verfolgter Serien</span>
                  <span className="text-[10px] text-[#a3a3a3]">Push-Info bei neuen Episoden</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localFilters.pushNewSeasons}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  localFilters.pushNewSeasons ? 'bg-[#d80b69] justify-end' : 'bg-[#2a2a2a] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* Friend Matches Switch */}
            <div
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  pushFriendRecommendations: !prev.pushFriendRecommendations,
                }))
              }
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#201f1f] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#ffd405]">
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Freundes-Empfehlungen melden</span>
                  <span className="text-[10px] text-[#a3a3a3]">Hinweis bei gemeinsamen Matches</span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={localFilters.pushFriendRecommendations}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  localFilters.pushFriendRecommendations
                    ? 'bg-[#d80b69] justify-end'
                    : 'bg-[#2a2a2a] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: Account & Security */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">security</span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Konto & Sicherheit</h3>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => alert('Cache und gespeicherte Daten wurden geleert.')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-left hover:bg-[#201f1f] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#a3a3a3] text-[18px]">manage_accounts</span>
                <span className="text-xs font-semibold text-white">Gespeicherte Daten & Cache verwalten</span>
              </div>
              <span className="material-symbols-outlined text-[#737373] text-[18px]">chevron_right</span>
            </button>

            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] text-left hover:bg-[#201f1f] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ffd405] text-[18px]">lock_reset</span>
                  <span className="text-xs font-semibold text-white">Anmeldedaten & Onboarding Setup</span>
                </div>
                <span className="material-symbols-outlined text-[#737373] text-[18px]">chevron_right</span>
              </button>
            )}

            <Button
              variant="outline"
              size="md"
              radius="md"
              fullWidth
              onClick={() => {
                if (onOpenOnboarding) onOpenOnboarding();
              }}
              leftIcon={<span className="material-symbols-outlined text-[18px]">logout</span>}
              className="mt-1 text-[#ffb4ab] border-[#3a3a3a] hover:border-red-500/50 hover:bg-red-500/10"
            >
              Ausloggen
            </Button>
          </div>
        </section>

        {/* Bottom CTA Action Button */}
        <div className="pt-2 flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            radius="md"
            fullWidth
            onClick={handleSave}
            leftIcon={<span className="material-symbols-outlined text-[20px]">sync_saved_locally</span>}
            className="font-bold shadow-xl shadow-[#d80b69]/25"
          >
            Filter speichern & anwenden
          </Button>

          {showSavedFeedback && (
            <div className="w-full py-2 px-3 rounded-xl bg-[#1c1b1b] border border-[#ffd405]/50 text-[#ffd405] text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-in fade-in duration-150">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Abo-Filter synchronisiert! Swipe-Deck wird aktualisiert.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
