# AuZtralia Setup Tool

A web-based tool which allows for quick setup for the board game AuZtralia.

This is now hosted on my Github pages at:

[AuZtralia Setup Tool](http://eclectic-matt.github.io/web-deployment/board/auztralia/setup.html)

## What is this?
A tool for the board game AuZtralia, which drastically speeds up the game setup.
It's not that much setup, but I didn't like how long it took me to mentally process the placement rules.

## What is the setup?
In the physical version, you lay the board out and draw a random setup tile for each hex showing a triangle symbol. This setup tile shows resources and old ones which are placed on neighbouring hexes. There are restrictions to placement, such as coastal hexes (yellow) never getting resources, and coastal/hill hexes (yellow/green) never getting old one tiles.

## How does this tool work?
Simply click "Draw ALL Tiles" and all required setup tiles will be drawn, their resources allocated to the relevant neighbouring hexes, and then presented in a visual "hex grid" view. Below the grid is a table showing the setup tile drawn in each step, along with the mapped hex ID/grid reference on the map. You can even click those locations in the table, and they will appear highlighted to double-check!

## Is this fully featured?
No. This tool currently has the Eastern board, and all setup tiles from the base game.

There are several changes still needed, as follows:
* better overall styling and responsive layout (desktop/phone)
* check remaining old ones/resources (unlimited at present)
* allow solo setup (no tile 14)
* play on the Western or Tazmania boards
* choose difficulty (INSANE, remove Survey tiles with a red clip)
* form options to select boards, solo, difficulty
* a key/reference within the page to identify icons

These will be added in the near future.

## Known Issues
There are a few bugs which I've identified in my testing so far, as follows:
* Additional setup tiles drawn between runs (shows tile 1, 13, 1, 2, 3 in the table)
* Visual fixes for Western Board
* Unlimited resources (e.g. old ones)