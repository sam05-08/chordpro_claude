

**Project:** ChordPro  
**Type:** Music Management & Practice Application  
**Status:** Active Development  
**Primary Language:** Portuguese (Brazil)  
**Document Purpose:** Project specification, development guidelines and product requirements.

---

# 1. PROJECT OVERVIEW

ChordPro is a complete music application designed to help musicians organize, read, study, practice and perform music.

The application combines:
- Music and chord library.
- Chord sheet visualization.
- Music theory tools.
- Instrument tuning.
- Metronome.
- Personal audio recording.
- Sheet music visualization.
- File importing and conversion.
- Video integration.
- Music practice statistics.

ChordPro must be developed as a polished, reliable and scalable product.

It must not become a collection of disconnected tools. All features must work together within one consistent experience.

# 2. PRODUCT PRINCIPLES

Every development decision must follow these principles:

1. Functionality comes before visual decoration.
2. Existing working features must be preserved.
3. The interface must remain simple and intuitive.
4. All controls must perform their advertised actions.
5. Data must be saved reliably.
6. Performance must remain smooth.
7. The application must work on mobile, tablet and desktop.
8. New features must integrate naturally with the existing application.
9. Visual consistency must be maintained.
10. No feature should be considered complete merely because its interface exists.

# 3. YES — WHAT TO DO

## 3.1 Design and interface

- Use a premium, modern and professional visual identity.
- Maintain a dark interface as the primary appearance.
- Use black, graphite and dark navy tones.
- Use blue as the primary accent color.
- Use clean and readable typography.
- Apply subtle animations and transitions.
- Use blur and transparency when they improve the experience.
- Maintain visual hierarchy and appropriate spacing.
- Make controls easy to access.
- Ensure responsive layouts.
- Respect the user's appearance preferences.
- Preserve existing customization options.

## 3.2 Application navigation

The application must include:

- Library.
- Favorites.
- Profile.
- Settings.
- Search.

Navigation must remain consistent across the application.

## 3.3 Music library

The library must support:

- Creating music entries.
- Editing music entries.
- Deleting music entries.
- Displaying music titles.
- Displaying artists.
- Displaying cover images.
- Displaying original keys.
- Marking favorites.
- Searching by title and artist.
- Sorting and filtering.
- Organizing music into categories.
- Accessing music sheets quickly.

## 3.4 Music viewer

The music viewer must support:

- Displaying lyrics.
- Displaying chords in the correct positions.
- Highlighting chords visually.
- Transposing music.
- Automatic scrolling.
- Adjustable scrolling speed.
- Video integration.
- Favorite controls.
- Chord diagrams.
- Different chord voicings.
- Comfortable reading on mobile devices.

## 3.5 Chord diagrams

This functionality is already implemented and must be preserved.

Requirements:

- Clicking a chord opens its diagram.
- Display available chord positions.
- Display chord variations.
- Show finger positions clearly.
- Maintain accurate chord diagrams.

Future improvements must not break existing chord interactions.

## 3.6 Musical tools

The application must include the following tools:

### Tuner

- Access the device microphone with permission.
- Detect the played musical note.
- Display the detected frequency.
- Indicate whether the note is sharp or flat.
- Show the distance from the target pitch.
- Support chromatic tuning.
- Provide a clear and responsive interface.

### Metronome

- Adjustable BPM.
- Start and pause controls.
- Configurable time signature.
- First-beat accent.
- Different metronome sounds.
- Accurate timing.
- Responsive visual beat indication.

### Personal recording

- Record audio through the microphone.
- Request recording permission.
- Start and stop recording.
- Play recordings.
- Save recordings.
- Rename recordings.
- Delete recordings.
- Associate recordings with songs.
- Provide a recording history.

### Sheet music

- Display musical notation.
- Support sheet music files.
- Allow zooming.
- Allow navigation through pages.
- Support synchronized viewing with chord sheets.
- Maintain readable notation.

## 3.7 File importing

Supported formats:

- TXT.
- PDF.
- Manually entered text.

The import system must:

1. Read the uploaded file.
2. Extract its content.
3. Identify the title and artist when available.
4. Detect chords.
5. Identify verses and choruses.
6. Organize the content.
7. Display a preview.
8. Allow manual corrections.
9. Save the resulting music in the library.

The original file must not be silently discarded.

## 3.8 Video player

The video player must support:

- Playing related videos.
- Minimizing the video.
- Expanding the video.
- Repositioning the floating player.
- Maintaining video playback when possible.
- Avoiding obstruction of important music content.

## 3.9 Profile and statistics

The profile must display:

- User information.
- Profile picture.
- Total number of songs.
- Practiced songs.
- Practice history.
- Usage statistics.

Future improvements may include:

- Total practice time.
- Practice frequency.
- Most practiced songs.
- Personal recordings.
- Progress tracking.

All statistics must be based on actual stored data.

## 3.10 Settings

Settings must support:

- Appearance preferences.
- Accent color customization.
- Background customization.
- Text size.
- Chord display preferences.
- Scrolling preferences.
- Gesture preferences.
- Audio preferences.
- Tuner preferences.
- Metronome preferences.

User preferences must persist between sessions.

# 4. NO — WHAT NOT TO DO

## 4.1 Design restrictions

- DO NOT redesign the entire application without authorization.
- DO NOT replace the existing visual identity.
- DO NOT introduce random colors.
- DO NOT use excessive gradients.
- DO NOT overuse glassmorphism.
- DO NOT add unnecessary decorative elements.
- DO NOT make the interface visually crowded.
- DO NOT use oversized typography unnecessarily.
- DO NOT introduce inconsistent icons.
- DO NOT change the user's existing corner-radius preferences.
- DO NOT remove existing animations without a reason.

## 4.2 Functionality restrictions

- DO NOT remove working features.
- DO NOT replace functional features with mockups.
- DO NOT create buttons without actions.
- DO NOT use fake statistics.
- DO NOT simulate audio functionality.
- DO NOT save recordings only temporarily.
- DO NOT lose user data during updates.
- DO NOT break existing music entries.
- DO NOT change chord transposition logic without testing it.
- DO NOT disable existing customization settings.
- DO NOT introduce duplicate functionality unnecessarily.

## 4.3 Development restrictions

- DO NOT rewrite entire components when a small modification is sufficient.
- DO NOT modify unrelated files.
- DO NOT introduce unnecessary dependencies.
- DO NOT duplicate existing systems.
- DO NOT hardcode user-specific information.
- DO NOT expose private user data.
- DO NOT ignore error handling.
- DO NOT assume microphone access is always available.
- DO NOT claim that an operation succeeded before confirming it.
- DO NOT compromise performance for unnecessary visual effects.

## 4.4 Data restrictions

- DO NOT delete user data without explicit authorization.
- DO NOT overwrite existing music unintentionally.
- DO NOT lose recordings.
- DO NOT reset user preferences during updates.
- DO NOT create inconsistent database records.
- DO NOT store important information only in temporary browser state.

# 5. OFFICIAL DEVELOPMENT ROADMAP

The following order must be respected.

### Priority 1 — Tuner and Metronome
Implement both musical tools with real functionality, accurate behavior and complete interfaces.

### Priority 2 — Personal Recording
Implement audio recording, playback, saving and organization.

### Priority 3 — Synchronized Sheet Music
Create sheet music visualization and integration with chord sheets.

### Priority 4 — TXT and PDF Import
Implement file importing, content extraction, automatic chord recognition and structured conversion.

### Priority 5 — Automatic Control Hiding
Hide unnecessary controls while the user scrolls through a music sheet and restore them when needed.

### Priority 6 — Repositionable Video
Allow the video player to be minimized, dragged, repositioned and expanded.

The order above is intentional and must not be changed without authorization.

# 6. FUTURE EXPANSIONS

After completing the official roadmap, consider:

- Custom setlists.
- Rehearsal playlists.
- Practice history.
- Advanced music statistics.
- Additional chord information.
- Capo support.
- More advanced transposition.
- Offline access.
- Cloud synchronization.
- Music sharing.
- Additional instrument support.
- Improved music organization.

These are future possibilities, not requirements to implement immediately.

# 7. TECHNICAL REQUIREMENTS

## Architecture

The application should have clearly separated systems for:

- User interface.
- Application logic.
- Authentication.
- Database.
- File storage.
- Audio processing.
- Music processing.
- Import and conversion.
- User preferences.

## Data persistence

All important information must be stored persistently.

This includes:

- Music entries.
- Lyrics and chords.
- Favorites.
- User preferences.
- Recordings.
- Imported files.
- Practice history.
- Statistics.

## Compatibility

The application must support:

- Desktop browsers.
- Mobile browsers.
- Tablet layouts.
- Touch interactions.
- Keyboard interactions where appropriate.

Audio and microphone functionality must respect browser permissions and platform limitations.

# 8. PERFORMANCE REQUIREMENTS

- Fast initial loading.
- Smooth scrolling.
- Responsive controls.
- Optimized images.
- Efficient database queries.
- Minimal unnecessary re-rendering.
- No unnecessary background processing.
- Stable audio playback.
- Efficient file handling.

The application must remain usable on ordinary devices.

# 9. SECURITY AND PRIVACY

- Request permissions only when necessary.
- Protect user recordings.
- Protect personal information.
- Validate imported files.
- Handle unsupported files safely.
- Restrict access to private user data.
- Never expose credentials or secret keys in frontend code.
- Follow secure authentication practices.

# 10. QUALITY ASSURANCE

Before considering any feature complete, verify:

- Does it work?
- Does it save data correctly?
- Does it work on mobile?
- Does it work on desktop?
- Does it respect existing settings?
- Does it handle errors?
- Does it preserve existing functionality?
- Does it match the application's visual identity?
- Does it perform efficiently?

A feature is complete only when it has been tested successfully.

# 11. DEVELOPMENT WORKFLOW

For every new feature:

1. Inspect the existing implementation.
2. Identify components and systems affected.
3. Understand existing behavior.
4. Plan the smallest safe modification.
5. Implement the feature.
6. Test its functionality.
7. Test compatibility with existing features.
8. Verify responsiveness.
9. Fix regressions.
10. Confirm completion.

Do not begin large-scale modifications without understanding the existing project.

# 12. FINAL PRODUCT VISION

ChordPro must become a complete, reliable and elegant musical workspace.

Its purpose is to bring music organization, chord sheets, musical tools, recording and practice into one coherent application.

Every feature must contribute to this purpose.

**The most important rule: Improve ChordPro without destroying what already makes it work.**