# JACsPOT Stage 1 video sequence

All clips are H.264, 1920x960, 60fps, silent.

Playback order:

1. `jackspot_stage1_01_start.mp4` (2 seconds)
2. `jackspot_stage1_02_loop.mp4` (3 seconds, repeat indefinitely)
3. Play exactly one result clip when the lottery result is ready:
   - `jackspot_stage1_03_stop_200.mp4`
   - `jackspot_stage1_03_stop_500.mp4`
   - `jackspot_stage1_03_stop_750.mp4`
   - `jackspot_stage1_03_stop_next.mp4`

The start clip ends at the loop phase. The loop clip contains four complete
orbits and returns to its initial phase. Every stop clip begins at the same
loop phase, decelerates, and brings the selected panel to the center.

These are production assets only. They are not currently connected to the game.
