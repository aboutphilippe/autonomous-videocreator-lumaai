# Autonomous Video Production

A fully autonomous video production that creates shorts for Youtube/Tiktok using OpenAI AI for script, Azure TTS for audio and Luma AI for video.
In these example, we wanted to programatically make LEGO figurine shorts.

## How to use

### Run Restack Engine

1. Clone the repository

2. Run `pnpm install`

3. Run Restack Engine

```
docker run -d --pull always --name studio -p 5233:5233 -p 6233:6233 -p 7233:7233 ghcr.io/restackio/engine:main
```

## You should see Restack Engine UI with the following

![localhost_5233__workflowId=1727553068979-adWorkflow runId=f03e205b-6891-4692-a94e-a9cc006c8ede scheduledEventId=44 (1)](https://github.com/user-attachments/assets/63ebdcff-94cd-44d7-95f3-80877be5c436)

Learn more at https://www.restack.io

4. Run `pnpm run dev`

## Tech stack

- Next.js
- TailwindCSS
- Supabase
- YouTube Data API
- Restack AI SDK
- Stable Diffusion
- ElevenLabs
