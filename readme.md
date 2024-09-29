
![auto-video (1)](https://github.com/user-attachments/assets/56edeb97-6d81-4d1b-8e76-15817d57045f)

# Because AI robots deserve holidays too!

Hackarthin project from https://lu.ma/royrg8gx?tk=LXmV68

A fully autonomous video production that creates shorts for Youtube/Tiktok using Mistral AI for script, Azure TTS for audio and Luma AI for video.
In this example, we wanted to programtically make ads for AI robots that needs a break.

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

## How it works

## Step 1

Mistral to write ad for YouTube short for holidays for robots

## Step 2

Use Azure TTS to convert the text to speech

## Step 3

Use Lumaai to make the video

## Step 4

Extend Lumaai to 15s video

## Step 5

Merge bideo and audio

<!-- ## Step 6

Upload the video to YouTube

## Step 7

Analyse watch time and behavior

## Step 8

Send report and ask for feedback

## Step 9

Implement feedback and repeat -->
