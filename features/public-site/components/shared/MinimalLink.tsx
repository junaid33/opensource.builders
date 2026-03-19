'use client';

interface MinimalLinkProps {
  text: string;
  url: string;
}

/**
 * Hover text-slide link.
 * Shows text in parentheses; on hover, the text slides up to reveal a second copy.
 */
export function MinimalLink({ text, url }: MinimalLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-baseline gap-[1px] text-[0.79rem] font-medium text-muted-foreground no-underline transition-colors duration-200 hover:text-foreground"
    >
      (
      <span className="h-4 overflow-hidden inline-block">
        <span className="block text-muted-foreground transition-transform duration-300 group-hover:text-foreground group-hover:-translate-y-full">
          {text}
        </span>
        <span className="block text-muted-foreground transition-transform duration-300 group-hover:text-foreground -translate-y-full group-hover:translate-y-0">
          {text}
        </span>
      </span>
      )
    </a>
  );
}
