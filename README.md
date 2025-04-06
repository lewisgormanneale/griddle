<img width="385" alt="Griddle" src="https://github.com/user-attachments/assets/044e49dd-cc96-4b25-8bc6-c814d6ea5b53" />

##  Overview

Griddle is a site based around solving nonograms, a type of grid-based logic puzzle that is known by many other names including picross, griddlers (hence the name), hanjie and more.

I first gained interest in this puzzle format playing the 3DS Picross e series developed by Jupiter and published by Nintendo. For anyone who tries one out and is keen to play more, if you own a Nintendo Switch I'd recommend the Picross S series on there.

I built this site primarily to gain deeper experience with React, and Next.js. I had a lot of ideas on ways to expand the site in the future, which made it a good candidate for an ongoing project. See the roadmap for more.

## View Live
### [https://griddle.lewisgormanneale.com/](https://griddle.lewisgormanneale.com/)

## Features
- View and solve nonograms in the browser (currently mobile is not supported, as a cursor is needed and the grids aren't responsive enough to work with small screen sizes)
- Nonograms can belong to packs to organise them
- Nonograms are stored in a Supabase database

## Screenshots
<img width="1154" alt="Screenshot 2025-04-06 at 20 26 48" src="https://github.com/user-attachments/assets/089012fa-b89c-4c7f-8d3e-82ac2160142f" />

## Future Roadmap
- User auth support - log in to save times, remember completed puzzles, and compete in leaderboards
- Daily puzzle support - generate or cycle through a new puzzle each day (like Wordle)
- More puzzles and more packs, including a focus on smaller puzzles (15x15 or so)
- A puzzle generator - both random and a way to draw your own nonogram and, if the hints are solvable, upload your own.
- View statistics - average solve time by size, average daily sovle time etc.
- Hint support - greying out completed hints, highlighting solvable hints and so on (making these optional to the player)
- Touch device support
- Mobile device support (I need to look at mobile nonogram games and see how they get around the space issue).
