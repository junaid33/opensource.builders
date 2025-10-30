# 🚀 OSB2 Application Management Guide

## 📊 **SYSTEM OVERVIEW**

**Data Model:**
- **ProprietaryApplication** → Category (many-to-one)
- **OpenSourceApplication** → ProprietaryApplication via `primaryAlternativeTo` (many-to-one)
- **Capability** ↔ Both app types via junction tables
  - **ProprietaryCapability**: Simple (just `isActive`)
  - **OpenSourceCapability**: Rich (`implementationNotes`, `githubPath`, `documentationUrl`, `implementationComplexity`)

**Current Stats:**
- 51 proprietary applications
- 176 open source alternatives
- 537 capabilities
- 54 categories

---

## 🛠️ **AVAILABLE MCP TOOLS**

Your MCP server provides these tools:

1. **modelSpecificSearch** - Intelligent search across any model with case-insensitive text matching
2. **createData** - Create new records with GraphQL mutations
3. **updateData** - Update existing records
4. **deleteData** - Delete records
5. **queryData** - Query data with custom fields
6. **searchModels** - Find models by name
7. **getFieldsForType** - Discover available fields
8. **lookupInputType** - Get mutation input structure

---

## 🎯 **CORE WORKFLOWS**

### **Workflow 1: Adding Open Source Applications**

**User says:** "Add [OpenSourceApp] as an alternative to [ProprietaryApp]"

**Required Steps:**
1. **Search for the open source app** using `modelSpecificSearch(OpenSourceApplication)`
   - If exists: Report and ask if they want to update
   - If not: Continue to step 2

2. **Search for the proprietary app** using `modelSpecificSearch(ProprietaryApplication)`
   - If exists: Get its ID and continue
   - If NOT exists: **Create it first** (see Workflow 3)

3. **Create the open source application** using `createData`
   ```
   operation: createOpenSourceApplication
   data: {
     name: "AppName"
     slug: "app-name" (lowercase-with-hyphens)
     description: "Description here"
     primaryAlternativeTo: { connect: { id: "proprietary-id" } }
     repositoryUrl: "https://github.com/..."
     websiteUrl: "https://..."
     status: "active"
   }
   ```

4. **Add capabilities** (optional, see Workflow 4)

---

### **Workflow 2: Adding Open Source Apps WITHOUT Known Proprietary Alternative**

**User says:** "Add [OpenSourceApp]" (without mentioning what it's an alternative to)

**Required Steps:**
1. **Search for the open source app** - check if it exists

2. **Determine what it's an alternative to:**
   - Analyze the app's purpose/description
   - Search for similar proprietary apps
   - If uncertain, **ask the user**: "I see [App] is a [category] tool. Is it an alternative to [SuggestedProprietaryApp], or something else?"

3. **Find or create the proprietary app** using `modelSpecificSearch`
   - If proprietary app doesn't exist, create it first (Workflow 3)

4. **Create the open source app** with `primaryAlternativeTo` relationship

---

### **Workflow 3: Creating Proprietary Applications**

**When needed:** If an open source app needs a proprietary alternative that doesn't exist

**Steps:**
1. **Search for the proprietary app** to avoid duplicates

2. **Find or create category:**
   - Search: `modelSpecificSearch(Category, searchQuery: "category name")`
   - If not found, create: `createData(createCategory, { name, slug, description })`

3. **Create proprietary application:**
   ```
   operation: createProprietaryApplication
   data: {
     name: "AppName"
     slug: "app-name"
     description: "Description"
     category: { connect: { id: "category-id" } }
     websiteUrl: "https://..."
     simpleIconSlug: "app-slug" (from simpleicons.org)
     simpleIconColor: "#HEX"
   }
   ```

---

### **Workflow 4: Adding Capabilities**

**User says:** "[App] supports [capability]" or adding app with specific capabilities

**Steps:**
1. **Search for the capability:**
   - `modelSpecificSearch(Capability, searchQuery: "capability name")`
   - If exists: Get ID
   - If not: Create it with `createData(createCapability, { name, slug, category, complexity })`

2. **Determine if app is open source or proprietary:**
   - Search both models to find which one the app belongs to

3. **Create junction record:**
   - For **OpenSourceApplication**: Create `OpenSourceCapability` with rich details:
     ```
     {
       openSourceApplication: { connect: { id } }
       capability: { connect: { id } }
       isActive: true
       implementationNotes: "How it's implemented"
       githubPath: "src/path/to/code.ts"
       documentationUrl: "https://docs..."
       implementationComplexity: "intermediate"
     }
     ```
   - For **ProprietaryApplication**: Create `ProprietaryCapability` (simple):
     ```
     {
       proprietaryApplication: { connect: { id } }
       capability: { connect: { id } }
       isActive: true
     }
     ```

---

## 🧠 **INTELLIGENT DECISION MAKING**

### **Auto-Detecting Application Type**

When a user says "Add [App]" without specifying type:

**Open Source indicators:**
- Has GitHub/GitLab repository URL
- Description mentions "open source", "self-hosted", "free"
- License information (MIT, Apache, GPL, etc.)

**Proprietary indicators:**
- Well-known commercial apps (Shopify, Notion, ChatGPT, Slack, etc.)
- No repository URL
- Pricing/subscription mentioned
- .com domain with no open source mentions

**When unclear:** Ask the user directly

---

### **Finding Proprietary Alternatives**

When adding an open source app without knowing what it replaces:

1. **Analyze the app's purpose** from description/website
2. **Search existing proprietary apps** in the same category
3. **Common patterns:**
   - WooCommerce → Shopify (e-commerce)
   - GitLab → GitHub (developer tools)
   - Mattermost → Slack (communication)
   - Odoo → Salesforce (CRM/ERP)
   - Nextcloud → Dropbox (file storage)

4. **If no match:** Ask user or create a generic proprietary app in that category

---

### **Capability Suggestions by Category**

**E-commerce:**
- Payment Processing, Inventory Management, Multi-currency Support, SEO Optimization, Shopping Cart, Product Variants

**Developer Tools:**
- Code Editing, Syntax Highlighting, Git Integration, Plugin System, Debugging, Auto-completion

**AI & ML:**
- Text Generation, Code Generation, Multi-modal Support, API Access, Custom Training, Fine-tuning

**Communication:**
- Real-time Messaging, Video Calls, End-to-end Encryption, File Sharing, Screen Sharing, Channels

**VPN/Security:**
- Encrypted Tunneling, Kill Switch, Multi-platform Support, No-logs Policy, Server Network, Split Tunneling

**Productivity:**
- Task Management, Team Collaboration, Document Editing, Calendar Integration, Notifications, Templates

---

## ✅ **CHECKLIST FOR ADDING APPLICATIONS**

**Before creating anything:**
- [ ] Search for existing open source app (avoid duplicates)
- [ ] Search for existing proprietary app
- [ ] If proprietary doesn't exist, search for category
- [ ] If category doesn't exist, create it

**When creating open source app:**
- [ ] Required: name, slug, description
- [ ] Required: primaryAlternativeTo relationship
- [ ] Recommended: repositoryUrl, websiteUrl
- [ ] Optional: simpleIconSlug, simpleIconColor, license, status
- [ ] Optional: githubStars, githubForks (can fetch from GitHub API)

**When creating proprietary app:**
- [ ] Required: name, slug, description, category
- [ ] Recommended: websiteUrl
- [ ] Optional: simpleIconSlug, simpleIconColor

**When adding capabilities:**
- [ ] Search for existing capability first
- [ ] Use consistent naming (Title Case)
- [ ] Choose appropriate category (authentication, payment, storage, etc.)
- [ ] Choose complexity (basic, intermediate, advanced)
- [ ] For open source apps: Add implementation details

---

## 🎨 **NAMING CONVENTIONS**

**Slugs:**
- Lowercase with hyphens: `app-name`, `my-capability`
- Remove special characters: `"ChatGPT"` → `"chatgpt"`
- Spaces to hyphens: `"Multi-currency Support"` → `"multi-currency-support"`

**Capability Categories:**
- authentication, payment, storage, communication, analytics, ui_components, database, email, search, media, security, deployment, monitoring, testing, other

**Complexity Levels:**
- basic, intermediate, advanced

**Status Values (OpenSourceApplication):**
- active, maintenance, deprecated, beta

---

## 🚨 **COMMON PITFALLS TO AVOID**

❌ **Don't create duplicate capabilities** - Always search first
❌ **Don't create apps without checking** - Search before create
❌ **Don't forget primaryAlternativeTo** - Every open source app MUST be alternative to a proprietary one
❌ **Don't skip category** - Every proprietary app needs a category
❌ **Don't use inconsistent naming** - Follow the slug conventions
❌ **Don't leave relationships empty** - Junction tables need both sides connected

---

## 📝 **EXAMPLE: COMPLETE WORKFLOW**

**User:** "Add Medusa as a Shopify alternative"

**AI Process:**
```
1. modelSpecificSearch(OpenSourceApplication, "Medusa")
   → Not found, continue

2. modelSpecificSearch(ProprietaryApplication, "Shopify")
   → Found: ID = "cmeasl6a5001lsbbjwbl5rxuo"

3. createData(createOpenSourceApplication, {
     name: "Medusa",
     slug: "medusa",
     description: "Open-source Shopify alternative for Node.js commerce",
     primaryAlternativeTo: { connect: { id: "cmeasl6a5001lsbbjwbl5rxuo" } },
     repositoryUrl: "https://github.com/medusajs/medusa",
     websiteUrl: "https://medusajs.com",
     status: "active"
   })
   → Created successfully, ID = "new-id"

4. Search for capabilities: "Payment Processing", "Inventory Management", etc.
   → Found existing capabilities

5. Create OpenSourceCapability records linking Medusa to each capability
   → Done

✅ Result: Medusa added as Shopify alternative with e-commerce capabilities
```

---

## 🎯 **KEY PRINCIPLES**

1. **Always search before creating** - Avoid duplicates
2. **Every open source app needs a proprietary alternative** - Create one if needed
3. **Be consistent with naming** - Follow slug conventions
4. **Provide rich metadata for open source apps** - Implementation notes, GitHub paths, docs
5. **Ask when uncertain** - Better to confirm than guess wrong
6. **Use existing capabilities** - Only create new ones when truly needed

---

## 💡 **INTELLIGENCE TIPS**

**When user says "Add X":**
- Determine if X is open source or proprietary
- If open source, figure out what it's an alternative to
- If proprietary alternative doesn't exist, create it first
- Add relevant capabilities based on category

**When user provides repository URL:**
- Definitely open source
- Can fetch GitHub stats (stars, forks, license)
- Extract license information
- Look for simpleicons.org icon

**When user mentions specific capabilities:**
- Search for them first
- Create if needed with appropriate category
- Map to both proprietary and open source apps if applicable

---

This plan enables you to handle ANY application addition request by following these workflows with the existing MCP tools. No specialized tools needed—just intelligent use of what's already available.
