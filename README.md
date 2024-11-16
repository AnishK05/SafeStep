# Team Notes to Deal with The Expo Go 52 SDK Upgrade

## Step 1: Pull the Latest Code

First, pull the latest code from the Git repository:

```bash
git pull origin main
```

## Step 2: Install the Latest Expo Version

Run the following commands in your project root to upgrade Expo and fix dependencies:

```bash
npm install expo@latest
```

Fix dependencies: Use the following commands to ensure all dependencies are up-to-date and compatible with Expo Go 52 SDK:

```bash
npx expo install --fix
npx expo install --fix -- --legacy-peer-deps
```

Repeat the fix command: Run the legacy peer dependencies command one more time to confirm all dependencies are up-to-date:

```bash
npx expo install --fix -- --legacy-peer-deps
```

## Step 3: Set Up Environment Variables

Create your .env file with your Google Maps API key if you started from scratch
