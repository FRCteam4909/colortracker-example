/*
 * Example of using the tracking.js library with NodeJS rather than in the
 * browser.
 *
 * Author: Derrell Lipman
 *
 * License: MIT
 */


// tracking.js assumes it's running in a browser environment, where the global
// object is called `window`. In NodeJS, however, the global object is called
// `global`. Since `window` does not exist in NodeJS, simply equate it to
// `global`.
window = global;

// `navigator` is used in some of the GUI-oriented code in tracking.js. For
// NodeJS use, it's not necessary, but must be defined. We'll just make it an
// empty map.
window.navigator = {};

// Now, finally, we can require tracking.js
require("tracking");

// Also require linuxcam which will give us access to Video4Linux cameras.
let cam = require("linuxcam");

// We'll use the built-in ColorTracker, and specifically, its built-in tracker
// of yellow objects.
let colors = new tracking.ColorTracker( [ "yellow" ]);

// Soon, we'll be feeding camera frames into the tracker. Following the
// processing of each frame, the tracker will emit a "track" event. The event
// will have a `data` member, which will be an array of maps. Each map
// represents a rectangle and contains members `width`, `height`, `x`, `y`,
// and `color`.
//
// Begin awaiting "track" events
colors.on(
  "track",
  (e) =>
    {
      // We received  "track" event. See if there are any yellow rectangles
      if (e.data.length === 0)
      {
        // Nope. See ya!
        return;
      }

      // For each rectangle...
      e.data.forEach(
        (rect) =>
        {
          // ... show its attributes.
          console.log("Rectangle: ", rect);
        });

      // Separate this log output from the next one
      console.log("--");
    });

// All right! Now that we've arranged to receive "track" events, prepare to
// read images from the camera. We provide the Video4Linux device to read
// from, and the width and height of the frames we want to receive.
cam.start("/dev/video0", 320, 240);

//Now we can start looping, reading a frame periodically.
setInterval(
  () =>
    {
      let             i;
      let             rgb;
      let             rgba;
      let             frame;
      
      // Obtain the current frame, and metadata. We are given a map with three
      // members: `data`, a Buffer; `width` and `height`, which should be the
      // same values we provided to `cam.start()`.
      frame = cam.frame();

      // The frame data in the Buffer is RGB, i.e., three bytes per pixel,
      // representing respectively, the red, green, and blue components of
      // that pixel. The Buffer is therefore of length (3 * width * height).
      // Convert the buffer to a Uint8ClampedArray. This type of array simply
      // ensures that every value in the array is an unsigned integer in the
      // range [0,255].
      rgb = new Uint8ClampedArray(frame.data);

      // The color tracker expects its array to contain RGBA data, i.e., four
      // bytes per pixel, representing respectively, the red, green, and blue
      // components of that pixel, plus that pixel's "alpha" value. "Alpha" is
      // the inverse of transparency, so an alpha value of 255 means the pixel
      // is opaque and does not show anything below it; 0 would mean that the
      // pixel is completely transparent, so would not cover whatever is
      // "below" it at all. In our case, we're assuming that our whole image
      // is completely opaque, so every pixel's alpha value should be
      // 255. We'll produce a new array, using the red, green, and blue values
      // from the original rgb array, and append an alpha value of 255 for
      // that pixel.
      rgba = [];
      for (i = 0; i < rgb.length; i += 3)
      {
        let             pixel;

        // Get this pixel's red, green, and blue values
        pixel = rgb.slice(i, i + 3);

        // Add those pixels to the rgba array
        Array.prototype.push.apply(rgba, pixel);

        // Now append the alpha value
        rgba.push(255);
      }

      colors.track(rgba, frame.width, frame.height);
    },
  1000);
