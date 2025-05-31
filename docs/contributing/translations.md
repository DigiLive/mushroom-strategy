# 🌐 Translations

Help us make Mushroom Strategy accessible to more users around the world by contributing and improving translations!

Language tags have to follow [BCP 47](https://tools.ietf.org/html/bcp47).  
A list of most language tags can be found here:
[IANA subtag registry](http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).
Examples: fr, fr-CA, zh-Hans.

1. **Check for Existing Translations:** See if your language is already being worked on or exists.
2. **Locate Translation Files:** Language files are found within the `src/translations` directory.
   Each language has its own `locale.json` file (e.g., `en.json`, `nl.json`, `pt-BR.json`).
3. **Create or Update:**

      * **To create a new language:** Copy an existing `.json` file (e.g., `en.json`), rename it to your language
        code (e.g., `de.json` for German), and translate the property values.
      * **To update an existing language:** Open the `.json` file for your language and update any missing or
        outdated translations.

4. **Test Your Changes:** Thoroughly test your changes to ensure they work as expected and don't introduce new issues.

     * You can build the strategy with `npm run build` (for production) or `npm run build-dev` (for development/testing).
     * Copy the built files to your Home Assistant's `www/community/mushroom-strategy` directory for testing.  
       **Remember to clear the cache of your Home Assistant client** to see the changes.

    !!! info

        If your `www/community/mushroom-strategy` directory contains a file called `mushroom-strategy.js.gz`, rename or 
        delete it.

5. **Format and Lint Your Changes:**

    * Run the formatter with `npm run json:format`.
    * Run the formatter with `npm run ts:format`.
    * Build the strategy with `npm run build`.

     All of these tasks should result without errors.

6. **Commit Your Changes.**

7. **Push to Your Fork.**

8. **Open a Pull Request (PR).**

---

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
