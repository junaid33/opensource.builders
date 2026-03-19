'use client';

import { Container, Lines } from '../shared';
import { ThemeSwitcher } from "@/components/ui/theme-toggle";
import { Star, Github } from "lucide-react";

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

            {/* GitHub Star Link (non-rounded) */}
            <a
              href="https://github.com/junaid33/opensource.builders"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center h-8 gap-2 px-3 py-1 bg-secondary/50 border border-border hover:bg-secondary transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Github className="size-3.5" />
              <div className="flex items-center gap-1">
                <Star className="size-3 text-orange-400 fill-orange-400" />
                <span>1.1k</span>
              </div>
            </a>
          </div>
        </section>
      </Container>
    </div>
  );
}