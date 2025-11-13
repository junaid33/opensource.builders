"use client";

import { CombinedLogo } from "@/components/CombinedLogo";
import { TextScramble } from "@/components/ui/TextScramble";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

type Tab = "2025" | "2020";

export function EthosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("2025");
  const [scrambleTrigger, setScrambleTrigger] = useState(false);

  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setScrambleTrigger((prev) => !prev);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="pt-28 pb-8 md:pt-36 md:pb-16">
            <div className="max-w-2xl text-left">
              <div className="flex items-center justify-start mb-4">
                <CombinedLogo />
              </div>
              <a
                href="https://openship.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-muted-foreground mb-4 uppercase font-medium tracking-wide hover:text-foreground transition-colors"
              >
                An Openship initiative <ArrowUpRight className="size-4 ml-1" />
              </a>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                opensource.builders
              </h1>

              {/* Author Info */}
              <div className="mb-6">
                <HoverCard>
                  <div className="flex items-center gap-3">
                    <img
                      className="shrink-0 rounded-full"
                      src="https://avatars.githubusercontent.com/u/34615258"
                      width={40}
                      height={40}
                      alt="Avatar"
                    />
                    <div className="flex flex-col gap-0">
                      <HoverCardTrigger asChild>
                        <p>
                          <a
                            className="text-base font-medium hover:underline"
                            href="https://github.com/junaid33"
                          >
                            Junaid
                          </a>
                        </p>
                      </HoverCardTrigger>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <a href="https://github.com/junaid33">Github</a><span>·</span><a href="https://www.linkedin.com/in/junaid-kabani/">LinkedIn</a>
                      </div>
                    </div>
                  </div>
                  <HoverCardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          className="shrink-0 rounded-full"
                          src="https://avatars.githubusercontent.com/u/34615258?v=4"
                          width={40}
                          height={40}
                          alt="Avatar"
                        />
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Junaid</p>
                          <p className="text-muted-foreground text-xs">
                            @junaid33
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Founder and CEO of{" "}
                        <a
                          href="https://github.com/openshiporg/openship"
                          className="text-foreground font-medium hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Openship
                        </a>
                        ,{" "}
                        <a
                          href="https://github.com/openshiporg/openfront"
                          className="text-foreground font-medium hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Openfront
                        </a>
                        ,{" "}
                        <a
                          href="https://github.com/junaid33/opensource.builders"
                          className="text-foreground font-medium hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Opensource.Builders
                        </a>
                        . Building an open source Amazon. One SaaS at a time.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>

              {/* Tab Switcher */}
              <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/50">
                <button
                  onClick={() => handleTabChange("2025")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === "2025"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  2025
                </button>
                <button
                  onClick={() => handleTabChange("2020")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === "2020"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  2020
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {activeTab === "2025" ? (
          <div className="max-w-2xl space-y-8" key="2025">
            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Beginnings
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Opensource.Builders began in 2020 as a way to explore open
                source alternatives to popular proprietary applications. At that
                time there were many new projects gaining attention. Five years
                later, open source adoption is even stronger. Almost every
                proprietary application has at least one open source
                counterpart. The challenge is that deciding what counts as a
                true alternative is still highly subjective.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                A New Approach
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Describing one application as an alternative to another often
                oversimplifies the reality. Consider Ghost, an open source
                blogging platform. You might call it an alternative to Shopify
                since both support blogging, yet Shopify also provides payment
                systems, product management, and storefronts that Ghost does
                not.
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                To solve this, we focus on tracking features rather than vague
                comparisons. When you look at applications through the lens of
                features, you can see exactly where they overlap and where they
                differ. This perspective also shows how multiple open source
                projects can replace a single proprietary product. Proprietary
                tools often accumulate more features over time, but many of
                those additions are incomplete and fail to meet user
                expectations. By understanding features clearly, you can
                assemble a combination of open source projects that give you
                exactly what you need, while maintaining flexibility. If one
                project drops a feature, you can replace just that piece instead
                of being forced into an entirely new system.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Reinventing the Wheel
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                In the past, rewriting or refactoring software was often viewed
                as wasted effort. With the rise of AI, the cost of these tasks
                has fallen dramatically. Developers who understand a codebase
                well can now reimplement or improve entire sections more quickly
                and with greater confidence.
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Opensource.Builders supports this by doing more than simply
                listing which applications offer certain features. We also track
                where in the code those features live. This gives AI the context
                it needs to learn from working examples and then generate
                similar functionality for your environment. This is the idea
                behind the Build Drawer. You select the features you want from
                existing projects, and we create a structured prompt you can
                feed to the AI system of your choice. The AI then has a clear
                guide to help you bring those features into your own project.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Personal Software
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                AI is not only changing the way software is built but also how
                people choose what software to use. Most users today still adapt
                themselves to whatever application they adopt. If they need a
                customization or a fix for an edge case, they must learn the
                application's API or extension system, which often creates
                deeper lock-in.
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                AI is giving people the equivalent of a home kitchen. Instead of
                being stuck with takeout, you can now make something personal,
                tailored to your needs. We see Opensource.Builders as a
                cookbook. The recipes are open source projects, and our work is
                helping you understand and adapt them. Even if the results are
                not perfect, you have control over the process and can keep
                improving the outcome.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Openship & opensource.builders
              </TextScramble>
              <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
                At <a href="https://openship.org" target="_blank" rel="noopener noreferrer" className="text-fd-foreground underline hover:text-fd-muted-foreground transition-colors">Openship</a>, we are creating <a href="https://github.com/openshiporg/openfront" target="_blank" rel="noopener noreferrer" className="text-fd-foreground underline hover:text-fd-muted-foreground transition-colors">open source software-as-a-service
                platforms</a> for every vertical, from hotels to grocery stores to
                barbershops. Together, these vertical platforms form the
                foundation of a <a href="https://github.com/openshiporg/marketplace" target="_blank" rel="noopener noreferrer" className="text-fd-foreground underline hover:text-fd-muted-foreground transition-colors">decentralized marketplace</a>, where businesses
                fully own their storefronts and customer relationships.
              </p>
              <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
                Opensource.Builders is the companion to that vision. Each
                Openfront we build can stand on its own, but with our feature
                tracking and Build Drawer, businesses can go further. For
                example, if you run a barbershop and also want to sell
                merchandise, you can take e-commerce features from the retail
                Openfront and add them to the barbershop Openfront. The result
                is a personal platform that reflects your business exactly as
                you need it.
              </p>
              <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium">
                Instead of being limited by a single provider, you have the
                freedom to combine, customize, and evolve your own Openfront,
                building an alternative that truly belongs to you.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl space-y-8" key="2020">
            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                The Beginning
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                My coding journey began about a year ago when I set out to build
                a tool to help manage my company. Like most people starting to
                learn how to code, I was drawn to Github and open-source
                software.
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                As I started to go down this rabbit-hole, I discovered a
                plethora of repos and the amazing developers maintaining them.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Incentives
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                After seeing (and starring) all these repos, the amount of time
                and effort these developers put into these projects was
                astounding. But what was the incentive? They were not getting
                paid and most profiles didn't even include the developer's real
                name or avatar.
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Then it dawned on me: these developers built these projects
                because they themselves needed them and they open-sourced it
                because they knew others would too.
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Most times, a commercial option was available, but these
                developers had the creator's mentality:{" "}
                <strong>I can build it better</strong>. Being open-source
                further accelerated this since more people could look at the
                code and contribute to make it better.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Why choose open-source
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                You're wondering why you should choose open-source projects over
                established companies that solve the same problem.
              </TextScramble>

              <TextScramble
                as="h3"
                className="text-xl sm:text-2xl font-semibold mb-3"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                You own the data
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Open-source software can be self-hosted and your data will be on
                your servers. No company will be able to mine your data or use
                it to bolster their own business.
              </TextScramble>

              <TextScramble
                as="h3"
                className="text-xl sm:text-2xl font-semibold mb-3"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Cost efficiency
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Although most commercial software have a free tier, the higher
                tiers can get quite expensive. These companies subsidize the
                free accounts by paid ones.
              </TextScramble>

              <TextScramble
                as="h3"
                className="text-xl sm:text-2xl font-semibold mb-3"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Customization
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Commercial software companies normally do not let you customize
                their software unless you go to the enterprise tier. With
                open-source, you can make the software adapt to your business as
                you scale and avoid vendor lock-in.
              </TextScramble>

              <TextScramble
                as="h3"
                className="text-xl sm:text-2xl font-semibold mb-3"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Community
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Open-source enables communities to build software
                collaboratively. This means the software is battle-tested over
                time by people who built it and use it.
              </TextScramble>

              <TextScramble
                as="h3"
                className="text-xl sm:text-2xl font-semibold mb-3"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Supporting meritocracy
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                Unlike commercial companies, open-source software is normally
                not funded, has little to no marketing budget, and is built by a
                single developer or small team. What makes it great is that it
                is a meritocracy. Its success is dependent on how good the
                software is and how much value it provides to users.
              </TextScramble>
            </div>

            <div>
              <TextScramble
                as="h2"
                className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif"
                trigger={scrambleTrigger}
                duration={0.6}
              >
                Future
              </TextScramble>
              <TextScramble
                as="p"
                className="text-muted-foreground leading-relaxed sm:text-lg font-medium"
                trigger={scrambleTrigger}
                duration={1.2}
              >
                The reasons stated above is why I believe that open-source
                software will be able to overcome commercial companies in the
                long run. If you believe that too, be sure to support by
                starring the repos on Github and giving them a try on your next
                project.
              </TextScramble>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
