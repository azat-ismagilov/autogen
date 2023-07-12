# Reaction video

Please, don't use manual CSS, try to use tailwind config and @apply instead.

Order of config application: default props in Root.tsx, user input in web interface, data in config.json. If you want some settings to be controlled in web interface, remove them from config.json.   

## Getting started 
Change videos and images in public folder. Change config.json.

## Commands

**Install Dependencies**

```console
npm i 
```

You might need to use force for now.

**Start Preview**

```console
npm start
```

**Render vertical reaction**

```console
npm remotion render ReactionVideo out/video.mp4
```

**Render horizontal reaction**

```console
npm remotion render ReactionVideoHorizontal out/video.mp4
```

**Upgrade Remotion**

```console
npm run upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## License

Notice that for some entities a company license is needed. Read [the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
