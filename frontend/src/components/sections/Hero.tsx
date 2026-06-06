"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  // mouse parallax for the floating showcase
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  // depth layers move by different amounts
  const layer1X = useTransform(smx, (v) => v * 18);
  const layer1Y = useTransform(smy, (v) => v * 18);
  const layer2X = useTransform(smx, (v) => v * 34);
  const layer2Y = useTransform(smy, (v) => v * 34);
  const layer3X = useTransform(smx, (v) => v * -26);
  const layer3Y = useTransform(smy, (v) => v * -26);

  // scroll parallax on the whole showcase
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const showcaseY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      className="relative overflow-hidden"
    >
      {/* soft ambient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-mist blur-3xl animate-floatYslow" />
        <div className="absolute right-0 top-44 h-80 w-80 rounded-full bg-line/60 blur-3xl animate-floatY" />
      </div>

      <div className="container-site grid items-center gap-12 py-24 md:grid-cols-2 md:py-32">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="badge"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ink" />
            Trusted by professional studios
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
            className="mt-6 text-display font-semibold text-ink"
          >
            Professional tattoo
            <br />
            equipment for
            <br />
            <span className="text-muted">serious artists.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.14, ease: EASE }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted"
          >
            Curated machines, ink, and supplies — authentic, reliable, and built to perform.
            Everything you need, nothing you don&apos;t.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: EASE }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <MagneticButton href="/products" className="group">
              Shop Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="/products" variant="ghost">
              Explore Categories
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex items-center gap-6 text-xs text-muted"
          >
            <span><strong className="text-ink">4.9/5</strong> artist rating</span>
            <span className="h-3 w-px bg-line" />
            <span><strong className="text-ink">100%</strong> authentic</span>
            <span className="h-3 w-px bg-line" />
            <span><strong className="text-ink">24h</strong> dispatch</span>
          </motion.div>
        </div>

        {/* floating product showcase with mouse + scroll parallax */}
        <motion.div style={{ y: showcaseY }} className="relative h-[360px] md:h-[480px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="absolute inset-0"
          >
            <motion.div
              style={{ x: layer1X, y: layer1Y }}
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 md:h-80 md:w-80"
            >
              <div className="animate-floatY h-full w-full rounded-[28px] border border-line bg-white shadow-glass">
                <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-gradient-to-br from-mist via-white to-line">
                  <span className="select-none text-7xl font-semibold tracking-tighter text-ink/10">TS</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={{ x: layer2X, y: layer2Y }}
              className="absolute right-4 top-6 h-24 w-24 rounded-2xl border border-line bg-white/80 shadow-soft backdrop-blur animate-floatYslow"
            />
            <motion.div
              style={{ x: layer3X, y: layer3Y }}
              className="absolute bottom-6 left-0 h-20 w-20 rounded-full border border-line bg-white/80 shadow-soft backdrop-blur animate-floatXY"
            />
            <motion.div
              style={{ x: layer2X, y: layer3Y }}
              className="absolute bottom-12 right-10 h-3 w-3 rounded-full bg-ink/20"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-line p-1">
          <span className="h-2 w-1 rounded-full bg-muted animate-scrollCue" />
        </div>
      </div>
    </section>
  );
}
