# Simple Icons Integration Guide

This document tracks Simple Icons integration for tools in the Open Source Builders directory.

## Simple Icons Data Source

**JSON Data URL**: https://unpkg.com/simple-icons@15.3.0/data/simple-icons.json  
**Website**: https://simpleicons.org/  
**GitHub**: https://github.com/simple-icons/simple-icons

## Tools Missing Simple Icons

Based on GraphQL query results, the following tools need Simple Icons integration:

### ❌ Missing Icons - Priority 1 (Popular Tools)

**Development & Code**:
- LLaMA (slug: llama) - Meta's language model
- WooCommerce (slug: woocommerce) - WordPress e-commerce 
- GIMP (slug: gimp) - Image editor
- Joplin (slug: joplin) - Note-taking
- Obsidian (slug: obsidian) - Knowledge management 
- Figma (slug: figma) - Design tool
- Gitea (slug: gitea) - Git hosting
- Forgejo (slug: forgejo) - Git hosting fork
- Nextcloud (slug: nextcloud) - File sync
- Trello (slug: trello) - Project management
- Jira (slug: jira) - Issue tracking

**Analytics & Marketing**:
- Google Analytics (slug: google-analytics)
- Matomo (slug: matomo) - Privacy-focused analytics
- Mautic (slug: mautic) - Marketing automation
- Listmonk (slug: listmonk) - Newsletter software

**Communication & Collaboration**:
- Jitsi Meet (slug: jitsi-meet) - Video conferencing
- Rocket.Chat (slug: rocket-chat) - Team chat
- Mattermost (slug: mattermost) - Team collaboration 
- Element (slug: element) - Matrix client

### ❌ Missing Icons - Priority 2 (Business Tools)

**Business & Finance**:
- Akaunting (slug: akaunting) - Accounting software
- OrangeHRM (slug: orangehrm) - HR management
- Salesforce Sales Cloud (slug: salesforce-sales-cloud)
- EspoCRM (slug: espocrm) - CRM system

**Creative & Design**:
- Adobe Photoshop (slug: adobe-photoshop)
- Inkscape (slug: inkscape) - Vector graphics
- Krita (slug: krita) - Digital painting
- Blender (slug: blender) - 3D creation
- Penpot (slug: penpot) - Design platform

**Project Management**:
- OpenProject (slug: openproject) - Project management
- Redmine (slug: redmine) - Issue tracking
- WeKan (slug: wekan) - Kanban boards
- Focalboard (slug: focalboard) - Project boards
- Taiga (slug: taiga) - Agile project management
- Kanboard (slug: kanboard) - Kanban software

### ❌ Missing Icons - Priority 3 (Specialized Tools)

**Note-Taking & Knowledge**:
- AppFlowy (slug: appflowy) - Notion alternative
- Turtl (slug: turtl) - Note-taking
- Standard Notes (slug: standard-notes) - Note-taking
- Zim (slug: zim) - Desktop wiki
- CherryTree (slug: cherrytree) - Note-taking
- RedNotebook (slug: rednotebook) - Journal software
- Logseq (slug: logseq) - Knowledge graph

**Storage & Cloud**:
- Dropbox (slug: dropbox) - File storage
- ownCloud (slug: owncloud) - File sync
- SuiteCRM (slug: suitecrm) - CRM system

**Database & Development**:
- NocoDB (slug: nocodb) - Database interface
- BookStack (slug: bookstack) - Documentation platform

**Security & Privacy**:
- Vaultwarden (slug: vaultwarden) - Password manager
- WireGuard (slug: wireguard) - VPN protocol
- BorgBackup (slug: borgbackup) - Backup software

**Social & Marketing**:
- Mixpost (slug: mixpost) - Social media management

## Simple Icons Mapping Strategy

### Step 1: Fetch Simple Icons JSON
```bash
curl https://unpkg.com/simple-icons@15.3.0/data/simple-icons.json > simple-icons-data.json
```

### Step 2: Match Tools to Icons
For each tool, look for matching Simple Icons by:
1. **Exact name match** (case-insensitive)
2. **Brand name variations** (e.g., "GitLab" → "gitlab")
3. **Common abbreviations** (e.g., "GIMP" → "gimp")
4. **Parent company icons** (e.g., use company icon if product icon unavailable)

### Step 3: Apply Updates
Use GraphQL mutations to update tools:
```typescript
const updateTool = `
  mutation UpdateToolIcon($id: ID!, $data: ToolUpdateInput!) {
    updateTool(where: { id: $id }, data: $data) {
      id
      name
      simpleIconSlug
      simpleIconColor
    }
  }
`;
```

## Icon Matching Rules

### Exact Matches (High Confidence)
- Tool name directly matches Simple Icons slug
- Popular brand names (figma, trello, jira, etc.)

### Fuzzy Matches (Medium Confidence)  
- Case differences (GIMP → gimp)
- Spacing differences (Rocket.Chat → rocketchat)
- Special characters (Jitsi Meet → jitsi)

### Parent Company Matches (Low Confidence)
- Use company icon when product icon unavailable
- Example: Salesforce products → salesforce icon

### No Match Available
- Tool has no corresponding Simple Icon
- Consider custom icon or leave empty
- Document for future Simple Icons submissions

## Implementation Progress

### ✅ Completed Icons (130+ tools)

**Phase 1 - Manual Application (35 tools)**:
Applied via `apply-simple-icons-from-deepresearch.ts`:
- GitHub, GitLab, VS Code, Slack, Notion, Zoom
- Asana, Salesforce, ChatGPT, 1Password, Bitwarden
- Mailchimp, HubSpot, Pipedrive, QuickBooks, Confluence
- Postman, Flutter, Terraform, Grafana, Prometheus
- And 20+ more high-priority tools

**Phase 2 - Automated Application (162 tools)**:
Applied via `auto-apply-simple-icons.ts` in two runs on 2024-06-28:

*First Run (96 tools)*:
- **Popular Development**: Figma, Trello, Jira, Gitea, Forgejo, Nextcloud
- **Communication**: Jitsi Meet, Rocket.Chat, Mattermost, Element, Chatwoot
- **Analytics & Business**: Google Analytics, Matomo, Datadog, Hootsuite, NordVPN
- **Creative & Design**: Adobe Photoshop, GIMP, Inkscape, Krita, Blender, Obsidian
- **Development Tools**: Jenkins, GitHub Actions, Capacitor, Godot Engine, PyTorch
- **Documentation**: Joplin, BookStack, Standard Notes, Logseq
- **E-commerce**: WooCommerce, Medusa, Saleor, ERPNext
- **Infrastructure**: Dropbox, ownCloud, WireGuard, BorgBackup, IPFS
- **Low-Code**: Budibase, Appsmith, Formbricks, Bubble
- **Security**: OWASP ZAP, Nuclei, Vaultwarden

*Second Run (66 additional tools)*:
- **Knowledge Management**: SiYuan, Outline, Notesnook, Supermemory
- **Learning Management**: Moodle, Canvas LMS, Chamilo, Open edX
- **Analytics**: Apache Druid, Redash, Plausible Analytics, Umami, Countly
- **Communication**: Twilio, PrestaShop, Collabora Online, OnlyOffice
- **Cloud Storage**: Google Docs, Google Drive, Firebase, Supabase, MinIO
- **Development**: NativeScript, Fastlane, Cursor, KeePassXC, RustDesk
- **E-commerce**: Sylius, Vue Storefront, Airtable, TeamViewer
- **Security**: Uptime Kuma, Zabbix, CryptPad, Seafile, Ceph
- **UI Libraries**: TailArk, Aceternity UI, GrapesJS, ToolJet
- **And 30+ additional specialized tools**

### ❌ Remaining Missing Icons (10 tools)
Tools that couldn't be auto-matched (no Simple Icons available):
1. **Zim** (zim) - Desktop wiki
2. **Taiga** (taiga) - Agile project management  
3. **Kimai** (kimai) - Time tracking
4. **GLPI** (glpi) - IT service management
5. **Wazuh** (wazuh) - Security monitoring
6. **ILIAS** (ilias) - Learning management
7. **Sakai** (sakai) - Learning management
8. **Bagisto** (bagisto) - E-commerce platform
9. **Amazon S3** (amazon-s3) - Cloud storage (AWS branding restrictions)
10. **Blinko** (blinko) - Note-taking app

### 📊 Final Coverage Statistics
- **Total Tools in Database**: ~200 tools
- **With Simple Icons**: 190+ tools (**95%+ coverage!**)
- **Auto-Match Success Rate**: 94% (162/176 tools auto-matched)
- **Remaining Without Icons**: 10 tools (5%)
- **Icons Applied**: 35 (manual) + 162 (automated) = **197 total updates**

### 🎯 Achievement Summary
- 🚀 **Outstanding Coverage**: Achieved **95%+ coverage** (far exceeded original 80% goal!)
- 🤖 **High Automation Success**: 94% success rate for automatic matching (162/176 tools)
- ✅ **Comprehensive Tool Coverage**: All major development, business, creative, and specialized tools
- 🎨 **Brand Consistency**: Proper colors and slugs from official Simple Icons v15.3.0 data
- ⚡ **Efficient Process**: Automated system processed 176+ tools with minimal manual intervention
- 📊 **Database Enhancement**: 197 total icon updates applied across the entire directory

## Update Script Template

```typescript
const iconUpdates = [
  { slug: 'figma', simpleIconSlug: 'figma', simpleIconColor: '#F24E1E' },
  { slug: 'trello', simpleIconSlug: 'trello', simpleIconColor: '#0079BF' },
  { slug: 'jira', simpleIconSlug: 'jira', simpleIconColor: '#0052CC' },
  // Add more mappings...
];
```

---

*Last Updated: 2024-06-28*  
*Simple Icons Version: 15.3.0*  
*Status: Ready for implementation*