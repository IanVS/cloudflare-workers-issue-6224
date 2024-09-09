## Reproduction

This is a minimal reproduction of issue https://github.com/cloudflare/workers-sdk/issues/6224.

## Prerequsites 

Run `corepack enable` to be sure to have the correct version of pnpm installed.


## Reproduction steps

Run `pnpm reproduce`

This will install node modules, build the website, and try to deploy it.  

Note: You will likely need to authenticate and create a new pages project.

When the command finishes, you should get an error like this:

```
✘ [ERROR] ENOENT: no such file or directory, scandir '/Users/ianvs/code/experiments/cloudflare-pnpm-repro/build'
```

