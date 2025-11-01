# AI Agent Testing Repository

A dedicated repository for testing and experimenting with AI agents, automation workflows, and code review systems.

## 📋 Overview

This repository serves as a testing ground for AI-powered automation workflows, particularly focused on automated code review using n8n and AI language models. The primary workflow implements an intelligent GitHub Pull Request review system that provides automated feedback on code changes.

## 🤖 Featured Workflow: AI Code Review Agent

### Description

An automated code review system that triggers on GitHub Pull Requests and provides intelligent, context-aware feedback using AI. The workflow integrates with GitHub, OpenAI GPT-4, and Google Sheets to deliver comprehensive code reviews based on your team's best practices.

### Workflow Architecture

```
┌─────────────────┐
│   PR Trigger    │  ← GitHub webhook on pull_request event
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Get file's Diffs from PR │  ← Fetch changed files via GitHub API
└────────┬────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Create target Prompt from    │  ← Parse diffs & build AI prompt
│ PR Diffs (JavaScript)        │
└────────┬─────────────────────┘
         │
         ▼
┌─────────────────────┐     ┌────────────────────┐
│ Code Review Agent   │ ◄───┤ OpenAI GPT-4 Mini  │
│ (LangChain)         │     └────────────────────┘
│                     │     ┌────────────────────┐
│                     │ ◄───┤ Google Sheets Tool │
│                     │     │ (Best Practices)   │
└────────┬────────────┘     └────────────────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Robot    │  ← Post review comment
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Add Label to PR │  ← Tag PR with "ReviewedByAI"
└─────────────────┘
```

### Workflow Components

#### 1. **PR Trigger**
- **Type:** GitHub Trigger
- **Function:** Initiates the workflow whenever a pull request event occurs on the specified repository
- **Configuration:** Requires GitHub OAuth2 authentication

#### 2. **Get file's Diffs from PR**
- **Type:** HTTP Request
- **Function:** Fetches the list of changed files and their diffs from the pull request
- **Endpoint:** `https://api.github.com/repos/{owner}/{repo}/pulls/{number}/files`
- **Output:** Array of files with patches showing code changes

#### 3. **Create target Prompt from PR Diffs**
- **Type:** Code (JavaScript)
- **Function:** Processes the file diffs and constructs a structured prompt for the AI
- **Key Features:**
  - Parses each file's diff/patch
  - Formats changes in markdown with code blocks
  - Generates natural language instructions for the AI reviewer
  - Handles binary files gracefully
  - Escapes triple backticks to prevent markdown issues

**Sample Output:**
```
You are a senior iOS developer. 
Please review the following code changes in these files:

### Fichier : src/example.swift

```diff
- old code
+ new code
```
---

Your mission:
- Review the proposed code changes file by file
- Generate inline comments on relevant lines
- Ignore files without patches
- Do not repeat code snippets or filenames
- Write comments directly, without introducing context
```

#### 4. **Code Review Agent**
- **Type:** LangChain Agent
- **AI Model:** OpenAI GPT-4 Mini
- **Function:** Analyzes code changes and generates review comments
- **Connected Tools:**
  - **OpenAI Chat Model:** Provides language understanding and generation
  - **Google Sheets Tool:** References team coding guidelines and best practices
- **Configuration:** Uses custom prompt with the formatted diffs

#### 5. **Code Best Practices (Google Sheets Tool)**
- **Type:** Google Sheets Tool
- **Function:** Enables the AI agent to reference team coding guidelines stored in Google Sheets
- **Benefits:** 
  - Provides consistent, opinionated reviews
  - Aligns with team standards
  - Customizable per project/team
- **Note:** Can be replaced with any other database or knowledge base

#### 6. **GitHub Robot**
- **Type:** GitHub Node (Review Comment)
- **Function:** Posts the AI-generated review as a comment on the pull request
- **Output:** Creates a review comment visible to all PR participants

#### 7. **Add Label to PR**
- **Type:** GitHub Node (Edit Issue)
- **Function:** Automatically adds a "ReviewedByAI" label to the PR
- **Purpose:** Track which PRs have been reviewed by the AI system

## 🚀 Setup Instructions

### Prerequisites

- **n8n instance** (self-hosted or cloud)
- **GitHub account** with repository access
- **OpenAI API key** (for GPT-4 access)
- **Google account** (optional, for best practices sheet)

### Step-by-Step Setup

1. **Import the Workflow**
   - Copy the n8n JSON workflow provided
   - In n8n, go to **Workflows** → **Import from File/URL**
   - Paste the JSON and save

2. **Configure GitHub Credentials**
   - Set up **GitHub OAuth2** credentials for the PR Trigger and Label nodes
   - Set up **GitHub API** credentials for the GitHub Robot node
   - Grant necessary permissions: `repo`, `write:repo_hook`

3. **Configure OpenAI Credentials**
   - Add your OpenAI API key in the **OpenAI Chat Model** node
   - Model used: `gpt-4o-mini` (cost-effective option)

4. **Set up Google Sheets (Optional)**
   - Create a Google Sheet with your coding best practices
   - Configure Google Sheets OAuth2 credentials
   - Link the sheet in the **Code Best Practices** node

5. **Configure Repository Settings**
   - In **PR Trigger** node:
     - Select your repository owner
     - Select your repository name
   - Update the same in **GitHub Robot** and **Add Label to PR** nodes

6. **Activate the Workflow**
   - Click the **Active** toggle in n8n
   - Test by creating a pull request in your repository

## 📝 Usage

### Testing the Workflow

1. **Create a Pull Request** in your GitHub repository
2. The workflow automatically triggers on PR creation/update
3. The AI reviews the code changes within seconds
4. Review comments appear on the PR
5. The PR is labeled with "ReviewedByAI"

### Customizing the Review Prompt

Edit the JavaScript code in the **Create target Prompt from PR Diffs** node to:
- Change the reviewer role (e.g., "senior iOS developer" → "Python expert")
- Modify review criteria
- Adjust output format
- Add specific checks or requirements

### Updating Best Practices

Maintain your Google Sheet with columns like:
- **Category** (e.g., Naming, Architecture, Performance)
- **Rule** (specific guideline)
- **Example** (code snippet or description)
- **Priority** (Low, Medium, High)

## 🔧 Configuration

### Environment Variables

None required for this workflow, all credentials are managed within n8n.

### Workflow Settings

- **Execution Order:** v1
- **Workflow Status:** Inactive by default (activate after setup)
- **Webhook ID:** Auto-generated for PR Trigger

## 🧪 Testing Scenarios

Use this repository to test:

1. **Different PR sizes:**
   - Single file changes
   - Multiple file modifications
   - Large refactoring PRs

2. **Code quality scenarios:**
   - Intentional bugs
   - Style violations
   - Best practice deviations
   - Performance issues

3. **AI agent behavior:**
   - Response accuracy
   - Context understanding
   - Review consistency
   - Edge case handling

4. **Workflow reliability:**
   - Trigger consistency
   - Error handling
   - API rate limits
   - Timeout scenarios

## 📊 Workflow Metrics

Track these metrics to evaluate performance:

- **Response Time:** Time from PR creation to review comment
- **Accuracy:** Relevance and correctness of suggestions
- **Coverage:** Percentage of significant changes reviewed
- **False Positives:** Incorrect suggestions flagged
- **Cost:** OpenAI API usage per review

## 🔒 Security Considerations

- **API Keys:** Store securely in n8n credentials, never in code
- **Repository Access:** Use minimal required permissions
- **Review Sensitivity:** Be cautious with proprietary code in cloud AI services
- **Webhook Security:** Verify webhook signatures from GitHub
- **Data Privacy:** Consider self-hosted AI models for sensitive projects

## 🛠️ Troubleshooting

### Common Issues

**Workflow doesn't trigger:**
- Verify webhook is registered in GitHub repository settings
- Check n8n instance is publicly accessible
- Confirm GitHub credentials are valid

**No review comment posted:**
- Check OpenAI API key and quota
- Verify GitHub API credentials have write permissions
- Review n8n execution logs for errors

**Incomplete or poor reviews:**
- Adjust the AI prompt for clarity
- Ensure Google Sheets best practices are comprehensive
- Consider upgrading to GPT-4 (full version) for better accuracy

**Rate limiting:**
- Implement exponential backoff in HTTP nodes
- Add delay nodes between API calls
- Monitor GitHub/OpenAI API usage

## 🎯 Future Enhancements

Potential improvements for this workflow:

- [ ] Multi-language support for different tech stacks
- [ ] Integration with Slack/Teams for notifications
- [ ] PR diff caching to avoid redundant API calls
- [ ] Inline code suggestions (GitHub suggestions format)
- [ ] Security vulnerability detection
- [ ] Performance benchmarking
- [ ] Automated test coverage analysis
- [ ] Integration with CI/CD pipelines
- [ ] Custom rule engine for team-specific checks
- [ ] Learning from accepted/rejected suggestions

## 📚 Resources

- **n8n Documentation:** https://docs.n8n.io
- **OpenAI API:** https://platform.openai.com/docs
- **GitHub REST API:** https://docs.github.com/en/rest
- **LangChain:** https://js.langchain.com/docs

## 🤝 Contributing

This is a testing repository. Feel free to:
- Create test PRs with different scenarios
- Experiment with workflow modifications
- Document findings and edge cases
- Share improvements and optimizations

## 📄 License

This is a testing repository for educational and experimental purposes.

## 👤 Author

**Repository Owner:** anurag3407  
**Purpose:** AI Agent Testing and Experimentation  
**Created:** November 2025

---

**Note:** This workflow uses AI for automated code review. Always have human developers perform final reviews before merging critical changes.
