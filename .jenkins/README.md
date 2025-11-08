# Jenkins Pipeline Documentation

## Quick Setup

### 1. Jenkins Prerequisites
- Jenkins 2.x or higher
- Required Plugins: Git, Pipeline, NodeJS, JUnit, HTML Publisher

### 2. Configure NodeJS
1. Go to **Manage Jenkins → Global Tool Configuration**
2. Add NodeJS installation named `NodeJS` (version 16.x+)
3. Save configuration

### 3. Create Pipeline Job
1. Create new Pipeline job
2. Set SCM to Git: `https://github.com/SAP-AWengerS/Warranty-Wallent.git`
3. Script Path: `Jenkinsfile`
4. Save

### 4. Trigger Options
- **Webhook**: Configure GitHub webhook to `http://jenkins-url/github-webhook/`
- **Manual**: Click "Build Now"
- **Poll SCM**: Schedule `H/5 * * * *` (every 5 mins)

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| Checkout | Pull latest code from repository |
| Environment Info | Display Node.js, npm, git info |
| Install Dependencies | Install frontend & backend packages (parallel) |
| Code Quality Checks | Run linting (parallel) |
| Run Tests | Execute test suites with coverage |
| Build | Build frontend & validate backend |
| Security Audit | Check for vulnerabilities |
| Archive Artifacts | Save build artifacts |

## Viewing Results

- **Test Results**: Click build → "Test Results"
- **Coverage**: Click build → "Frontend Coverage Report"
- **Logs**: Click build → "Console Output"

## Troubleshooting

**NodeJS not found**: Verify tool configuration name matches `NodeJS` exactly

**Tests fail in CI**: Check `CI=true` environment variable is set

**Permission errors**: Ensure Jenkins user has workspace permissions

## Enable Notifications

Edit the `post` section in Jenkinsfile to uncomment email/Slack notifications.

---

For detailed setup instructions, see the Jenkinsfile comments.
