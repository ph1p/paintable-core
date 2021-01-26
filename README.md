# @paintable/core

This is the core module.
And you can use it inside your webpage. You can find an example inside the `public` folder or click on this link [https://paintable-core.vercel.app](https://paintable-core.vercel.app) to visit a deployed demo page.

```bash
npm install @paintable/core
```

### How to use

This is the smallest example. It uses a CDN to load the library.

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <canvas id="canvas" height="500" width="500"></canvas><br />

    <script src="https://cdn.jsdelivr.net/npm/@paintable/core"></script>
    <script>
      // create instance
      const paintable = new Paintable();

      // set the canvas element
      paintable.setCanvas(document.querySelector('#canvas'));

      // activate paintable
      paintable.setActive(true);
    </script>
  </body>
</html>
```

### Development

```bash
npm run install
npm run serve
```
