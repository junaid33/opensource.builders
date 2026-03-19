'use client';

/**
 * Dreamcatcher rotating geometric animation.
 * Ported from desengs lines.astro — pure CSS animation, no JS.
 * Positioned absolute, centered at top of hero area.
 */
export function Lines() {
  return (
    <>
      <div className="lines-container">
        <div className="straight-one" />
        <div className="straight-two" />
        <div className="circle-one" />
        <div className="circle-two" />
        <div className="outer" />
      </div>

      <style jsx>{`
        .lines-container {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 350px;
          height: 350px;
          background: hsl(var(--background) / 0.4);
          border: 1px solid hsl(var(--border));
          border-radius: 50%;
          opacity: 0.5;
          transform: translate(-50%, -50%);
          animation: lines-rotate 180s linear infinite;
          pointer-events: none;
        }

        .lines-container::before {
          position: absolute;
          inset: 50px;
          content: '';
          background: hsl(var(--background));
          border: 1px dashed hsl(var(--border));
          border-radius: 50%;
        }

        .lines-container::after {
          position: absolute;
          inset: -50px;
          content: '';
          border: 1px dashed hsl(var(--border));
          border-radius: 50%;
        }

        .straight-one {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 350px;
          border: 1px solid hsl(var(--border));
          transform: translate(-50%, -50%);
          animation: lines-rotate 120s linear infinite reverse;
        }

        .straight-one::before,
        .straight-one::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 450px;
          height: 0;
          content: '';
          border: 1px dashed hsl(var(--border));
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .straight-one::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .straight-two {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 350px;
          border: 1px solid hsl(var(--border));
          transform: translate(-50%, -50%);
          animation: lines-rotate 120s linear infinite reverse;
        }

        .circle-one {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid hsl(var(--border));
          border-radius: 50%;
          transform: translateX(-50%);
        }

        .circle-one::before {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          content: '';
          border: 1px solid hsl(var(--border));
          border-radius: 50%;
          transform: translateX(100%);
        }

        .circle-two {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 1px solid hsl(var(--border));
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .circle-two::before {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          content: '';
          border: 1px solid hsl(var(--border));
          border-radius: 50%;
          transform: translateY(100%);
        }

        .outer {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: -100;
          width: 700px;
          height: 700px;
          border: 1px solid hsl(var(--border));
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .outer::before {
          position: absolute;
          inset: -50px;
          content: '';
          background-color: hsl(var(--background));
          background-image: repeating-linear-gradient(
            45deg,
            hsl(var(--border)) 0,
            hsl(var(--border)) 1px,
            hsl(var(--background)) 0,
            hsl(var(--background)) 50%
          );
          background-size: 10px 10px;
          border: 1px dashed hsl(var(--border));
          border-radius: 50%;
          opacity: 0.8;
          mask-image: radial-gradient(
            circle at center center,
            transparent 350px,
            #000 35px
          );
          -webkit-mask-image: radial-gradient(
            circle at center center,
            transparent 350px,
            #000 35px
          );
        }

        @keyframes lines-rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
