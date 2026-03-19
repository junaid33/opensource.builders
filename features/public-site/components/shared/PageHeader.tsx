interface PageHeaderProps {
  title: string;
  subtitle?: string;
  italicTitle?: boolean;
}

/**
 * Simple Instrument Serif page header with optional subtitle.
 * Used across all redesigned pages.
 */
export function PageHeader({ title, subtitle, italicTitle = false }: PageHeaderProps) {
  return (
    <div className="pb-6">
      <h1 className="font-instrument-serif text-[2rem] leading-[1.2] tracking-tight">
        {italicTitle ? <i>{title}</i> : title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
