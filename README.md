# p5.visions

A personal collection of daily creative coding sketches built with [p5.js](https://p5js.org/). This repository serves as a practice space to track my progress over time.

## structure

- `index.html` – Base HTML file that loads p5.js and the current sketch.
- `sketch.js` – Main p5.js sketch for the day.
- `libs/` – Local copies of `p5.min.js` and `p5.sound.min.js` for offline use.
- `save-today.ps1` – Script to save the current sketch with a date-based filename.
- `archive/` – _(Optional)_ Folder for storing past sketches.

## running the sketches

1. Clone the repository:

   ```bash
   git clone https://github.com/9000fm/p5.js.git
   cd p5.js
   ```

2. Open `index.html` in your browser directly,  
   or use a local server such as the **Live Server** extension in VS Code.

## daily workflow

1. Edit or create your sketch in `sketch.js`.
2. Preview it in your browser.
3. Save a dated copy to the archive if needed.
4. Commit and push changes:
   ```bash
   git add .
   git commit -m "New sketch YYYYMMDD"
   git push
   ```

## license

This project is for educational and personal creative use.  
You may fork it and experiment freely.
