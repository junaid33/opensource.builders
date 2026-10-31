'use client';

import { Container, Lines } from '../shared';
import { ThemeSwitcher } from "@/components/ui/theme-toggle";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <Container>
        <section className="pt-[150px] pb-[50px]">
          <Lines />

          {/* Headline */}
          <h1 className="font-instrument-serif text-[3rem] sm:text-[4.8rem] leading-[1] tracking-tighter max-w-[900px]">
            Find an <i>open source</i> <br />
            alternative to <i>anything.</i>
          </h1>

          {/* Action Links */}
          <div className="flex items-center gap-3 mt-7">
            {/* Theme Toggle (non-rounded) */}
            <ThemeSwitcher rounded={false} />
          </div>
        </section>
      </Container>
    </div>
  );
}