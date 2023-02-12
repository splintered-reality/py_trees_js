## XAuth

Read some articles that were using XAuth to help remotely forward across ssh connections
with different `DISPLAY` values.

What hasn't worked:

* Install `xauth` in the `Dockerfile` / mount `.Xauthority` in the `devcontainer.json`:

```
{
    "source": "${localEnv:HOME}${localEnv:USERPROFILE}/.Xauthority",
    "target": "/home/zen/.Xauthority",
    "type": "bind"
},
```