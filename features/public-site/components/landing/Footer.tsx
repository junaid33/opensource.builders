import { MinimalLink } from '../shared';

export function Footer() {
  return (
    <footer className="py-12">
      <p
        className="font-mono text-[0.69rem] font-medium text-muted-foreground/60 uppercase tracking-wider"
      >
        <span className="text-foreground">—</span>{' '}
        An{' '}
        <MinimalLink text="Openship" url="https://openship.org" />{' '}
        initiative
      </p>
    </footer>
  );
}