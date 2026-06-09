"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
  flipped?: boolean;
}

export function HeroVideo({ flipped = false }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
    let hls: any = null;

    // Dynamically import hls.js on the client to avoid SSR issues
    import("hls.js")
      .then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          hls = new Hls({
            maxMaxBufferLength: 10,
            enableWorker: true,
            lowLatencyMode: true,
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch((err) => {
              console.warn("HLS Video autoplay was prevented:", err);
            });
          });

          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // Native Safari / iOS support
          video.src = streamUrl;
          video.addEventListener("loadedmetadata", () => {
            video.play().catch((err) => {
              console.warn("Native Video autoplay was prevented:", err);
            });
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load hls.js dynamically:", err);
      });

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) ${flipped ? "scaleY(-1)" : ""}`,
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          objectFit: "cover",
          opacity: flipped ? 0.25 : 0.35,
        }}
      />
      {/* Dark tint overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: flipped ? "rgba(2, 2, 2, 0.7)" : "rgba(2, 2, 2, 0.35)",
          zIndex: 1,
        }}
      />
      {/* Bottom fade-to-black vignette (only for Hero background) */}
      {!flipped && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "192px",
            background: "linear-gradient(to top, hsl(var(--bg)) 0%, transparent 100%)",
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
