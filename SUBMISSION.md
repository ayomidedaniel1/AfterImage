# Afterimage — submission copy and release instructions

## Project description

Afterimage is a seated spatial-memory game. Study a diamond, cube and pyramid hanging at different depths. When they disappear, pinch the matching pieces and rebuild the constellation from memory. Check your work to see where each piece belonged and how far your hand placed it from its target. Three constellations make one game.

**Inspiration.** How much of a pattern can you still see after it disappears? Moving the puzzle into arm's reach makes depth part of the memory. A shape can look right from the front and still sit too close or too far away. The reveal makes that difference visible.

**How it was built.** JavaScript and Meta Immersive Web SDK 1.1.0 handle the WebXR session, scene and one-hand grabs. The shapes and outlines use the SDK's Three.js implementation. Every target is authored in meters relative to the same stationary board. Accuracy falls linearly to zero at 15 cm of error. The game averages the three shapes, then averages the three rounded round scores. Vite produces the static site. Node tests check scoring and transitions, and Playwright drives Meta IWER for browser-based hand simulation.

**Plans.** Test on physical Quest headsets with seated players, measure frame rate, and use those results to tune reach, text size and placement tolerance.

**Target public launch date:** [ENTRANT TO SUPPLY BEFORE SUBMISSION]. The competition deadline is a separate date.

**Verification disclosure.** The three-round loop and replay were tested in IWER with its Quest 3 profile. The video and screenshots are emulator captures using scripted hand input. Physical Quest operation, native permission prompts, headset comfort and frame rate remain unverified. The SDK fetches its hand visuals from a CDN.

## Judge instructions

1. Open **[PUBLIC HTTPS PLAY URL]** in Quest Browser, seated and facing forward. Enable hand tracking, set controllers aside, select **Enter VR** and allow the session. A desktop browser without immersive VR shows a preview.
2. Pinch the gold diamond, move it into the outline and open your fingers. Round one starts. Study all three shapes during the five-second countdown.
3. Rebuild the pattern from the tray. Release each shape to leave it suspended. Pinch **Check** below the frame. The outlines show the correct locations and the lines connect each placement to its own target.
4. Release the pinch, then pinch **Next**. Finish three rounds to see final accuracy. Pinch **Play again** for a fresh tutorial. Use the browser's system control to exit VR.

## Candidate and build

The preserved site is `release/rc-85a9e24/afterimage-site.zip`. Its root contains index.html, assets/ and the license notices. Only this ZIP's contents belong on the game host. Keep the source, verification records and media separately. STATUS.md identifies the source and checksums.

To reproduce locally on the established Windows toolchain, run from the project root:

```powershell
npm.cmd ci --ignore-scripts
node --test game.test.js
npm.cmd run build
node smoke.mjs
npm.cmd run preview
```

Node 24.18.0 and npm 11.6.4 were used. The smoke test needs installed Edge and Git for Windows OpenSSL, or OPENSSL_BIN pointing to OpenSSL. It serves dist/ over private HTTPS and injects IWER only into the test browser. Open the URL printed by preview for desktop inspection. Stop preview with Ctrl+C.

## Recording and screenshot checklist

Use the labeled files under `release/rc-85a9e24/media/`. The local demo is silent; English prompts and scores are visible in the scene. Suggested short recording sequence:

1. Introduce Afterimage with the on-screen simulator label. Show the tutorial pinch, move and release.
2. Hold on the three shapes long enough to see their depth. Show the countdown ending and the tray appearing.
3. Move the pieces by hand. Leave a visible offset on one shape, pinch Check and hold on the connecting lines and score.
4. Show progression through the remaining rounds, final accuracy and Play again. Keep the public cut under three minutes and retain the simulator label.

Match the five stills to these visible states before adding them to the entry:

| File | Expected visible content |
| --- | --- |
| 01-tutorial-iwer.png | One gold diamond, outlined destination and tutorial instruction |
| 02-observe-iwer.png | Three solid targets and the round countdown |
| 03-rebuild-iwer.png | Three tray pieces, rebuild instruction and Check |
| 04-reveal-iwer.png | Placements, target outlines, connecting lines, round score and Next |
| 05-results-iwer.png | Final average and Play again |

## Ordered entrant checklist

1. Confirm the representative's Start membership, Meta developer access, Devpost registration, eligibility under section 2, entry limit, originality, rights and funding restrictions. The entrant confirmed a fresh project conceived and built within the competition window. Proposed selections are **Gaming** and **New Experience**; the organizer determines eligibility. [Official rules](https://start-developer-competition-26.devpost.com/rules)
2. Supply the target public launch date above. Review the project copy and testing disclosure. The official close is **November 18, 2026 at noon PST (21:00 Lagos)**. [Competition page](https://start-developer-competition-26.devpost.com/)
3. After explicit publication authorization, extract afterimage-site.zip into an empty folder. For the GitHub Pages route, use a new entrant-controlled public, artifact-only repository. Upload index.html, assets/ and both license files at its root, preserving paths. Create an empty .nojekyll at the root and commit. In **Settings → Pages**, choose **Deploy from a branch**, the artifact branch and **/(root)**, then save. Wait for the Pages deployment to finish and copy the live HTTPS site URL from Settings. The rules allow alternative hosting and also mention a GitHub page in the form instructions; Pages satisfies both wordings. [GitHub Pages instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [Rules §4](https://start-developer-competition-26.devpost.com/rules)
4. Open that HTTPS URL signed out on a separate device. Confirm the page title and preview, load the entry asset listed in STATUS.md directly from the hosted assets/ path and confirm both license URLs resolve. On a Quest, follow the judge instructions if hardware becomes available. Paste the live site URL into the judge instructions and entry. Keep free access available through the actual winner announcement, expected around December 11. Freeze this artifact at the deadline. [Official rules](https://start-developer-competition-26.devpost.com/rules)
5. Watch the local afterimage-iwer-demo.webm. After explicit authorization, upload it to YouTube or Vimeo, choose **Public**, retain the simulator disclosure and wait for processing. Open the watch URL signed out, verify playback and duration, and copy the URL. Screenshots supplement the required video. [Official rules](https://start-developer-competition-26.devpost.com/rules)
6. The eligible entrant or authorized team representative signs into Devpost, joins the competition, opens **Enter a Submission**, completes all required form fields, selects track/division, and supplies the play URL, public video URL, English project text, testing steps and launch date. Preview the links and media. Use the actual submit action before the deadline. Check the dashboard for submitted status and retain the project URL, confirmation and timestamp. A saved draft is insufficient. [Contest registration and entry](https://start-developer-competition-26.devpost.com/) · [Official rules §§2–4](https://start-developer-competition-26.devpost.com/rules)

**Evidence boundary.** The rules describe a 60 fps Quest hardware criterion. This candidate has no headset performance measurement. The README's original time estimate, a successful local build and possession of a Devpost account establish neither a public deployment nor entrant eligibility. Simulator equivalence ultimately rests with the organizer. No public upload or submission confirmation has been recorded.
