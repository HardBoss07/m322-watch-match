import React, { useState } from 'react';
import { FilterSettings, StreamingProvider } from '../types';
import { Button, IconButton, ButtonIcon } from './ui/button';

interface OnboardingModalProps {
  onClose: () => void;
  onComplete: (userEmail: string, filters: Partial<FilterSettings>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<'auth' | 'prefs' | 'forgot_password'>('auth');
  const [email, setEmail] = useState('alex@watchmatch.io');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Sci-Fi', 'Thriller', 'Action', 'Anime']);
  const [selectedProviders, setSelectedProviders] = useState<Record<StreamingProvider, boolean>>({
    netflix: true,
    disney: false,
    prime: true,
    crunchyroll: false,
    apple: false,
    paramount: false,
  });
  const [deAudioPref, setDeAudioPref] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleProvider = (provider: StreamingProvider) => {
    setSelectedProviders((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  const genresList = [
    { name: 'Sci-Fi', icon: 'rocket_launch' },
    { name: 'Thriller', icon: 'fingerprint' },
    { name: 'Anime', icon: 'brush' },
    { name: 'Comedy', icon: 'sentiment_very_satisfied' },
    { name: 'Drama', icon: 'theater_comedy' },
    { name: 'Horror', icon: 'skull' },
    { name: 'Action', icon: 'flash_on' },
    { name: 'Doku', icon: 'public' },
  ];

  const handleFinish = () => {
    onComplete(email, {
      providers: selectedProviders,
      onlyDeAudio: deAudioPref,
    });
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#131313] overflow-y-auto flex flex-col animate-in fade-in duration-150">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full p-4 pb-12">
        {/* Top Close Button */}
        <div className="flex justify-end">
          <IconButton
            onClick={onClose}
            aria-label="Schließen"
            variant="secondary"
            size="md"
            radius="full"
            className="text-[#a3a3a3] hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </IconButton>
        </div>

        {/* Hero Branding Section */}
        <div className="flex flex-col items-center text-center pt-2 pb-6">
          <div className="relative mb-3">
            <img
              src="/watchmatch-icon.svg"
              alt="WatchMatch Icon"
              className="w-20 h-20 relative z-10 object-contain select-none"
            />
          </div>

          <img
            src="/watchmatch-logo.svg"
            alt="WatchMatch"
            className="h-9 w-auto object-contain my-1 select-none"
          />
          <p className="text-xs text-[#a3a3a3] max-w-[280px] mt-1.5 leading-relaxed">
            Finde gemeinsame Filme und Serien für deinen nächsten Streaming-Abend.
          </p>
        </div>

        {/* Step Indicator Tabs */}
        {step !== 'forgot_password' && (
          <div className="w-full bg-[#161616] border border-[#262626] rounded-xl p-1 mb-6 flex gap-1 shadow-md">
            <Button
              variant={step === 'auth' ? 'secondary' : 'ghost'}
              size="sm"
              radius="md"
              fullWidth
              onClick={() => setStep('auth')}
              className={`font-bold ${
                step === 'auth' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              1. Anmelden
            </Button>
            <Button
              variant={step === 'prefs' ? 'secondary' : 'ghost'}
              size="sm"
              radius="md"
              fullWidth
              onClick={() => setStep('prefs')}
              className={`font-bold ${
                step === 'prefs' ? 'bg-[#262626] text-white shadow-sm' : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              2. Filter & Setup
            </Button>
          </div>
        )}

        {/* STEP 1: AUTHENTICATION */}
        {step === 'auth' && (
          <section className="flex flex-col gap-4">
            {/* Social Quick Auth Stack */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="lg"
                radius="md"
                fullWidth
                onClick={() => setStep('prefs')}
                className="bg-white text-black hover:bg-[#f0f0f0] border-transparent font-bold"
                leftIcon={
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.66-.82 1.11-1.96.99-3.1-.96.04-2.13.64-2.81 1.45-.6.7-1.13 1.83-.99 2.94 1.07.08 2.15-.47 2.81-1.29z"></path>
                  </svg>
                }
              >
                Mit Apple fortfahren
              </Button>

              <Button
                variant="secondary"
                size="lg"
                radius="md"
                fullWidth
                onClick={() => setStep('prefs')}
                className="font-bold"
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    ></path>
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    ></path>
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    ></path>
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    ></path>
                  </svg>
                }
              >
                Mit Google fortfahren
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-[#262626]"></div>
              <span className="text-[10px] uppercase text-[#737373] tracking-wider font-semibold">
                oder mit E-Mail
              </span>
              <div className="flex-1 h-px bg-[#262626]"></div>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('prefs');
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#d4d4d4]">E-Mail-Adresse</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#737373] text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@watchmatch.io"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#18181b] border border-[#262626] text-xs text-white placeholder:text-[#525252] outline-none focus:border-[#d80b69]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-[#d4d4d4]">Passwort</label>
                  <button
                    type="button"
                    onClick={() => setStep('forgot_password')}
                    className="text-[11px] text-[#ffd405] hover:underline font-semibold cursor-pointer"
                  >
                    Vergessen?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#737373] text-[18px]">
                    lock
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#18181b] border border-[#262626] text-xs text-white placeholder:text-[#525252] outline-none focus:border-[#d80b69]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                radius="md"
                fullWidth
                rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                className="mt-1 font-bold shadow-none"
              >
                Weiter mit E-Mail
              </Button>
            </form>
          </section>
        )}

        {/* STEP 2: PREFERENCES SETUP */}
        {step === 'prefs' && (
          <section className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Deine Streaming-DNA</h2>
              <p className="text-xs text-[#a3a3a3] mt-0.5">
                Wähle Genres und Abos für punktgenaue Film- & Serienmatches.
              </p>
            </div>

            {/* Favorite Genres */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#ffd405] text-[18px] icon-filled">
                    category
                  </span>
                  <span>Lieblings-Genres</span>
                </label>
                <span className="text-[10px] text-[#a3a3a3]">min. 2 wählen</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {genresList.map((g) => {
                  const isSel = selectedGenres.includes(g.name);
                  return (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => toggleGenre(g.name)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                        isSel
                          ? 'bg-[#d80b69]/15 border-[#d80b69] text-white shadow-sm'
                          : 'bg-[#1c1b1b] border-[#2a2a2a] text-[#a3a3a3] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">{g.icon}</span>
                        <span>{g.name}</span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-[14px] ${
                          isSel ? 'text-[#ffb1c3] opacity-100' : 'opacity-0'
                        }`}
                      >
                        check
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Streaming Subscriptions */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00a8e1] text-[18px] icon-filled">
                  play_circle
                </span>
                <span>Deine Streaming-Abos</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {(['netflix', 'prime', 'disney', 'apple', 'crunchyroll'] as StreamingProvider[]).map((prov) => {
                  const isSel = selectedProviders[prov];
                  const labels: Record<StreamingProvider, { name: string; color: string }> = {
                    netflix: { name: 'Netflix', color: '#e50914' },
                    prime: { name: 'Prime Video', color: '#00a8e1' },
                    disney: { name: 'Disney+', color: '#113ccf' },
                    apple: { name: 'Apple TV+', color: '#ffffff' },
                    crunchyroll: { name: 'Crunchyroll', color: '#f47521' },
                    paramount: { name: 'Paramount+', color: '#0064ff' },
                  };
                  return (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => toggleProvider(prov)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSel
                          ? 'bg-[#201f1f] border-[#d80b69] text-white shadow-sm'
                          : 'bg-[#161616] border-[#2a2a2a] text-[#a3a3a3]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: labels[prov].color }}
                      ></span>
                      <span>{labels[prov].name}</span>
                      {isSel && (
                        <span className="material-symbols-outlined text-[14px] text-[#ffd405]">
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DE Audio Preference Card */}
            <div className="p-3.5 rounded-xl bg-[#1c1b1b] border border-[#2a2a2a] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#fbd100]/15 flex items-center justify-center text-[#ffd405]">
                  <span className="material-symbols-outlined text-[20px] icon-filled">translate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">DE-Audio Vorzug</span>
                  <span className="text-[10px] text-[#a3a3a3]">Deutsche Tonspur bevorzugt filtern</span>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={deAudioPref}
                onClick={() => setDeAudioPref(!deAudioPref)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  deAudioPref ? 'bg-[#d80b69] justify-end' : 'bg-[#2a2a2a] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
              </button>
            </div>

            {/* Submit */}
            <Button
              variant="primary"
              size="lg"
              radius="md"
              fullWidth
              onClick={handleFinish}
              leftIcon={<span className="material-symbols-outlined text-[18px] icon-filled">bolt</span>}
              className="mt-1 font-bold shadow-none"
            >
              Match-Deck Starten
            </Button>
          </section>
        )}

        {/* FORGOT PASSWORD MODAL FLOW */}
        {step === 'forgot_password' && (
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Passwort zurücksetzen</h2>
              <p className="text-xs text-[#a3a3a3] mt-0.5">
                Gib deine E-Mail-Adresse ein. Wir senden dir einen Wiederherstellungslink.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-[#201f1f] border border-[#ffd405] text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl text-[#ffd405]">mark_email_read</span>
                <span className="text-xs font-bold text-white">Wiederherstellungslink versendet!</span>
                <p className="text-[11px] text-[#a3a3a3]">
                  Prüfe dein Postfach für {email}. Klicke auf den Link, um ein neues Passwort zu vergeben.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  radius="md"
                  onClick={() => {
                    setForgotSent(false);
                    setStep('auth');
                  }}
                  className="mt-2"
                >
                  Zurück zum Login
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSent(true);
                }}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#d4d4d4]">E-Mail-Adresse</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#18181b] border border-[#262626] text-xs text-white outline-none focus:border-[#d80b69]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  radius="md"
                  fullWidth
                  className="font-bold shadow-lg"
                >
                  Link anfordern
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  radius="md"
                  fullWidth
                  onClick={() => setStep('auth')}
                  className="text-xs text-[#a3a3a3] hover:text-white"
                >
                  Zurück zur Anmeldung
                </Button>
              </form>
            )}
          </section>
        )}

        {/* Legal Trust Notice */}
        <div className="mt-8 pt-4 text-center">
          <p className="text-[10px] text-[#737373] max-w-[300px] mx-auto leading-relaxed">
            Keine Abos direkt über die App – wir finden schnell und neutral heraus, wo deine Filme & Serien gerade laufen.
          </p>
        </div>
      </div>
    </div>
  );
};
