# Sticki Rolls Comic Con reward pass

Buildless, responsive GitHub Pages website using the official Sticki Rolls logo and Knicknack Bold font. Run `node server.cjs` and open http://127.0.0.1:4173 to preview.

## Reward rules (initial assumption)

Each of the six primary social links earns one spin, once per browser. Visiting all six unlocks a bracelet. Facebook is a bonus link and does not count. Confirm these event rules before launch. The pass displays earned rewards for booth staff; it does not implement redemption or inventory management.

Progress uses localStorage under `sticki-comic-con-2026-v1`, with validated link IDs and synchronization between tabs. Repeated clicks do not increase the total. No personal information or analytics are sent to a server. Clearing browser storage, switching browsers, or switching devices starts a fresh pass. Link visits do not verify follows; this is not a fraud-resistant redemption system.

## Publish to GitHub Pages

1. Push this folder to the intended GitHub repository.
2. In repository Settings → Pages, select Deploy from a branch, then the published branch and `/ (root)`.
3. Use the resulting HTTPS URL for the booth QR code.

All assets use relative paths, so repository subpath hosting works. No build or dependencies required. Do not publish the local preview server as an application server; GitHub Pages serves the static files.

## Brand assets

Logo: https://stickirolls.com/wp-content/uploads/2025/10/Sticky-roll-logo.webp

Font: https://stickirolls.com/wp-content/uploads/2025/09/Knicknack-Bold.woff

Brand assets belong to their respective owners and are included for this requested brand page.

