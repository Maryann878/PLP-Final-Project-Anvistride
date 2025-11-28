# GitHub Actions CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` or `develop` branches.

**Jobs:**

- **Frontend CI**
  - ✅ ESLint code linting
  - ✅ TypeScript type checking
  - ✅ Unit tests (Vitest)
  - ✅ Production build verification
  - 📦 Build artifacts uploaded

- **Backend CI**
  - ✅ ESLint code linting
  - ✅ Build verification
  - ✅ Server startup verification

- **Docker Build Test** (on push only)
  - ✅ Docker image build verification
  - ✅ Ensures Dockerfile is valid

- **CI Status**
  - ✅ Combined status check for all jobs

### 2. Deploy Pipeline (`.github/workflows/deploy.yml`)

Runs on pushes to `main` branch or manual trigger.

**Jobs:**

- **Deploy Frontend** (Vercel)
  - Builds and deploys frontend to Vercel
  - Requires: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

- **Deploy Backend** (Railway)
  - Deploys backend to Railway
  - Requires: `RAILWAY_TOKEN`

## Required GitHub Secrets

To enable deployments, add these secrets in your GitHub repository settings:

### For Frontend Deployment (Vercel)
- `VERCEL_TOKEN` - Vercel authentication token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `VITE_API_URL` - Frontend API URL (optional, has default)

### For Backend Deployment (Railway)
- `RAILWAY_TOKEN` - Railway authentication token

### Optional (for testing)
- `MONGODB_URI` - MongoDB connection string (optional, has default)
- `JWT_SECRET` - JWT secret key (optional, has default)
- `CLIENT_URL` - Client URL (optional, has default)

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

## Workflow Status Badge

Add this to your README.md to show CI status:

```markdown
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%2FCD%20Pipeline/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

## Local Testing

You can test the workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
# Windows: choco install act-cli
# macOS: brew install act
# Linux: See act documentation

# Run CI workflow
act push

# Run specific job
act -j frontend-ci
```

## Customization

### Adding More Tests

The workflow automatically runs all tests found in the `client` directory. Add new test files following the existing patterns.

### Adding More Linting Rules

Update ESLint configurations:
- Frontend: `client/eslint.config.js`
- Backend: `server/.eslintrc.cjs`

### Changing Node Version

Update the `node-version` in the workflow matrix:

```yaml
strategy:
  matrix:
    node-version: [20.x, 22.x]  # Test multiple versions
```

## Troubleshooting

### Workflow Fails on Linting

- Run `npm run lint` locally to see errors
- Fix linting issues or update ESLint config

### Workflow Fails on Tests

- Run `npm test` locally in the client directory
- Ensure all tests pass before pushing

### Build Fails

- Check for missing environment variables
- Verify all dependencies are in package.json
- Check for TypeScript errors

### Deployment Fails

- Verify all required secrets are set
- Check deployment platform status
- Review deployment logs in the Actions tab

