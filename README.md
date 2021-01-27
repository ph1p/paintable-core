# @paintable/core

This is the core module.
And you can use it inside your webpage, if you want

**Demo:** [https://paintable-core.vercel.app](https://paintable-core.vercel.app) (`npm run vercel-build`)

```bash
npm install @paintable/core
```

### How to use

Import library:

```javascript
import { Paintable } from '@paintable/core';
```

or load from a CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@paintable/core"></script>
```

and create an instance with

```javascript
const paintable = new Paintable(/*
  OPTIONS { scope: 'the-name' }
*/);
```

First of all, you need to know all about the `properties` and `methods` of the `paintable` instance.

#### Instance properities

These are the properties of the paintable. You can pass them initially as an object to the constructor or/and set them with an appropriate `method`. For example if you want to set the `canvas` asynchronously.

| Value/Key | Method         | Type              | Description                             | Default   | Required |
| --------- | -------------- | ----------------- | --------------------------------------- | --------- | -------- |
| scope     | setScope()     | string            | A unqiue "scope" name for your painting | paintable | -        |
| color     | setColor()     | string            | Drawing color                           | #000000   | -        |
| accuracy  | setAccuracy()  | number            | Line accuracy. higher = better curves   | 4         | -        |
| lineWidth | setLineWidth() | number            | Size of line                            | 5         | -        |
| threshold | setThreshold() | number            | Distance after line starts              | 0         | -        |
| factor    | setFactor()    | number            | Sacling factor                          | 1         | -        |
| isEraser  | setEraser()    | boolean           | Indicator if eraser is active           | false     | -        |
| isActive  | setActive()    | boolean           | Indicator if paint is activated         | false     | -        |
| canvas    | setCanvas()    | HTMLCanvasElement | The canvas element                      | null      | x        |

#### Instance methods to handle the canvas

| Method                         | Description                                                                                        | Only | Only if `isActive` is `true` |
| ------------------------------ | -------------------------------------------------------------------------------------------------- | ---- | ---------------------------- |
| undo()                         | Undo step                                                                                          |      | x                            |
| redo()                         | Redo step                                                                                          |      | x                            |
| cancel()                       | Cancel draw                                                                                        |      | x                            |
| save()                         | Save the current image                                                                             |      | x                            |
| clear(`keepHistory` = `false`) | You can set a `keepHistory` to `true` if you want to keep everything previously painted in history |      | x                            |

#### Example

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

      // OR with initial values --------------

      // create instance
      const paintable = new Paintable({
        // used to identify the paintable
        scope: 'a-unique-identifier',
        // set the canvas element
        canvas: document.querySelector('#canvas'),
        color: '#000000',
        active: true
        accuracy: 6
      });
    </script>
  </body>
</html>
```

### Overwrite methods

You can simply overwrite methods of the paintable, if you want.
Some methods you may want to override: `moveEvent`, `startEvent` and `stopEvent`

```javascript
const paintable = new Paintable();

// the old event
const moveEvent = paintable.moveEvent;

// overwrite it
paintable.moveEvent = function () {
  // call old event to ensure functionality
  moveEvent.apply(this, arguments);

  // your code
};
```

### Development

```bash
npm run install
npm run serve
```
