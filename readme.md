
# Because AI robots deserve holidays too!

Hackathon project from https://lu.ma/royrg8gx?tk=LXmV68

A fully autonomous video production that creates shorts for Youtube/Tiktok using Mistral AI for script, Azure TTS for audio and Luma AI for video.
In this example, we wanted to programatically make ads for AI robots that needs a break.

![auto-video-screenshot](https://github.com/user-attachments/assets/6e5313f7-5057-4a02-9616-f31de5145913)

## Run Restack Engine

```
docker run -d --pull always --name studio -p 5233:5233 -p 6233:6233 -p 7233:7233 ghcr.io/restackio/local-operator:main
```

Learn more at https://www.restack.io/autonomous-framework

## How to use

run services in the background

```
pnpm dev
```

in another shell, schedule the workflow

```
pnpm schedule
```

pnpm schedule


## You should Restack Engine UI with the following 

![localhost_5233__workflowId=1727553068979-adWorkflow runId=f03e205b-6891-4692-a94e-a9cc006c8ede scheduledEventId=44 (1)](https://github.com/user-attachments/assets/63ebdcff-94cd-44d7-95f3-80877be5c436)

## How the workflow works

### Step 1

Mistral to write ad for YouTube short for holidays for robots

### Step 2

Use Azure TTS to convert the text to speech

### Step 3

Use Lumaai to make the video

### Step 4

Extend Lumaai to 15s video

### Step 5

Merge video and audio

### Ideas for next steps

Upload the video to YouTube

Analyse watch time and behavior

Send report and ask for feedback

Implement human feedback and repeat 
