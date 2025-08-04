# How the Frontend and Backend Talk to Each Other

This document explains how our deployed frontend and backend services, which are in separate containers on Google Cloud Run, are able to communicate.

## The Big Picture: Two Separate Services

First, it's important to understand that we have two distinct applications running independently on Google Cloud Run:

1.  **The Backend:** A Python (FastAPI) application that serves our API. It listens for requests and sends back data.
2.  **The Frontend:** A JavaScript (Next.js) application that provides the user interface. It runs in the user's web browser.

When we deploy them, each gets its own unique public URL. The magic lies in making sure the frontend knows the URL of the backend.

## Backend Setup (`backend/Dockerfile`)

Our backend `Dockerfile` is straightforward. It sets up a Python environment, installs our dependencies, and runs the FastAPI application using `uvicorn`. The key line is:

```dockerfile
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

This tells the container to listen for traffic on port 8000. When we deploy this to Cloud Run, Google gives it a public URL (like `https://wsdemo-backend-165871915889.us-central1.run.app`) and directs incoming traffic to this port.

## Frontend Setup: The Connection

The frontend needs to make API calls (e.g., `fetch('/api/prompts')`) to the backend. We can't hardcode the backend's URL into our code because it would be different for local development (`http://localhost:8000`) versus the live deployment.

This is where environment variables come in.

### 1. Using an Environment Variable in the Code

If you look at the frontend code (e.g., in `src/components/PromptList.tsx`), you'll see that the `fetch` calls use `process.env.NEXT_PUBLIC_API_URL`:

```javascript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts`);
```

This tells our Next.js application to look for an environment variable named `NEXT_PUBLIC_API_URL` and use its value as the base for the API call.

When run locally, the variable is set to `http://localhost:8000` from the `.env.local` file.

### 2. Injecting the Variable at Build Time

So, how do we set this variable for our deployed application? We inject it when we build the Docker image for the frontend.

Our frontend `Dockerfile` has these important lines near the top:

```dockerfile
# Accept a build-time argument for the API URL
ARG NEXT_PUBLIC_API_URL
# Set it as an environment variable for the build process
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
```

This allows us to pass a value into the Docker build process. When we run the `docker build` command to deploy, we include a special flag:

```powershell
docker build --build-arg NEXT_PUBLIC_API_URL=https://wsdemo-backend-165871915889.us-central1.run.app -t wonder-sciences-frontend .
```

This `--build-arg` flag sets the value of `NEXT_PUBLIC_API_URL` to our live backend URL. The `npm run build` process then "bakes" this URL directly into the static JavaScript files it generates.

## Summary

To put it all together:

1.  We deploy our **backend** and get its public URL.
2.  We build our **frontend** Docker image, passing the backend's public URL in as a **build argument**.
3.  The Next.js build process replaces all instances of `process.env.NEXT_PUBLIC_API_URL` with the actual URL.
4.  We deploy the finished frontend container.

Now, when a user visits our frontend URL, the JavaScript that runs in their browser already knows the exact address of our backend API and can communicate with it successfully.
