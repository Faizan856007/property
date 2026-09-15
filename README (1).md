# images/

Folders reserved for site media when you self-host assets:

- `images/properties/` — property photographs (one folder per listing, e.g. `pn-101-1.jpg`)
- `images/locations/` — city and locality photographs
- `images/team/` — advisor portraits

## Current setup

The shipped build streams optimised photographs from a CDN (`images.pexels.com`)
through the `P.img(id, width, height)` helper in **`js/properties.js`**. This keeps the
repository light and the pages fast on GitHub Pages.

## Switching to self-hosted images

1. Drop your files into the folders above.
2. Replace the `P.img()` body with a path helper, for example:

```js
P.img = function (file, w, h) {
  return "images/properties/" + file + (w ? ".jpg" : "");
};
```

3. Swap the numeric ids in `P.PROPERTIES[n].images` for your file names.

Use `width="..."`/`loading="lazy"` attributes (already present) and keep photos under
250 KB for best performance.
