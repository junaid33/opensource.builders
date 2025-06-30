# Research and Add Missing Tools from GitHub Issues

## Context
You are working on the Open Source Builders project, a directory that helps users find open source alternatives to proprietary software. Based on analysis of GitHub issues from the old repository (junaid33/openource.builders), there are several tools that users requested but were never properly added to the database.

## Your Task
Research and add the missing tools identified from GitHub issues analysis. You have access to the CONTRIBUTING.md guide which explains how to add tools.

## Priority Tools to Research and Add

### **High Priority - Cloud Storage & File Sharing**
1. **OneDrive** (Microsoft) - Major proprietary cloud storage platform
2. **Box.com/Box.net** - Enterprise file sharing platform  
3. **Dropbox** - May need additional open source alternatives beyond what's already there

### **Development Tools**
4. **Termius** (SSH client) - Requested in GitHub issues
5. **Semgrep CE** (code analysis) - Static analysis tool
6. **Autodesk Viewer** - CAD file viewer

### **Audio/Media Processing**
7. **dbpoweramp** (audio converter) - Issue #249 suggested **freac** as alternative
8. **Spotify** - Issue #317 suggested alternatives: **Funkwhale**, **Airsonic**, **Reel2bits**, **mStream**, **Resonate**
9. **Deezer** - Music streaming platform
10. **Napster** - Music streaming platform

### **Modern Development Platforms**
11. **Netlify** - Static site hosting and deployment
12. **Vercel** - Frontend deployment platform

### **Productivity & Organization**
13. **mindmapping.com** - Mind mapping tool
14. **ClickUp** (mind mapping features) - Project management with mind mapping
15. **Mindomo** - Mind mapping and collaboration
16. **Bitly** - URL shortener service
17. **Canny.io** - Product feedback platform (Issue #8)

### **Suggested Open Source Alternatives from Issues**
These were specifically mentioned in GitHub issues as alternatives:
- **freac** (alternative to dbpoweramp)
- **Funkwhale** (music streaming)
- **Airsonic** (music streaming)
- **Reel2bits** (music streaming)  
- **mStream** (music streaming)
- **Resonate** (music streaming)
- **Brie.fi/ng** (mentioned as Zoom alternative)
- **mermaid** (mind mapping/diagramming)
- **d2** (diagramming)

## Research Requirements

For each tool you research:

1. **Verify the proprietary tool exists and is significant**
2. **Find 2-3 quality open source alternatives** 
3. **Research each alternative thoroughly**:
   - GitHub repository stats (stars, forks, activity)
   - Key features and capabilities
   - How it compares to the proprietary tool
   - Quality and maintenance status

4. **Use the GitHub MCP to research repositories** to get:
   - Detailed functionality analysis
   - Technology stack
   - Community activity and health
   - Documentation quality

## Output Format

For each proprietary tool, use the CONTRIBUTING.md format:

```
Add proprietary tool: [Tool Name]
- Description: [Brief description]
- Website: [URL]  
- Category: [Appropriate category]
- Features: [List key features]

Open source alternatives:
1. [Alternative 1 Name] - [GitHub URL]
   - Description: [What it does]
   - Similarity Score: [1-100]
   - Notes: [How it compares to proprietary tool]
2. [Alternative 2 Name] - [GitHub URL]
   - Description: [What it does]  
   - Similarity Score: [1-100]
   - Notes: [How it compares to proprietary tool]
3. [Alternative 3 Name] - [GitHub URL]
   - Description: [What it does]
   - Similarity Score: [1-100] 
   - Notes: [How it compares to proprietary tool]
```

## Special Focus Areas

### **Cloud Storage Priority**
This is the biggest gap identified. Focus on finding mature, well-maintained alternatives to OneDrive, Box, and additional Dropbox alternatives.

### **Music Streaming Complexity**
Music streaming has licensing challenges. Focus on self-hosted solutions that users can legally use with their own music collections.

### **Developer Tools**
The developer community is active in requesting these tools. Prioritize tools that have clear, documented alternatives.

## Quality Standards

Only add tools that meet these criteria:
- **Proprietary tool**: Widely used, commercially significant
- **Open source alternatives**: 
  - Active development (commits in last 6 months)
  - Good documentation
  - Reasonable GitHub stats (100+ stars preferred)
  - Actually functional (not just concept/demo)
  - Clear installation instructions

## API Information

- **API URL**: `http://localhost:3000/api/graphql`
- **Authentication**: Use the provided session cookie
- **Follow CONTRIBUTING.md**: All automated features will handle GitHub data fetching, icon assignment, etc.

## Expected Output

Provide a comprehensive list of research findings and then use the CONTRIBUTING.md format to add the most valuable tools. Focus on quality over quantity - it's better to add 10 well-researched, high-quality alternatives than 30 poorly researched ones.

Priority order:
1. Cloud storage tools (highest user demand)
2. Developer tools (active community)  
3. Audio/media tools (specific requests)
4. Productivity tools (general usefulness)

Start with the highest priority items and work your way down the list based on research quality and tool significance.