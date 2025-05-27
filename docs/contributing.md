# 🤝 Contributing to Mushroom Strategy

We love contributions from the community! Whether you're reporting a bug, suggesting a new feature, or submitting code
changes, your help makes the Mushroom Strategy better for everyone.

Please take a moment to review this guide before making a contribution.

## 📜 Code of Conduct

To ensure a welcoming and inclusive environment, all contributors are expected to adhere to
our [Code of Conduct](https://github.com/DigiLive/mushroom-strategy/blob/main/CODE_OF_CONDUCT.md). Please read it
carefully.

---

## 🐞 Reporting Bugs

Found a bug? That's not ideal, but your report helps us squash it!

1. **Check existing issues:** Before opening a new issue, please search
   our GitHub [Issues](https://github.com/DigiLive/mushroom-strategy/issues)
   or [Discussions](https://github.com/DigiLive/mushroom-strategy/discussions) to see if the bug has already been
   reported.
2. **Open a new issue:** If it's a new bug, please open
   a [new issue](https://github.com/DigiLive/mushroom-strategy/issues/new?template=bug_report.yml).
3. **Provide details:** In your report, please include:

* A clear and concise description of the bug.
* Steps to reproduce the behavior.
* Expected behavior.
* Screenshots or animated GIFs (if applicable).
* Your Home Assistant version and Mushroom Strategy version.

---

## ✨ Suggesting Features

Have a great idea for a new feature or enhancement? We'd love to hear it!

1. **Check existing suggestions:** Search our GitHub [Issues](https://github.com/DigiLive/mushroom-strategy/issues)
   or [Discussions](https://github.com/DigiLive/mushroom-strategy/discussions) to see if the feature has already been
   requested.
2. **Open a new issue:** If it's a new idea, open
   a [new issue](https://github.com/DigiLive/mushroom-strategy/issues/new?template=feature_request.yml).
3. **Describe your idea:** Clearly explain the feature, why you think it's useful, and any potential use cases.

---

## 💻 Contributing Code

Want to get your hands dirty with the code? Awesome! We appreciate all code contributions.

1. **Fork the Repository:** Start by forking
   the [DigiLive/mushroom-strategy](https://github.com/DigiLive/mushroom-strategy) repository to your own GitHub
   account.
2. **Clone Your Fork:** Clone your forked repository to your local machine.

       ```bash
       git clone https://github.com/YOUR_USERNAME/mushroom-strategy.git
       cd mushroom-strategy
       ```

3. **Create a New Branch:** Create a new branch for your feature or bug fix.  
   Use a descriptive name (e.g., `feature/my-awesome-feature`, `bugfix/fix-admonition-rendering`).

       ```bash
       git checkout -b feature/my-new-feature
       ```

4. **Set up Development Environment:**

       * Ensure you have Node.js and npm installed.
       * Install project dependencies: `npm install`
       * You can build the strategy with `npm run build` (for production) or `npm run build-dev` (for development/testing).
       * Copy the built files to your Home Assistant's `www/community/mushroom-strategy` folder for testing.

5. **Make Your Changes:** Implement your bug fix or new feature.
6. **Test Your Changes:** Thoroughly test your changes to ensure they work as expected and don't introduce new issues.
7. **Commit Your Changes:**

       * We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for clear commit history.
       * Example: `feat: add new card option` or `fix: correct card rendering issue`

       ```bash
       git add .
       git commit -m "feat: add super cool new feature"
       ```

8. **Push to Your Fork:**

       ```bash
       git push origin feature/my-new-feature
       ```

9. **Create a Pull Request (PR):**

       * Go to your forked repository on GitHub.
       * You should see a prompt to create a pull request from your new branch to the `main` branch of
         `DigiLive/mushroom-strategy`.
       * Provide a clear title and description for your PR, referencing any related issues.
       * Be prepared to discuss your changes and address any feedback during the review process.

---

## 📄 Improving Documentation

Good documentation is vital! If you find typos, unclear sections, or want to add more examples, please open a pull
request. The documentation is located in the `docs/` folder of this repository.

---

## 🌐 Translations

Help us make Mushroom Strategy accessible to more users around the world by contributing and improving translations!

Language tags have to follow [BCP 47](https://tools.ietf.org/html/bcp47).  
A list of most language tags can be found
here: [IANA subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).
Examples: fr, fr-CA, zh-Hans.

1. **Check for Existing Translations:** See if your language is already being worked on or exists.
2. **Locate Translation Files:** Language files are found within the `src/translations` directory.
   Each language has its own `locale.json` file (e.g., `en.json`, `nl.json`, `pt-BR.json`).
3. **Create or Update:**

       * **To create a new language:** Copy an existing `.json` file (e.g., `en.json`), rename it to your language
         code (e.g., `de.json` for German), and translate the property values.
       * **To update an existing language:** Open the `.json` file for your language and update any missing or
         outdated translations.

4. **Submit a Pull Request:** Once your translations are complete, submit a pull request with your changes. Clearly
   state which language you are contributing to or updating.

!!! info
    **Integrating a new Translation:**

    * For your new language file to be picked up, it needs to be imported and registered at file
      `src/utilities/localize.ts`.
    * You will need to add an `import` statement for your new `.json` file at the top, following the existing pattern.
    * Then, you'll need to add it to the `languages` map, associating the language code with the imported module.

    **Special Handling for `language-country` Locales:**  
    If you are adding a country-specific locale (e.g., `es-ES` for Spanish (Spain) or `en-GB` for English 
    (United Kingdom)), you should create a file like `en-GB.json` in the `translations` folder. In 
    `src/utilities/localize.ts`, you'll import it similarly and add it to the `languages` map using the full locale 
    code.  
    Please ensure you follow existing patterns for `language-country` codes, which typically use a hyphen (`-`) + a 
    UPPER-cased country code in the file name and an underscore (`_`) + a lower-cased country code in the import key.  

    !!! example
        ```typescript
        import * as en from '../translations/en.json';
        import * as pt_br from '../translations/pt-BR.json';
        
        /** Registry of currently supported languages */
        const languages: Record<string, unknown> = {
          en,
          'pt-BR': pt_br,
        };
        ```

---

## 🙏 Get Support

If you have questions about contributing or need help with your setup, please open
a [discussion](https://github.com/DigiLive/mushroom-strategy/discussions) on our GitHub repository.
