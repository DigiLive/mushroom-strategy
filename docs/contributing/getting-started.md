# 🚀 Getting Started

## ⚙️ Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Git**: For version control and managing your changes.

- **Node.js and npm**: Required for running scripts defined in `package.json` (e.g., linting).
  Download from [nodejs.org](https://nodejs.org/en/download/).

For contributing to the documentation, the following prerequisites are also required:

- **Python 3.7 or higher**: Download from [python.org/downloads](https://www.python.org/downloads/).

- **pip** (Python package installer): Usually comes with Python, but you can find installation instructions at
  [pip.pypa.io/en/stable/installation/](https://pip.pypa.io/en/stable/installation/).

## 🛠️ Local Environment

To make and preview your changes, you'll need to set up a development environment locally:

1. **Fork the Repository**: Go to our main repository on GitHub and click the "Fork" button.
   This creates a copy of the repository under your GitHub account.

2. **Clone Your Fork**: On your local machine, clone your forked repository using Git.

3. **Install Node.js Dependencies**:
   Navigate to the root of the cloned project (where `package.json` is located) and install its dependencies:

    ```bash
    npm install
    ```

4. **Install Python Documentation Tools**:
   Navigate to the root of the cloned project (where `mkdocs.yml` is located) and install MkDocs along with the
   necessary themes and plugins:

    ```bash
    pip install mkdocs mkdocs-material mkdocs-material-extensions
    ```
