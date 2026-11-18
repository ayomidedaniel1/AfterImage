# Coding Agent Instructions — Afterimage

## Mission

Build and help prepare a submission for Afterimage, a small hands-first
spatial-memory VR game for Meta Quest.

Read README.md for the product specification.

The project has an urgent competition deadline. Optimize for:

1. Working delivery path.
2. Complete hands-only gameplay.
3. Reliability and comfort.
4. Submission readiness.
5. Visual polish.

Do not optimize for architectural sophistication or feature count.

## First actions

Before writing application code:

1. Read README.md and any existing STATUS.md.
2. Inspect repository contents and git status.
3. Identify the engine/framework, dependency versions, and build commands.
4. Check available tooling without destructive changes.
5. Determine whether the repository contains an existing application.
6. Ask the entrant for:
   - Actual time remaining and live deadline.
   - Quest model and whether hardware testing is available.
   - Whether this is a fresh project or an older codebase.
   - Existing working toolchain, if repository inspection does not establish it.
7. Create or update STATUS.md.
8. Propose the fastest viable implementation path and begin reversible work.

Do not block all progress waiting for answers.
Inspect files and prepare safe scaffolding while awaiting essential information.

Do not assume this repository already contains working code.

## Deadline discipline

Reserve at least 45 minutes for build processing, capture, upload, and submission
when the remaining schedule allows.

At each milestone:

- State what works.
- State what has actually been tested.
- State the biggest remaining risk.
- Update STATUS.md.
- Recalculate the remaining work.

When time is short:

- Remove optional features.
- Preserve the complete gameplay loop.
- Prioritize launch, hand input, scoring, replay, and delivery.
- Do not begin a framework migration.

If a platform blocker persists for approximately 10–15 minutes:

- Report the exact blocker.
- Propose a concrete fallback.
- Do not silently burn the entire deadline on setup.

## Source of truth

Use this order:

1. Official competition requirements supplied or verified by the entrant.
2. Actual repository and installed dependency APIs.
3. README.md.
4. Your assumptions.

Flag conflicts rather than silently resolving eligibility questions.

You cannot certify competition eligibility or promise a prize.

## Tooling and API rules

- Inspect installed packages and relevant documentation.
- Use actual APIs from the installed versions.
- Do not invent SDK classes, methods, prefab names, or configuration fields.
- Prefer established hand-interaction components over custom gesture detection.
- Avoid dependency upgrades unless required to resolve a concrete blocker.
- Preserve lockfiles.
- Do not replace the entire project because another stack is more familiar.

If internet access is unavailable:

- Inspect local package source and examples.
- Label uncertain API assumptions.
- Do not present guessed integrations as tested.

For a native stack:

- Verify Android/Quest build support early
- Build and deploy a minimal application before implementing all gameplay.
- Verify the required permissions and hand-tracking configuration.
- Use the installed SDK's supported interaction setup.
- Confirm the actual APK output path and upload requirements.

For IWSDK/WebXR:

- Verify immersive session support and hand input.
- Deploy over HTTPS early.
- Test in Quest Browser, not just a desktop browser.
- Handle unsupported sessions with a clear message.
- Do not treat mouse/controller fallback as satisfying hands-first requirements.

## Implementation strategy

Build the smallest complete vertical slice first:

1. Display the puzzle frame.
2. Grab and release one star using hands.
3. Activate one button using hands.
4. Show one target position.
5. Hide the target.
6. Submit a placement.
7. Display a score.
8. Restart cleanly.

Then expand to:

- Tutorial.
- Three stars with distinct identities.
- Three authored rounds.
- Target outlines and error lines.
- Results and replay.

Use simple, understandable components. A reasonable separation is:

- Game/session state.
- Constellation data.
- Star interaction.
- Scoring.
- Presentation/UI.

Adapt this structure to the actual engine rather than creating unnecessary layers.

## Interaction requirements

- Essential application actions must work without controllers.
- Prefer standard SDK grab and button interactions.
- Stars must remain suspended after release.
- Prevent interaction during observation and reveal.
- Prevent duplicate Check/Next events.
- Clear held-object state safely on transitions.
- Restore out-of-bounds stars to their tray.
- Reset all transient state on replay.

Avoid buttons activating unintentionally immediately after releasing a star.

## Coordinate and scoring requirements

- Store constellation positions relative to the puzzle root.
- Compare placed positions and targets in the same coordinate space.
- Keep the puzzle root at unit scale, or explicitly account for scale so scoring
  distances remain in meters.
- Match each star to its own target by stable identity.
- Never match to the nearest target as a shortcut.
- Keep scoring independent of frame rate.
- Clamp scores to the documented range.
- Do not allow checking a round more than once.

Where supported, add small automated tests for:

- Exact placement returns full accuracy.
- Error at or beyond tolerance returns zero.
- Intermediate distances produce expected scores.
- Identity matching remains correct.
- Session averages are correct.

## Comfort and accessibility

- Keep the board stable, not continuously head-locked.
- Keep interactions within comfortable seated reach.
- Do not animate the player's camera.
- Use readable text and high contrast.
- Distinguish stars by shape or symbol as well as color.
- Never communicate essential state through sound alone.
- Make instructions short and actionable.

A reset/reposition control is preferable to forcing the player to physically
move their chair to reach the board.

## Performance

- Use simple geometry and materials.
- Avoid unnecessary real-time shadows and post-processing.
- Avoid per-frame allocations where practical.
- Reuse the small set of gameplay objects.
- Do not introduce a heavy optimization framework for a tiny scene.

The supplied competition criterion is a minimum of 60 fps on Meta Quest.
Aim to sustain the configured headset refresh rate.

Only report measured performance, naming:

- Device.
- Build.
- Measurement method.
- Observed result.

Desktop/editor performance is not evidence of Quest performance.

## Scope exclusions

Do not add:

- Multiplayer.
- AI services.
- Authentication.
- Backend infrastructure.
- Voice recognition.
- Custom gesture systems.
- Procedural generation.
- Persistent anchors.
- Decorative passthrough.
- Large progression systems.

Optional additions are allowed only after the core loop and delivery path work:

- Local best score.
- Simple sound cues.
- Brief reveal animation.
- Small visual refinements.

Do not turn optional features into submission blockers.

## Testing honesty

Distinguish these outcomes:

- Code written.
- Static checks passed.
- Build succeeded.
- Application launched.
- Interaction tested in simulator.
- Interaction tested on Quest.
- Performance measured on Quest.

Never claim one implies the others.

If hardware is unavailable:

- Prepare a precise manual test checklist.
- Ask the entrant to execute it.
- Mark hardware
  testing and performance as UNVERIFIED until results are available.

Do not fabricate test results, screenshots, recordings, upload confirmations,
release-channel access, or submission status.

## Repository safety

- Inspect git status before editing.
- Preserve unrelated user changes.
- Do not delete or overwrite existing work without a clear reason and approval.
- Avoid destructive git commands.
- Do not commit credentials, signing keys, tokens, or private account information.
- Use environment variables or ignored local configuration for secrets.
- Record required configuration names, never secret values.
- Do not install untrusted scripts or run unexplained remote shell commands.
- Ask before purchases, public publishing, or account-level changes.
- Only submit or publish after explicit entrant authorization.

If git is available, create focused commits when authorized.
Otherwise, record the files changed and their purpose in STATUS.md.

## Competition and submission integrity

The competition details in README.md are an inherited planning summary,
not independently verified official rules.

Before relying on them:

- Ask for the official rules or their URL.
- Verify deadline, eligibility, delivery route, and required materials.
- Flag anything that cannot be verified.
- Do not invent requirements or claim that verification occurred.

Do not:

- Claim SDK integrations that are not implemented.
- Claim hardware support that has not been tested.
- Present simulated interactions as real hand-tracking footage.
- Label simulator footage as headset capture.
- Invent a launch date.
- Assume an old codebase qualifies for a new-project division.
- Guarantee eligibility, acceptance, or a prize.

Keep submission descriptions consistent with the actual final build.

## Required handoff: STATUS.md

Create STATUS.md early and keep it concise.

Use this structure:

# Afterimage — Status

## Last updated

- Date/time and timezone:
- Current branch/revision, if available:
- Deadline and source:
- Remaining time, if known:

## Environment

- Engine/framework:
- Versions:
- Target device:
- Hardware access:
- Deployment route:

## What works

List implemented features and the evidence for each.

## Verification

- Static checks:
- Automated tests:
- Build:
- Simulator:
- Quest hardware:
- Performance:

Use PASS, FAIL, NOT RUN, or UNVERIFIED.
Include exact commands and relevant results.

## How to run

Exact commands or editor steps.
Include necessary configuration without secrets.

## How to build/deploy

Exact commands or UI steps.
Name the output location and required manual actions.

## Known issues

Prioritize blockers before cosmetic issues.

## Next three actions

1.
2.
3.

## Decisions and assumptions

Record decisions that another agent must not unknowingly reverse.

## Submission status

- Build/link:
- Video:
- Description:
- Judge access:
- Submitted:
- Evidence of submission:

## Changed files

Brief summary of recent changes.

## Agent communication

Keep progress reports short and concrete:

### Completed

What changed.

### Verified

What was actually run or tested.

### Blocked / unverified

What still needs hardware, credentials, documentation, or entrant action.

### Next

The next one to three actions.

Do not repeatedly ask the entrant to choose low-level implementation details.
Make reversible technical decisions and document them.

Ask questions when the answer affects:

- Eligibility.
- Public publishing.
- Destructive changes.
- Major stack choice.
- Hardware-dependent claims.
- Deadline feasibility.

## Context exhaustion / agent handoff

Before stopping or nearing a context limit:

1. Save all work.
2. Update STATUS.md.
3. Record exact run/build commands.
4. Record blockers and relevant error messages.
5. List the next three concrete actions.
6. State whether any process is still running.
7. Identify any unfinished or partially edited files.

A replacement agent should be able to continue from repository files alone.

## Definition of completion

The project is not complete merely because code compiles.

Completion requires:

- A functioning end-to-end gameplay loop.
- Verified hands-only operation, or clearly disclosed verification gaps.
- A reproducible build/deployment path.
- Truthful testing and submission materials.
- Entrant confirmation of final publishing/submission.

When the deadline prevents further work, preserve the best working build,
document limitations, and prioritize an honest, accessible submission over additional features.
