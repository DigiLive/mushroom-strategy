# Documentation Environment Setup

These notes cover the local setup and maintenance for the MkDocs + Mike versioning system.

---

## 1. Prerequisites

Ensure you have Python 3 installed. It is recommended to use a virtual environment.

```bash
# Install core documentation stack
pip install -r requirements.txt
```

## 2. One-Time Project Initialization

Run these once to prepare the gh-pages branch for the GitHub Action.

```bash
# 1. Ensure you have the gh-pages branch locally
git fetch origin gh-pages --depth=1

# 2. Create the root redirect (Receptionist)
# This points [https://digilive.github.io/mushroom-strategy/](https://digilive.github.io/mushroom-strategy/) to /latest/
mike set-default --push latest
```

## 3. Local Development Commands

### Fast Content Preview

Use this for writing. No version selector, but very fast:

```bash
mkdocs serve
```

### Full Versioning Preview

Use this to test the version selector:

```bash
# Deploy your current branch to a local-only version name
mike deploy main-local

# Serve the versioned site
mike serve
```

Access at: `http://127.0.0.1:8000/main-local/`

## 4. Maintenance & Troubleshooting

| Scenario                      | Command / Solution                                       |
|:------------------------------|:---------------------------------------------------------|
| **Remove a ghost version**    | `mike delete <version_name>`                             |
| **List all current versions** | `mike list`                                              |
| **Sync local gh-pages**       | `git checkout gh-pages && git pull origin gh-pages`      |
| **Selector is missing**       | Ensure `mkdocs.yml` has `extra: version: provider: mike` |
| **Update "latest" alias**     | `mike alias <version_number> latest`                     |
| **Set the default landing**   | `mike set-default latest`                                |

## 5. Critical Workflow Rules

- Never manually deploy a Release: Let the GitHub Release Action handle numbered versions (v1.x.x).
- Never manually deploy to 'main': Let the "Push to Main" Action handle the development version.
- Branch Protection: Avoid manual commits to the gh-pages branch.<br>
  If the versions.json gets corrupted, fix it locally on the gh-pages branch and push.

## Key Configuration (mkdocs.yml)

Ensure this block remains in your config to enable the UI integration:

```yaml
extra:
  version:
    provider: mike
```

## 6. Integration with package.json

To stay within the Node.js ecosystem, these scripts can be added to your `package.json`.<br>
This ensures you don't need to remember the specific `mike` or `mkdocs` commands:

```json
{
  "...": "...",
  "scripts": {
    "docs:serve": "mkdocs serve",
    "docs:serve-versioned": "mike serve",
    "docs:list": "mike list",
    "...": "..."
  }
}
```

## 7. Recovery: Restoring the Version Selector

If the version selector disappears from the site, the `versions.json` file is likely missing from the root of the
`gh-pages` branch.

### How to Rebuild it

You don't need to manually write the JSON. You can force `mike` to recreate it by "re-aliasing" your existing versions:

1. **Sync your local gh-pages**:

   ```bash
   git checkout gh-pages
   git pull origin gh-pages
   ```

2. Re-generate the JSON:

   ```bash
   mike alias main main
   mike alias <your-latest-tag> latest
   ```

3. **Verify and Push**: Check that versions.json exists in your folder, then:

   ```bash
   git add versions.json
   git commit -m "fix: restore versions.json"
   git push origin gh-pages
   ```

## 8. The "Brain" (versions.json)

The `versions.json` file lives only on the `gh-pages` branch. It tells the UI which versions exist and which aliases
(like `latest`) point where.

### Why it matters

- If a version isn't in this file, it won't show in the dropdown.
- If this file is missing, the version selector disappears.

### Structure Example

```json
[
  {
    "version": "main",
    "title": "main",
    "aliases": []
  },
  {
    "version": "v1.0.0",
    "title": "v1.0.0",
    "aliases": ["latest"]
  }
]
```

## 9. The `site/` Folder and `.gitignore`

When running documentation tools locally, a `site/` directory may be created.

### Local Behavior

- **`mkdocs serve`**: Does not usually create a physical `site/` folder; it serves the site from memory.

- **`mkdocs build`**: Generates a static version of the current docs into `site/`.

- **`mike deploy`**: Bypasses the standard `site/` folder logic.
  It renders the site and commits it directly to a temporary area before pushing to the `gh-pages` branch.

### The "Hands-Off" Rule

The `site/` folder must **never** be committed to the `main` branch.<br>
It contains generated assets that will cause merge conflicts and bloat the repository.

### Maintenance Actions

1. **Ensure `.gitignore` includes `site/`**:
   Verify your `.gitignore` at the project root has a line for `/site/`.

2. **Cleaning up**:
   If you accidentally run a manual build and want to clean your workspace: Delete the `site/` folder.
