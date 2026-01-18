# Opensource.Builders

Find open-source alternatives to popular software, compare features side-by-side, and generate skills with code references that help AI build those features in your project.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjunaid33%2Fopensource.builders%2F&stores=[{"type"%3A"postgres"}])

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/TK5wC1?referralCode=I_tWSs)

## Features

- **Browse Alternatives** - Discover open-source alternatives to proprietary applications
- **Compare Applications** - See feature-by-feature comparisons between apps
- **Skill Builder** - Generate AI coding agent skills from curated features with implementation details and code references
- **Multi-Agent Support** - Install skills in Claude Code, Cursor, Droid, or Codex CLI

## Skill Builder

The Skill Builder lets you select features from multiple open-source projects and generates a skill - a guide with specific code references that your AI coding agent can use to build those features in your project. Each skill includes:

- Feature descriptions and implementation notes
- Links to reference code in GitHub repositories
- Documentation URLs for deeper context

### Installing Skills

After generating a skill, you can install it in your preferred AI coding agent:

**Claude Code**
```bash
# Save the skill file to your project
mkdir -p .claude/skills && cp ~/Downloads/SKILL.md .claude/skills/
```

**Cursor**
```bash
# Add the skill content to your rules file
cat ~/Downloads/SKILL.md >> .cursor/rules/skill.mdc
```

**Droid**
```bash
# Save to your project's skills directory
mkdir -p .factory/skills && cp ~/Downloads/SKILL.md .factory/skills/
```

**Codex CLI**
```bash
# Add to your agents instructions
cat ~/Downloads/SKILL.md >> codex.md
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Keystone](https://keystonejs.com) - Headless CMS
- [PostgreSQL](https://www.postgresql.org) - Database
- [Tailwind CSS](https://tailwindcss.com) - Styling

## Contributing

See [CONTRIBUTING_TO_OSB.md](./CONTRIBUTING_TO_OSB.md) for guidelines on adding applications, capabilities, and improving the platform.

## Deploy

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjunaid33%2Fopensource.builders%2F&stores=[{"type"%3A"postgres"}])

### Railway

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/TK5wC1?referralCode=I_tWSs)

## License

MIT
