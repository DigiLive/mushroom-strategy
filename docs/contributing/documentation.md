# 📄 Contributing to the Documentation

Good documentation is crucial for our project's success!  
We truly appreciate any contributions, whether it's fixing a typo, clarifying a section, adding more examples, or even
extending existing topics. This guide will walk you through the process of contributing.

The entire documentation lives in the `docs/` folder of this repository.

---

1. **Follow the [Workflow](workflow.md):**

2. **Serve the Documentation Locally**:
   Start the local development server. This task needs to be run from the **project root** (where the `mkdocs.yml` file is):

    ```bash
    mkdocs serve
    ```

    This will usually launch a local server, at `http://127.0.0.1:8000`.
    The server will automatically reload in your browser as you make and save changes to the documentation files.  
    To stop the server, press **Ctrl + C** in the terminal.

3. **Edit Markdown Files**: All documentation content is written in **Markdown** (`.md` files).
    You can find them within the `docs/` folder.

    - For advanced formatting options, refer to the [Material for MkDocs reference](https://squidfunk.github.io/mkdocs-material/reference/).

4. **Add New Pages**:

    - Create a new `.md` file in the most appropriate directory within `docs/`.

    !!! important

        You'll need to add the new page to the navigation (`nav`) section of the `mkdocs.yml` file for it to appear in
        the sidebar. Follow the existing structure.

5. **Add Images**:

    - Place any image files into the `docs/images/` directory.
    - Reference them in your Markdown using the syntax: `![Alt text for accessibility](images/your-image-name.png)`

6. **Preview Changes**: As you save your `.md` files, the local server running at `http://127.0.0.1:8000` will
    automatically refresh, allowing you to see your changes instantly.

7. **Format and Lint Your Changes:**

    - Build the linter with `npm run md:lint-fix`.

     This task should result without errors.

8. **Commit Your Changes.**

9. **Push to Your Fork.**

10. **Open a Pull Request (PR).**

---

## Documentation Style and Quality

To maintain consistency and quality:

- **Clarity and Conciseness**: Use straightforward, clear, and concise language.
- **Examples**: Include images and code examples whenever they help clarify a point.

---

Thank you for taking the time to help us improve our documentation! Your contributions make a real difference. 🎉
