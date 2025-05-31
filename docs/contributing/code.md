# 💻 Contributing Code

Want to get your hands dirty with the code? Awesome! We appreciate all code contributions.

1. **Follow the [Workflow](workflow.md):**

2. **Make Your Changes:** Implement your bug fix or new feature.

3. **Test Your Changes:** Thoroughly test your changes to ensure they work as expected and don't introduce new issues.

     * You can build the strategy with `npm run build` (for production) or `npm run build-dev` (for development/testing).
     * Copy the built files to your Home Assistant's `www/community/mushroom-strategy` directory for testing.  
       **Remember to clear the cache of your Home Assistant client** to see the changes.

    !!! info

        If your `www/community/mushroom-strategy` directory contains a file called `mushroom-strategy.js.gz`, rename or 
        delete it.

4. **Format and Lint Your Changes:**

    * Run the formatter with `npm run ts:format`.
    * Build the strategy with `npm run build`.

     Both of these tasks should result without errors.

5. **Commit Your Changes.**

6. **Push to Your Fork.**

7. **Open a Pull Request (PR).**

---

Thank you for taking the time to help us improve our project! Your contributions make a real difference. 🎉
