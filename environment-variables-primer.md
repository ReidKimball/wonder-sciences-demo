# A Guide to Environment Variables in Our Next.js App

This document explains how we handle configuration and secrets, like API URLs, in our frontend application. This is a critical concept for both local development and our deployed application on Google Cloud Run.

## What are Environment Variables?

Environment variables are values that live outside of our source code. They allow us to change the application's behavior depending on where it's running (e.g., on your local machine vs. on a live server) without changing the code itself.

In our app, the most important environment variable is `NEXT_PUBLIC_API_URL`.

## How Next.js Loads Environment Variables

Next.js has a powerful, built-in system for handling environment variables. It automatically looks for and loads variables from specific files in the root of the `frontend` directory. You don't need to install any extra packages for this to work.

### The `.env.local` File

When you run the app locally with `npm run dev`, Next.js automatically finds the `.env.local` file and loads the variables inside it. This is why our local frontend can talk to our local backend at `http://localhost:8000`.

**Key Point:** The file **must** be named `.env.local`. This is a strict convention. If you rename it, Next.js will not find it.

### Environment-Specific Files

Next.js has a hierarchy of `.env` files it looks for. The main ones are:

1.  `.env.local`: Highest priority. Loaded for all environments. **Should not be committed to Git.**
2.  `.env.development`: For development-specific variables.
3.  `.env.production`: For production-specific variables.
4.  `.env`: Lowest priority. For default variables.

Variables in `.env.local` will always override variables in the other files, making it perfect for your personal local setup.

## The `NEXT_PUBLIC_` Prefix: A Critical Security Rule

By default, Next.js runs on a server, and it needs to be very careful about what information it sends to the user's browser (the client).

To prevent accidentally leaking sensitive information (like database passwords or private API keys), Next.js has a simple rule:

**Only environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.**

If you create a variable like `API_SECRET=12345` in your `.env.local` file, and try to access `process.env.API_SECRET` in a component, the value will be `undefined`. If you name it `NEXT_PUBLIC_API_SECRET=12345`, it will be available.

This is why our variable is named `NEXT_PUBLIC_API_URL`. It's a public piece of information that the browser needs to know.

## Summary for a Junior Developer

-   To add a configuration variable for local development, add it to the `.env.local` file in the `frontend` directory.
-   The file names (`.env.local`, etc.) are a strict Next.js convention and cannot be changed.
-   If the variable needs to be accessible in the browser, you **must** prefix its name with `NEXT_PUBLIC_`.
-   Never commit the `.env.local` file to Git. It's for your machine only.
