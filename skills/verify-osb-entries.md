# Verify Open Source Builders Entries - AI Skill Guide

This skill enables an AI assistant to verify and audit entries in the Open Source Builders database, ensuring data accuracy, proper linking, and correct GitHub statistics.

---

## Purpose

After new entries are added to Open Source Builders, use this skill to:

1. **Verify GitHub data is accurate** - Stars, forks, license, description match reality
2. **Verify relationships are correct** - Open source apps linked to right proprietary apps
3. **Verify capabilities make sense** - Features listed actually exist in the projects
4. **Identify missing data** - Empty fields that should be filled
5. **Flag stale data** - GitHub stats that are outdated

---

## Prerequisites

1. **API Endpoint**: `https://opensource.builders/api/graphql`
2. **Authentication**: A valid session token (user must provide email/password)

---

## CRITICAL: Shell Glob Expansion Warning

The session token contains `**` which zsh/bash interprets as a glob pattern. **You MUST disable glob expansion** before any curl command:

```bash
set -o noglob; curl -s -X POST ...
```

---

## Step 1: Authenticate

```bash
curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  --data '{"query": "mutation { authenticateUserWithPassword(email: \"USER_EMAIL\", password: \"USER_PASSWORD\") { ... on UserAuthenticationWithPasswordSuccess { sessionToken item { id name email } } ... on UserAuthenticationWithPasswordFailure { message } } }"}'
```

Save the `sessionToken` and use it in all subsequent requests.

---

## Verification Workflow

When a user says "verify the entry for X" or "check if Y was added correctly", follow this workflow:

### Step 1: Fetch the Entry to Verify

#### For a Proprietary Application:
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplications(where: { OR: [{ slug: { equals: \"app-slug\" } }, { name: { contains: \"App Name\" } }] }) { id name slug description websiteUrl simpleIconSlug simpleIconColor category { id name slug } capabilities { id isActive capability { id name slug category complexity } } openSourceAlternatives { id name slug } createdAt updatedAt } }"}'
```

#### For an Open Source Application:
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(where: { OR: [{ slug: { equals: \"app-slug\" } }, { name: { contains: \"App Name\" } }, { repositoryUrl: { contains: \"github.com/owner/repo\" } }] }) { id name slug description repositoryUrl websiteUrl license githubStars githubForks githubIssues githubLastCommit status simpleIconSlug simpleIconColor primaryAlternativeTo { id name slug } capabilities { id isActive implementationNotes githubPath documentationUrl implementationComplexity capability { id name slug category complexity } } createdAt updatedAt } }"}'
```

### Step 2: Research and Compare

For each entry, perform independent research to verify the data:

#### For Open Source Applications:

1. **Fetch the actual GitHub repository** using web search or direct fetch:
   - Go to the `repositoryUrl` 
   - Get current star count, fork count, open issues
   - Check the license file
   - Read the README for description and features
   - Check last commit date

2. **Compare with database entry:**

| Field | Database Value | Actual Value | Match? |
|-------|---------------|--------------|--------|
| name | | | |
| description | | | |
| repositoryUrl | | | |
| license | | | |
| githubStars | | | |
| githubForks | | | |
| githubIssues | | | |
| status | | | |

3. **Verify capabilities:**
   - For each capability listed, check if the feature actually exists in the project
   - Read the README features section
   - Check if `githubPath` points to real code
   - Check if `documentationUrl` is valid and relevant

4. **Verify the alternative relationship:**
   - Does `primaryAlternativeTo` point to the correct proprietary app?
   - Is this open source project actually an alternative to that proprietary app?

#### For Proprietary Applications:

1. **Visit the official website** (`websiteUrl`):
   - Verify the name and description are accurate
   - Check if listed capabilities match the product's actual features
   - Verify the website URL is correct and active

2. **Verify icon:**
   - Check https://simpleicons.org for the `simpleIconSlug`
   - Verify the color matches

3. **Verify category:**
   - Does the assigned category make sense for this product?

4. **Verify linked alternatives:**
   - Are the `openSourceAlternatives` actually alternatives to this product?

### Step 3: Generate Verification Report

Create a report in this format:

```
═══════════════════════════════════════════════════════════════════
                    VERIFICATION REPORT
═══════════════════════════════════════════════════════════════════

Entry Type: [Proprietary Application / Open Source Application]
Name: [App Name]
Slug: [app-slug]
Database ID: [id]

───────────────────────────────────────────────────────────────────
                         DATA ACCURACY
───────────────────────────────────────────────────────────────────

✓ Name: Correct
✓ Description: Correct (or "Needs update - actual: ...")
✓ Repository URL: Valid and accessible
✗ GitHub Stars: Database has 45000, actual is 52000 (stale)
✓ License: Correct (MIT)
✗ Status: Listed as "active" but last commit was 8 months ago

───────────────────────────────────────────────────────────────────
                        RELATIONSHIPS
───────────────────────────────────────────────────────────────────

✓ Primary Alternative To: Notion (correct - this is a Notion alternative)
✓ Category: Productivity & Note-taking (appropriate)

───────────────────────────────────────────────────────────────────
                        CAPABILITIES
───────────────────────────────────────────────────────────────────

✓ Block-based editor - Verified in README, code at /frontend/editor
✓ Real-time collaboration - Verified, docs at docs.example.com/collab
✗ Offline mode - Listed but NOT found in project (remove?)
? AI features - Cannot verify, no documentation found

───────────────────────────────────────────────────────────────────
                         MISSING DATA
───────────────────────────────────────────────────────────────────

- simpleIconSlug: null (icon exists at simpleicons.org as "appflowy")
- simpleIconColor: null (should be "#00BCF0")
- githubLastCommit: null (should be populated)

───────────────────────────────────────────────────────────────────
                        RECOMMENDATIONS
───────────────────────────────────────────────────────────────────

1. UPDATE githubStars from 45000 to 52000
2. UPDATE status from "active" to "maintenance" (last commit 8 months ago)
3. REMOVE capability "Offline mode" - not actually implemented
4. ADD simpleIconSlug: "appflowy", simpleIconColor: "#00BCF0"
5. VERIFY capability "AI features" - unclear if implemented

───────────────────────────────────────────────────────────────────
                          SUMMARY
───────────────────────────────────────────────────────────────────

Overall Status: NEEDS UPDATES
Issues Found: 5
Critical Issues: 1 (incorrect capability)
Data Freshness: Stale (stats outdated)

═══════════════════════════════════════════════════════════════════
```

---

## Verification Checklist

For each entry, verify:

### Open Source Application
- [ ] `name` matches the project's actual name
- [ ] `slug` is lowercase, hyphenated, matches name
- [ ] `description` accurately describes the project
- [ ] `repositoryUrl` is valid and accessible
- [ ] `websiteUrl` is valid (if provided)
- [ ] `license` matches the actual license file
- [ ] `githubStars` is within 10% of actual (stats get stale)
- [ ] `githubForks` is within 10% of actual
- [ ] `githubIssues` is reasonable
- [ ] `status` reflects actual project activity:
  - `active`: commits within last 3 months
  - `maintenance`: commits within last year, stable
  - `beta`: explicitly marked as beta/alpha
  - `deprecated`: archived or abandoned
- [ ] `primaryAlternativeTo` links to correct proprietary app
- [ ] All capabilities actually exist in the project
- [ ] `githubPath` in capabilities points to real code
- [ ] `documentationUrl` in capabilities is valid

### Proprietary Application
- [ ] `name` is the official product name
- [ ] `slug` is lowercase, hyphenated
- [ ] `description` accurately describes the product
- [ ] `websiteUrl` is the official website
- [ ] `simpleIconSlug` exists at simpleicons.org
- [ ] `simpleIconColor` matches the brand
- [ ] `category` is appropriate
- [ ] All capabilities match actual product features
- [ ] `openSourceAlternatives` are actually alternatives

---

## Update Mutations (If Fixes Needed)

After verification, if updates are needed, use these mutations:

### Update Open Source Application
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceApplication(where: { id: \"APP_ID\" }, data: { githubStars: 52000, githubForks: 3500, status: \"maintenance\" }) { id name githubStars status } }"}'
```

### Update Proprietary Application
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateProprietaryApplication(where: { id: \"APP_ID\" }, data: { description: \"Updated description\", simpleIconSlug: \"icon-slug\" }) { id name } }"}'
```

### Delete Incorrect Capability Junction
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { deleteOpenSourceCapability(where: { id: \"CAPABILITY_JUNCTION_ID\" }) { id } }"}'
```

### Update Capability Junction
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceCapability(where: { id: \"JUNCTION_ID\" }, data: { implementationNotes: \"Updated notes\", githubPath: \"correct/path\", isActive: true }) { id } }"}'
```

---

## Common Issues to Check

### 1. Stale GitHub Statistics
GitHub stars/forks change frequently. If the entry is more than a month old, stats are likely outdated.

### 2. Wrong License
Common mistakes:
- "MIT" vs "MIT License"
- "GPL-3.0" vs "GPLv3" vs "GNU GPL v3"
- Missing license when repo has one

### 3. Incorrect Status
- Project marked "active" but hasn't had commits in 6+ months
- Project marked "deprecated" but is actively maintained
- Project marked "beta" but has stable releases

### 4. Missing Relationships
- Open source app not linked to any proprietary alternative
- Proprietary app has no open source alternatives listed

### 5. Phantom Capabilities
- Capabilities listed that don't actually exist in the project
- Features that are "planned" but not implemented

### 6. Broken Links
- `repositoryUrl` returns 404
- `websiteUrl` is dead
- `documentationUrl` in capabilities doesn't work

### 7. Wrong Alternative Mapping
- Open source project listed as alternative to wrong proprietary app
- Example: A Figma alternative incorrectly linked to Sketch

---

## Bulk Verification Query

To get multiple entries for batch verification:

### Get All Open Source Apps for a Proprietary App
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplication(where: { slug: \"notion\" }) { id name openSourceAlternatives { id name slug repositoryUrl githubStars license status capabilities { capability { name } isActive } } } }"}'
```

### Get Recently Added Entries
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(orderBy: { createdAt: desc }, take: 10) { id name slug repositoryUrl githubStars status createdAt primaryAlternativeTo { name } } }"}'
```

---

## Verification Summary Template

After completing verification, provide a summary:

```
VERIFICATION COMPLETE
=====================

Entries Verified: 3
- Notion (Proprietary) ✓
- AppFlowy (Open Source) - 2 issues found
- Obsidian (Open Source) ✓

Issues Found: 2
1. AppFlowy: githubStars outdated (45000 → 52000)
2. AppFlowy: Missing simpleIconSlug

Fixes Applied: [Yes/No - list if yes]

Recommendation: [All good / Needs manual review / Updates required]
```

---

## When NOT to Make Changes

Do not update entries if:
- You're unsure about the correct value
- The change would break relationships
- The user didn't ask for fixes, only verification
- The discrepancy is minor (e.g., stars off by < 5%)

Instead, report the issue and ask the user if they want it fixed.

---

## All Tested Curl Commands Reference

**IMPORTANT**: Always prefix curl commands with `set -o noglob;` to prevent glob expansion errors from the `**` in session tokens.

### Authentication
```bash
curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  --data '{"query": "mutation { authenticateUserWithPassword(email: \"USER_EMAIL\", password: \"USER_PASSWORD\") { ... on UserAuthenticationWithPasswordSuccess { sessionToken item { id name email } } ... on UserAuthenticationWithPasswordFailure { message } } }"}'
```

### Query: Get Proprietary App with All Details
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplications(where: { slug: { equals: \"app-slug\" } }) { id name slug description websiteUrl simpleIconSlug simpleIconColor category { id name slug } capabilities { id isActive capability { id name slug category complexity } } openSourceAlternatives { id name slug repositoryUrl } createdAt updatedAt } }"}'
```

### Query: Get Open Source App with All Details
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(where: { slug: { equals: \"app-slug\" } }) { id name slug description repositoryUrl websiteUrl license githubStars githubForks githubIssues githubLastCommit status simpleIconSlug simpleIconColor primaryAlternativeTo { id name slug } capabilities { id isActive implementationNotes githubPath documentationUrl implementationComplexity capability { id name slug category complexity } } createdAt updatedAt } }"}'
```

### Query: Search by Name (Partial Match)
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(where: { name: { contains: \"App\" } }) { id name slug repositoryUrl } }"}'
```

### Query: Search by Repository URL
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(where: { repositoryUrl: { contains: \"github.com/owner\" } }) { id name slug repositoryUrl githubStars } }"}'
```

### Query: Get All Alternatives for a Proprietary App
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplication(where: { slug: \"notion\" }) { id name openSourceAlternatives { id name slug repositoryUrl githubStars license status capabilities { capability { name } isActive } } } }"}'
```

### Query: Get Recently Added Open Source Apps
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { openSourceApplications(orderBy: { createdAt: desc }, take: 10) { id name slug repositoryUrl githubStars status createdAt primaryAlternativeTo { name } } }"}'
```

### Query: Get Recently Added Proprietary Apps
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { proprietaryApplications(orderBy: { createdAt: desc }, take: 10) { id name slug websiteUrl category { name } createdAt } }"}'
```

### Query: List All Categories
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { categories { id name slug } }"}'
```

### Query: List All Capabilities
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "query { capabilities(take: 50) { id name slug category complexity } }"}'
```

### Mutation: Update Open Source App GitHub Stats
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceApplication(where: { id: \"APP_ID\" }, data: { githubStars: 52000, githubForks: 3500, githubIssues: 150 }) { id name githubStars githubForks githubIssues } }"}'
```

### Mutation: Update Open Source App Status
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceApplication(where: { id: \"APP_ID\" }, data: { status: \"maintenance\" }) { id name status } }"}'
```

### Mutation: Update Open Source App Description
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceApplication(where: { id: \"APP_ID\" }, data: { description: \"Updated accurate description\" }) { id name description } }"}'
```

### Mutation: Add Missing Icon to Open Source App
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceApplication(where: { id: \"APP_ID\" }, data: { simpleIconSlug: \"appflowy\", simpleIconColor: \"#00BCF0\" }) { id name simpleIconSlug simpleIconColor } }"}'
```

### Mutation: Update Proprietary App
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateProprietaryApplication(where: { id: \"APP_ID\" }, data: { description: \"Updated description\", websiteUrl: \"https://correct-url.com\" }) { id name description websiteUrl } }"}'
```

### Mutation: Update Capability Junction (Implementation Details)
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { updateOpenSourceCapability(where: { id: \"JUNCTION_ID\" }, data: { implementationNotes: \"Corrected implementation notes\", githubPath: \"src/correct/path\", documentationUrl: \"https://docs.example.com/feature\" }) { id implementationNotes githubPath documentationUrl } }"}'
```

### Mutation: Delete Incorrect Capability Junction
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { deleteOpenSourceCapability(where: { id: \"JUNCTION_ID\" }) { id } }"}'
```

### Mutation: Delete Incorrect Proprietary Capability Junction
```bash
set -o noglob; curl -s -X POST 'https://opensource.builders/api/graphql' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: keystonejs-session=YOUR_SESSION_TOKEN' \
  --data '{"query": "mutation { deleteProprietaryCapability(where: { id: \"JUNCTION_ID\" }) { id } }"}'
```

**Tips:**
- Always use `set -o noglob;` before curl to prevent `**` glob expansion
- Escape double quotes in JSON with `\"`
- Use `| jq .` at the end to format JSON responses
- Replace `YOUR_SESSION_TOKEN` with the actual token from authentication
- Replace `APP_ID`, `JUNCTION_ID` etc. with actual IDs from query results
