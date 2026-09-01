import { MinimalLink } from '../shared';

export function Footer() {
  return (
    <footer className="space-y-1 py-12 font-mono text-[0.69rem] font-medium uppercase tracking-wider text-muted-foreground/60">
      <p>
        <span className="text-foreground">—</span>{' '}
        An{' '}
        <MinimalLink text="Openship" url="https://openship.org" />{' '}
        initiative
      </p>
      <p>
        <span className="text-foreground">—</span>{' '}
        Interface adapted from{' '}
        <MinimalLink text="DesEngs" url="https://desengs.com" />{' '}
        by Maze Heart
      </p>
    </footer>
  );
}
