# Notes to Deal with The Expo Go 52 SDK Upgrade:

Step 1: Pull from this Git Repo

Step 2: Follow these commands:
   npm install expo@latest (installs latest version of expo go)
   npx expo install --fix
   npx expo install --fix -- --legacy-peer-deps
   npx expo install --fix -- --legacy-peer-deps (run it again, on this second time it should just say "Dependencies up to date")
   Remember to re-paste your Google API key if you are starting fresh
