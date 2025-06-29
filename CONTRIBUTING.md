# Contributing to Open Source Builders

This guide provides comprehensive instructions for adding new tools, features, and alternatives to the Open Source Builders directory.

## Prerequisites

1. **API Access**: Ensure the GraphQL API is running at `http://localhost:3003/api/graphql`
2. **Authentication**: Set your Keystone session cookie as an environment variable:
   ```bash
   export KEYSTONE_SESSION="your-session-cookie-here"
   ```

## Quick Add Templates

### 1. Adding a Proprietary Tool with Open Source Alternatives

When you want to add a proprietary tool and its open source alternatives:

```
Add proprietary tool: [Tool Name]
- Description: [Brief description]
- Website: [URL]
- Category: [Category name]
- Features: [List key features]

Open source alternatives:
1. [Alternative 1 Name] - [GitHub URL]
2. [Alternative 2 Name] - [GitHub URL]
3. [Alternative 3 Name] - [GitHub URL]
```

**Example:**
```
Add proprietary tool: Calendly
- Description: Meeting scheduling automation platform
- Website: https://calendly.com
- Category: Productivity & Scheduling
- Features: Calendar integration, Automated scheduling, Team scheduling, Payment collection

Open source alternatives:
1. Cal.com - https://github.com/calcom/cal.com
2. Easy!Appointments - https://github.com/alextselegidis/easyappointments
3. Calendso - https://github.com/calendso/calendso
```

### 2. Adding an Open Source Alternative to Existing Proprietary Tool

When you want to add an open source alternative to an already existing proprietary tool:

```
Add open source alternative to [Proprietary Tool Name]:
- Name: [Tool Name]
- Repository: [GitHub URL]
- Description: [Brief description]
- Similarity Score: [1-100]
- Notes: [How it compares to the proprietary tool]
```

**Example:**
```
Add open source alternative to Notion:
- Name: AppFlowy
- Repository: https://github.com/AppFlowy-IO/AppFlowy
- Description: Open-source alternative to Notion built with Flutter and Rust
- Similarity Score: 85
- Notes: Provides similar block-based editing, databases, and kanban boards
```

### 3. Adding a Standalone Open Source Tool

When adding an open source tool that isn't necessarily an alternative:

```
Add open source tool: [Tool Name]
- Repository: [GitHub URL]
- Description: [Brief description]
- Category: [Category name]
- Features: [List key features]
```

**Example:**
```
Add open source tool: Grafana
- Repository: https://github.com/grafana/grafana
- Description: Open source analytics and monitoring platform
- Category: Analytics
- Features: Data visualization, Alerting, Dashboard creation, Multi-datasource support
```

### 4. Bulk Adding Tools

For adding multiple tools at once:

```
Bulk add tools:

Tool 1:
- Name: [Name]
- Type: [proprietary/opensource]
- Repository: [GitHub URL if opensource]
- Website: [URL]
- Description: [Description]
- Category: [Category]

Tool 2:
- Name: [Name]
- Type: [proprietary/opensource]
- Repository: [GitHub URL if opensource]
- Website: [URL]
- Description: [Description]
- Category: [Category]

[Continue for all tools...]
```

## Automated Features

When you provide tool information, the system will automatically:

1. **Fetch GitHub Data** (for open source tools):
   - Stars count
   - Forks count
   - Last commit date
   - License information
   - Primary language

2. **Simple Icons Integration**:
   - Automatically detect and apply brand icons
   - Set appropriate brand colors

3. **Feature Detection**:
   - Analyze repository and description
   - Auto-assign relevant features

4. **Alternative Matching**:
   - Find related tools based on features
   - Calculate similarity scores

## Categories

Current available categories:
- Development Tools
- Analytics
- Productivity & Note-taking
- Project Management
- Website Builders
- UI Components
- Design & Creativity
- Notes & Knowledge Management
- E-commerce Platforms
- Database Management
- Communication & Collaboration
- API Development
- Mobile Development
- Gaming & Game Development

If your tool doesn't fit these categories, specify a new category and it will be created.

## Features

Common features (auto-detected when applicable):
- Real-time collaboration
- Version control
- API integration
- Mobile support
- Self-hosted option
- Cloud storage
- Markdown support
- Plugin system
- Multi-language support
- Data export
- Two-factor authentication
- End-to-end encryption

## Best Practices

1. **Be Specific**: Provide clear, concise descriptions
2. **Verify URLs**: Ensure all URLs are valid and accessible
3. **Check Duplicates**: Search for existing tools before adding
4. **Accurate Categorization**: Choose the most appropriate category
5. **Feature Completeness**: List all major features for better matching

## Command Format for AI Assistant

When using this guide with an AI assistant, simply say:

```
Using CONTRIBUTING.md, please add:
[Paste your tool information using any template above]
```

The AI will handle:
- Creating the tool entries
- Fetching GitHub data
- Setting up relationships
- Assigning features
- Applying icons and styling

## Troubleshooting

**Authentication Issues**: Ensure your KEYSTONE_SESSION is valid and not expired

**Category Not Found**: The system will suggest creating a new category

**Duplicate Tools**: The system will alert you if a tool with the same slug exists

**GitHub Rate Limiting**: Set GITHUB_TOKEN environment variable for higher limits:
```bash
export GITHUB_TOKEN="your-github-personal-access-token"
```

## Examples of Complete Requests

### Example 1: E-commerce Platform
```
Add proprietary tool: BigCommerce
- Description: Leading e-commerce platform for growing businesses
- Website: https://bigcommerce.com
- Category: E-commerce Platforms
- Features: Multi-channel selling, Built-in SEO, Mobile responsive, API-first architecture

Open source alternatives:
1. WooCommerce - https://github.com/woocommerce/woocommerce
2. PrestaShop - https://github.com/PrestaShop/PrestaShop
3. OpenCart - https://github.com/opencart/opencart
```

### Example 2: Dev Tool Alternative
```
Add open source alternative to VS Code:
- Name: VSCodium
- Repository: https://github.com/VSCodium/vscodium
- Description: Free/Libre Open Source Software Binaries of VS Code
- Similarity Score: 95
- Notes: Identical to VS Code but without Microsoft telemetry/tracking
```

### Example 3: Analytics Tool
```
Add open source tool: Plausible
- Repository: https://github.com/plausible/analytics
- Description: Simple, open-source, lightweight and privacy-friendly web analytics
- Category: Analytics
- Features: Privacy-focused, No cookies, GDPR compliant, Real-time data, Custom events
```

## Need Help?

If you encounter issues or need assistance:
1. Check that the API is running: `curl http://localhost:3003/api/graphql`
2. Verify your authentication is valid
3. Review the error messages for specific guidance
4. Ensure all required fields are provided

Happy contributing!