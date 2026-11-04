# ARA Greenfield — four-page website

A self-contained HTML/CSS/JavaScript implementation, based on the supplied Stitch direction. No dependency install is required. Original exports remain in `design-reference/`; the working website is in `public/`.

## Run

With Node.js installed, open a terminal in this folder and run:

    npm run dev

Open http://localhost:3000. To prepare hosting files run `npm run build`; upload the contents of `dist/` to your static host. Do not host the entire source folder, which also contains the uncorrected reference export.

## Add your two hero videos

Place your own files here (exact spelling):

- `public/media/hero-video-1.mp4`
- `public/media/hero-video-2.mp4`
- Optional replacement poster: `public/media/hero-poster.jpg`

The two videos alternate continuously with a one-second opacity transition. Do not add the `loop` attribute to either video: the JavaScript manages the sequence. Use landscape H.264 MP4 files of similar dimensions/lighting. Prefer short 8–20 second clips with no embedded text. The hero starts muted; a pause control is provided. Reduced-motion visitors see the poster until they explicitly choose playback. If autoplay is blocked, the play button allows a manual start. If a file is unavailable, the other is used; if both are unavailable, the photo remains. Video focal positioning is in `.hero-film` in `public/styles.css`.

The page currently falls back to your silo photograph. Your two existing operational videos are included separately, with controls. They are not substituted for the hero footage.

## Editing

- `public/index.html`: Home
- `public/about.html`: About / leadership / partners
- `public/commodities.html`: portfolio / AirSmat / pharmaceuticals / precious metals / operations
- `public/contact.html`: enquiry form
- `public/styles.css`: shared desktop/mobile styles
- `public/app.js`: navigation, video sequence, galleries, filters, form submission and reveals
- `public/media/asset-map.json`: mapping from uploaded image filenames to optimised WebP files
- `public/documents/`: AirSmat brochure

Typography uses Google Fonts with local system fallbacks. Layout and interactions do not depend on a CSS CDN.

## Content and remaining confirmations

- Crippen, Impact Grains and AirSmat are included as supplied by the owner. Add other confirmed partners when available.
- Leadership biographies follow the original user-supplied HTML. Initials are used until portrait identities are confirmed. The unassigned portrait and optional photos are retained in media but not assigned to a person or role.
- No invented moisture specifications, origin regions, certifications, ownership claims, turnaround guarantees or regulatory endorsements from the Stitch export are carried into the working site.
- BROWN is attributed to AirSmat. The designed BROWN panel is typography, not a reproduction of product packaging. The manufacturer brochure is included.
- Rice imagery is a supplied photograph of a third-party branded product; it is not relabelled as an ARA product. Crop photography is not invented for products without supplied photographs.
- The email displayed throughout and used by mailto is Alfred@aragreenfieldng.com, following the original displayed address. The old HTML linked to a different email: owner should confirm the intended mailbox before launch.
- Existing Formspree endpoint retained: https://formspree.io/f/xojzkarr. Its ownership, activation and email delivery must be verified by the owner. Browser checks do not send live enquiries. Success is shown only for a real successful response; failures preserve inputs.
- Operational video audio is retained. Add reviewed captions/transcripts if speech needs to be accessible before public launch.

## AI Studio handoff

Import this project as the implementation source. Preserve the four HTML pages, media filenames, supplied company copy and hero video sequence. If converting to React, retain the behaviour of `app.js`, use shared header/footer components, and keep the `public/media/` URLs stable. Do not restore unsupported claims from `design-reference/`.
