import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LOFI_SONGS } from '../../data/initialData';
import { Play, Pause, Music, Volume2, VolumeX, Sparkles, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface AudioPlayerWidgetProps {
  ambientVolumes: Record<string, number>;
  onAmbientVolumeChange: (key: string, vol: number) => void;
  isLofiPlaying: boolean;
  activeLofiTrackId: string;
  lofiVolume: number;
  onToggleLofi: (playing?: boolean, trackId?: string) => void;
  onLofiVolumeChange: (vol: number) => void;
  onSelectLofiTrack: (trackId: string) => void;
  onApplyPreset: (presetName: string) => void;
}

export const AudioPlayerWidget: React.FC<AudioPlayerWidgetProps> = ({
  ambientVolumes,
  onAmbientVolumeChange,
  isLofiPlaying,
  activeLofiTrackId,
  lofiVolume,
  onToggleLofi,
  onLofiVolumeChange,
  onSelectLofiTrack,
  onApplyPreset,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'lofi' | 'spotify' | 'ambient'>('lofi');

  const currentSong = LOFI_SONGS.find((s) => s.id === activeLofiTrackId) || LOFI_SONGS[0];

  const ambientChannels = [
    { key: 'rain', label: 'Raindrops', icon: '🌧️', desc: 'Gentle window drizzle' },
    { key: 'cafe', label: 'Cafe Murmur', icon: '☕', desc: 'Warm coffee shop buzz' },
    { key: 'keyboard', label: 'Keyboard ASMR', icon: '⌨️', desc: 'Satisfying key clacks' },
    { key: 'fireplace', label: 'Fireplace', icon: '🔥', desc: 'Cozy glowing crackle' },
    { key: 'chimes', label: 'Wind Chimes', icon: '🍃', desc: 'Peaceful garden bells' },
    { key: 'waves', label: '432Hz Alpha', icon: '🌊', desc: 'Binaural deep focus' },
  ];

  return (
    <motion.div
      id="audio-player-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] shadow-xl p-5 text-slate-700 font-['Fredoka'] max-w-[340px] w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center text-slate-700 shadow-xs">
            <Music size={18} className="text-[#8E8DBE]" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-slate-700">Soundscape & Spotify</h3>
            <p className="text-[11px] text-slate-500 font-['Nunito'] font-medium">Ambient & Music Player</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Sub tabs */}
          <div className="flex bg-white/30 border border-white/60 p-0.5 rounded-2xl text-[11px]">
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                setActiveTab('lofi');
              }}
              className={`px-2 py-1 rounded-xl transition-all font-semibold ${
                activeTab === 'lofi' ? 'bg-white/90 shadow-xs text-slate-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lo-Fi
            </button>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                setActiveTab('spotify');
              }}
              className={`px-2 py-1 rounded-xl transition-all font-semibold ${
                activeTab === 'spotify' ? 'bg-white/90 shadow-xs text-emerald-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Spotify
            </button>
            <button
              onClick={() => {
                audioEngine.playClickSfx();
                setActiveTab('ambient');
              }}
              className={`px-2 py-1 rounded-xl transition-all font-semibold ${
                activeTab === 'ambient' ? 'bg-white/90 shadow-xs text-indigo-800' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mixer
            </button>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-xl bg-white/40 border border-white/60 hover:bg-white/70 text-slate-600 transition-colors"
          >
            {isMinimized ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="mt-3">
          {activeTab === 'lofi' ? (
            /* LO-FI SYNTH MUSIC PLAYER */
            <div className="space-y-3">
              {/* Vinyl / Track Card */}
              <div className="p-3.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/80 flex items-center gap-3 shadow-xs">
                {/* Animated Vinyl Disc */}
                <motion.div
                  animate={{ rotate: isLofiPlaying ? 360 : 0 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="w-13 h-13 rounded-full bg-slate-800 border-2 border-[#FFE082] shadow-md flex items-center justify-center relative flex-shrink-0"
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-[#FFD1DC] border border-white flex items-center justify-center text-[9px] text-slate-800 font-bold">
                    ♪
                  </div>
                  {/* Vinyl grooves */}
                  <div className="absolute inset-1 rounded-full border border-white/10" />
                </motion.div>

                {/* Track Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-800 truncate">{currentSong.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-['Nunito']">{currentSong.mood} • {currentSong.tempo} BPM</p>
                  {/* Equalizer Visualizer Bars */}
                  <div className="flex gap-1 items-end h-3 mt-1.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: isLofiPlaying ? [3, 12, 4, 10, 2] : 2,
                        }}
                        transition={{
                          duration: 0.6 + (i % 3) * 0.2,
                          repeat: Infinity,
                          delay: (i * 0.1) % 0.5,
                        }}
                        className="w-1 bg-[#8E8DBE] rounded-full"
                      />
                    ))}
                  </div>
                </div>

                {/* Main Play / Pause Button */}
                <button
                  onClick={() => {
                    audioEngine.playClickSfx();
                    onToggleLofi();
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-slate-800 shadow-md active:scale-95 transition-all border border-white/80 ${
                    isLofiPlaying ? 'bg-[#FFD1DC] hover:bg-pink-200' : 'bg-[#C1E1C1] hover:bg-[#b0dcb0]'
                  }`}
                >
                  {isLofiPlaying ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                </button>
              </div>

              {/* Lo-Fi Track Playlist */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Melody</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {LOFI_SONGS.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => {
                        audioEngine.playClickSfx();
                        onSelectLofiTrack(song.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all font-['Nunito'] font-bold ${
                        activeLofiTrackId === song.id
                          ? 'bg-white/90 border-white/90 shadow-sm ring-2 ring-[#FFD1DC]/40 text-slate-800'
                          : 'bg-white/40 border-white/60 text-slate-600 hover:bg-white/70'
                      }`}
                    >
                      <div className="truncate text-xs font-bold">{song.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{song.mood}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lo-Fi Music Volume Slider */}
              <div className="flex items-center gap-2 pt-1">
                <Volume2 size={16} className="text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={lofiVolume}
                  onChange={(e) => onLofiVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#8E8DBE] h-1.5 bg-white/50 rounded-lg cursor-pointer border border-white/40"
                />
                <span className="text-xs font-bold text-slate-600 w-8 text-right">
                  {Math.round(lofiVolume * 100)}%
                </span>
              </div>
            </div>
          ) : activeTab === 'spotify' ? (
            /* SPOTIFY EMBED PLAYER */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-semibold">
                <span className="flex items-center gap-1 text-emerald-700">
                  🎧 Official Spotify Lo-Fi Beats
                </span>
                <span className="text-[10px] text-slate-500">HD Streaming</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/80 shadow-sm bg-white/50">
                <iframe
                  style={{ borderRadius: '16px' }}
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Spotify Lo-Fi Beats"
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center font-['Nunito']">
                Connect your Spotify account directly above to enjoy unlimited ad-free study tunes!
              </p>
            </div>
          ) : (
            /* AMBIENT MIXER CHANNELS */
            <div className="space-y-2.5">
              {/* Quick Presets */}
              <div className="flex items-center justify-between pb-1.5 border-b border-white/50">
                <span className="text-[11px] font-bold text-slate-500">Presets:</span>
                <div className="flex gap-1 text-[10px] font-bold">
                  <button
                    onClick={() => {
                      audioEngine.playClickSfx();
                      onApplyPreset('rainyCafe');
                    }}
                    className="px-2 py-0.5 bg-[#FFD1DC]/50 text-slate-700 rounded-lg border border-white/60 hover:bg-[#FFD1DC]"
                  >
                    🌧️ Rainy Cafe
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClickSfx();
                      onApplyPreset('fireplaceNight');
                    }}
                    className="px-2 py-0.5 bg-[#E6E6FA]/60 text-slate-700 rounded-lg border border-white/60 hover:bg-[#E6E6FA]"
                  >
                    🔥 Night Study
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClickSfx();
                      onApplyPreset('muteAll');
                    }}
                    className="px-2 py-0.5 bg-white/40 text-slate-600 rounded-lg border border-white/60 hover:bg-white/70"
                  >
                    Mute All
                  </button>
                </div>
              </div>

              {/* Channel Sliders */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                {ambientChannels.map((ch) => {
                  const vol = ambientVolumes[ch.key] || 0;
                  const isActive = vol > 0.01;

                  return (
                    <div
                      key={ch.key}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-white/80 backdrop-blur-xs border-white/90 shadow-xs'
                          : 'bg-white/40 border-white/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{ch.icon}</span>
                          <div>
                            <span className="text-xs font-bold text-slate-700">{ch.label}</span>
                            <span className="text-[10px] text-slate-500 ml-1.5 font-['Nunito'] font-normal">
                              {ch.desc}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">
                          {isActive ? `${Math.round(vol * 100)}%` : 'Off'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            audioEngine.playClickSfx();
                            onAmbientVolumeChange(ch.key, isActive ? 0 : 0.5);
                          }}
                          className={`p-1 rounded-lg text-[10px] transition-colors ${
                            isActive ? 'bg-[#C1E1C1] text-slate-800 font-bold' : 'bg-white/50 text-slate-500'
                          }`}
                        >
                          {isActive ? <Volume2 size={12} /> : <VolumeX size={12} />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={vol}
                          onChange={(e) => onAmbientVolumeChange(ch.key, parseFloat(e.target.value))}
                          className="w-full accent-[#C1E1C1] h-1.5 bg-white/50 rounded-lg cursor-pointer border border-white/40"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
