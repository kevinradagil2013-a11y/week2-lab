import { useEffect, useRef, useState } from 'react';

const SCENE_DURATION = 7800;
const CROSSFADE_DURATION = 1800;
const SHARK_DURATION = 9500;

const oceanScenes = [
  {
    src: '/ocean/21.mp4',
    eyebrow: 'OCEAN LIVE',
    title: 'THE OPEN OCEAN',
    description: 'A journey begins beyond the horizon.',
  },
  {
    src: '/ocean/22.mp4',
    eyebrow: 'THE BLUE',
    title: 'INTO OPEN WATER',
    description: 'Following the movement of the living ocean.',
  },
  {
    src: '/ocean/23.mp4',
    eyebrow: 'DESCENT',
    title: 'BENEATH THE SURFACE',
    description: 'Entering a world hidden from the shore.',
  },
  {
    src: '/ocean/24.mp4',
    eyebrow: 'DEEP OCEAN',
    title: 'INTO THE BLUE',
    description: 'Where light begins to disappear.',
  },
];

const sharkScene = {
  src: '/ocean/25.mp4',
  eyebrow: 'SPECIES IN FOCUS',
  title: 'GREAT WHITE',
  description: 'Carcharodon carcharias',
};

type Scene = {
  src: string;
  eyebrow: string;
  title: string;
  description: string;
};

function VideoLayer({
  scene,
  active,
  visible,
  onEnded,
}: {
  scene: Scene;
  active: boolean;
  visible: boolean;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (active) {
      video.currentTime = 0;

      const start = () => {
        video.play().catch(() => {});
      };

      if (video.readyState >= 2) {
        start();
      } else {
        video.addEventListener('loadeddata', start, { once: true });
      }

      return () => {
        video.removeEventListener('loadeddata', start);
      };
    }

    video.pause();
  }, [active]);

  return (
    <video
      ref={videoRef}
      src={scene.src}
      muted
      playsInline
      preload="auto"
      onEnded={onEnded}
      style={{
        position: 'absolute',
        inset: '-2%',
        width: '104%',
        height: '104%',
        objectFit: 'cover',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(1.035)',
        transition: `
          opacity ${CROSSFADE_DURATION}ms cubic-bezier(.22,.61,.36,1),
          transform ${SCENE_DURATION}ms cubic-bezier(.16,1,.3,1)
        `,
        filter: active
          ? 'contrast(1.06) saturate(.92) brightness(.86)'
          : 'contrast(1.02) saturate(.86) brightness(.7)',
        background: '#020609',
        pointerEvents: 'none',
      }}
    />
  );
}

function CinematicFrame() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          background: `
            linear-gradient(
              180deg,
              rgba(0,0,0,.72) 0%,
              rgba(0,0,0,.08) 24%,
              rgba(0,0,0,0) 50%,
              rgba(0,0,0,.12) 72%,
              rgba(0,0,0,.82) 100%
            )
          `,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 11,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 180px rgba(0,0,0,.55)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 12,
          pointerEvents: 'none',
          opacity: 0.035,
          backgroundImage: `
            radial-gradient(
              rgba(255,255,255,.9) 0.5px,
              transparent 0.5px
            )
          `,
          backgroundSize: '4px 4px',
          mixBlendMode: 'soft-light',
        }}
      />
    </>
  );
}

function TopBar({ isShark }: { isShark: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '30px 42px',
        color: '#fff',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.34em',
            opacity: 0.62,
          }}
        >
          NEBULAE
        </div>

        <div
          style={{
            marginTop: 7,
            fontSize: 17,
            fontWeight: 650,
            letterSpacing: '0.14em',
          }}
        >
          OCEAN LIVE
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.22em',
          opacity: 0.82,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ff453a',
            boxShadow: '0 0 12px rgba(255,69,58,.75)',
          }}
        />

        {isShark ? 'SPECIES FOCUS' : 'LIVE EXPEDITION'}
      </div>
    </div>
  );
}

function LowerThird({
  scene,
  isShark,
}: {
  scene: Scene;
  isShark: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 42,
        bottom: 48,
        zIndex: 30,
        maxWidth: 620,
        color: '#fff',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        animation: 'oceanLowerThird 1200ms cubic-bezier(.16,1,.3,1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 13,
        }}
      >
        <div
          style={{
            width: 28,
            height: 1,
            background: 'rgba(255,255,255,.65)',
          }}
        />

        <div
          style={{
            fontSize: 9,
            fontWeight: 750,
            letterSpacing: '0.32em',
            opacity: 0.72,
          }}
        >
          {scene.eyebrow}
        </div>
      </div>

      <div
        style={{
          fontSize: isShark ? 'clamp(42px, 6vw, 82px)' : 'clamp(34px, 5vw, 68px)',
          lineHeight: 0.94,
          fontWeight: 300,
          letterSpacing: '-0.045em',
          textShadow: '0 4px 28px rgba(0,0,0,.5)',
        }}
      >
        {scene.title}
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.035em',
          opacity: 0.72,
        }}
      >
        {scene.description}
      </div>

      {isShark && (
        <div
          style={{
            marginTop: 15,
            fontSize: 9,
            fontWeight: 650,
            letterSpacing: '0.27em',
            opacity: 0.46,
          }}
        >
          CARCHARODON CARCHARIAS
        </div>
      )}
    </div>
  );
}

function ProgressLine({
  progress,
  isShark,
}: {
  progress: number;
  isShark: boolean;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 42,
        right: 42,
        bottom: 27,
        zIndex: 30,
        height: 1,
        background: 'rgba(255,255,255,.16)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: isShark
            ? 'rgba(255,255,255,.9)'
            : 'rgba(255,255,255,.7)',
          transition: 'width 180ms linear',
        }}
      />
    </div>
  );
}

export function SharkTestScene() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [shark, setShark] = useState(false);
  const [progress, setProgress] = useState(0);

  const [currentSlot, setCurrentSlot] = useState<'a' | 'b'>('a');

  const [slotA, setSlotA] = useState<Scene>(oceanScenes[0]);
  const [slotB, setSlotB] = useState<Scene>(oceanScenes[1]);

  const [visibleA, setVisibleA] = useState(true);
  const [visibleB, setVisibleB] = useState(false);

  const transitionLock = useRef(false);

  const currentScene = shark
    ? sharkScene
    : oceanScenes[Math.min(sceneIndex, oceanScenes.length - 1)];

  useEffect(() => {
    if (shark) {
      setProgress(1);
      return;
    }

    const startedAt = performance.now();

    let frame = 0;

    const updateProgress = (now: number) => {
      const elapsed = now - startedAt;
      const value = Math.min(elapsed / SCENE_DURATION, 1);

      setProgress(value);

      if (value < 1) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    frame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(frame);
  }, [sceneIndex, shark]);

  useEffect(() => {
    if (shark || transitionLock.current) return;

    const timer = window.setTimeout(() => {
      if (transitionLock.current) return;

      transitionLock.current = true;

      const nextIndex = sceneIndex + 1;

      if (nextIndex >= oceanScenes.length) {
        setShark(true);
        setProgress(0);

        window.setTimeout(() => {
          transitionLock.current = false;
        }, CROSSFADE_DURATION);

        return;
      }

      const nextScene = oceanScenes[nextIndex];

      if (currentSlot === 'a') {
        setSlotB(nextScene);

        requestAnimationFrame(() => {
          setVisibleB(true);
          setVisibleA(false);
        });
      } else {
        setSlotA(nextScene);

        requestAnimationFrame(() => {
          setVisibleA(true);
          setVisibleB(false);
        });
      }

      setSceneIndex(nextIndex);

      window.setTimeout(() => {
        setCurrentSlot((slot) => (slot === 'a' ? 'b' : 'a'));
        transitionLock.current = false;
      }, CROSSFADE_DURATION);
    }, SCENE_DURATION);

    return () => window.clearTimeout(timer);
  }, [sceneIndex, shark, currentSlot]);

  useEffect(() => {
    if (!shark) return;

    setCurrentSlot('a');
    setSlotA(sharkScene);
    setVisibleA(true);
    setVisibleB(false);

    const restartTimer = window.setTimeout(() => {
      transitionLock.current = true;

      setVisibleA(false);
      setVisibleB(false);

      window.setTimeout(() => {
        setSceneIndex(0);
        setSlotA(oceanScenes[0]);
        setSlotB(oceanScenes[1]);
        setCurrentSlot('a');
        setVisibleA(true);
        setVisibleB(false);
        setProgress(0);
        setShark(false);

        window.setTimeout(() => {
          transitionLock.current = false;
        }, CROSSFADE_DURATION);
      }, CROSSFADE_DURATION);
    }, SHARK_DURATION);

    return () => window.clearTimeout(restartTimer);
  }, [shark]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 680,
        overflow: 'hidden',
        background: '#020609',
        isolation: 'isolate',
      }}
    >
      <style>
        {`
          @keyframes oceanLowerThird {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes oceanSharkReveal {
            0% {
              opacity: 0;
              transform: scale(1.08);
              filter: blur(3px);
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: blur(0);
            }
          }
        `}
      </style>

      <VideoLayer
        scene={slotA}
        active={currentSlot === 'a'}
        visible={visibleA}
      />

      <VideoLayer
        scene={slotB}
        active={currentSlot === 'b'}
        visible={visibleB}
      />

      {shark && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 8,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 52% 48%, rgba(80,145,170,.08), transparent 42%)',
            animation: 'oceanSharkReveal 1800ms ease-out',
          }}
        />
      )}

      <CinematicFrame />

      <TopBar isShark={shark} />

      <LowerThird
        scene={currentScene}
        isShark={shark}
      />

      <ProgressLine
        progress={progress}
        isShark={shark}
      />

      <div
        style={{
          position: 'absolute',
          right: 42,
          bottom: 45,
          zIndex: 30,
          color: 'rgba(255,255,255,.48)',
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '0.22em',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
      >
        NEBULAE / WILDLIFE OBSERVATORY
      </div>
    </div>
  );
}