# Veneta promo video

`python3 videos/build.py` → `veneta-promo.mp4` (EN voiceover, burned-in Vietnamese subtitles) + `veneta-promo.vi.srt`.

- Copy/scenes: edit `SCENES` in `build.py`. Scene length follows the voiceover.
- Needs: ffmpeg, Microsoft Edge (headless screenshots), macOS `say` (draft voice — replace audio with a real voiceover for final).
- Intentionally no calendar dates / deadlines / return promises. Disclaimer on end card; law firm to finalize wording.
- `build/` is scratch output (gitignored). MP4 is ~29 MB — decide whether to commit or host elsewhere.
