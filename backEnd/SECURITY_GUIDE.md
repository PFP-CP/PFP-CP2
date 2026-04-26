# Backend Security & Environment Setup Guide

## 🚨 Important Security Update 🚨
We have recently updated our backend configuration to remove hardcoded sensitive information (like database passwords, S3 keys, and email passwords) from our codebase. All sensitive configurations are now managed using **Environment Variables**.

This guide explains how to set up your local development environment and our team's security best practices.

---

## 1. The `.env` File vs. `.env.example`

We now use a file named `.env` to store all our secrets.

*   **`.env`**: This file contains the *real* passwords and API keys. **IT MUST NEVER BE COMMITTED TO GITHUB.** It is already listed in our `.gitignore` file to prevent accidental uploads.
*   **`.env.example`**: This is a template file that shows which variables the application needs to run, but it contains fake/dummy values. This file *is* committed to GitHub so new developers know what variables to configure.

---

## 2. Local Setup Instructions for New Contributors

When you clone this repository, you will not have a `.env` file, and the Django backend will not connect to the database or S3 until you create one.

**Step-by-step setup:**

1.  Navigate to the `backEnd/` directory.
2.  Create a copy of the `.env.example` file and name it `.env`:
    *   *Windows:* `copy .env.example .env`
    *   *Mac/Linux:* `cp .env.example .env`
3.  Open the newly created `.env` file in your text editor.
4.  Replace the placeholder/dummy values with the real project credentials.

### How do I get the real credentials?
Because the real credentials provide full access to our Supabase database, AWS S3 storage, and application email, they are **NOT** stored anywhere on GitHub.

To get the real `.env` values, please request them from the project administrator or lead developer via a **secure, private channel** (e.g., direct message, secure password manager, or team chat). **Do not ask for or share them in GitHub Issues or public forums.**

---

## 3. Adding New Variables in the Future

If you are building a new feature that requires a secret key (like a new API key or external service token), please follow these steps:

1.  Add the new variable and its real value to your local `.env` file.
2.  Add the new variable with a *dummy* value (e.g., `NEW_SERVICE_KEY=your-key-here`) to the `.env.example` file.
3.  Update `backEnd/config/settings.py` to read the new variable securely:
    ```python
    import os
    # Provide a safe fallback if necessary, or let it fail loudly if required
    MY_NEW_KEY = os.environ.get("MY_NEW_KEY", "default_fallback_value")
    ```
4.  Commit and push your code (which will include the updated `.env.example` and `settings.py`, but *not* your `.env` file).
5.  Notify the team via our communication channel so everyone can update their local `.env` files with the real key.

---

## Summary Rules

*   **NEVER** type passwords or API keys directly into Python files.
*   **NEVER** force-add the `.env` file to Git (`git add -f .env`).
*   **ALWAYS** use `os.environ.get()` in Django settings to read secrets.