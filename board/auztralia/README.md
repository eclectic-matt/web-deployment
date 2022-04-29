# AuZtralia Setup Tool

A web-based tool which allows for quick setup for the board game AuZtralia.

This is now hosted on my Github pages at:

[AuZtralia Setup Tool](http://eclectic-matt.github.io/web-deployment/board/auztralia/setup.html)

## What is this?
A tool for the board game AuZtralia, which drastically speeds up the game setup.
It's not that much setup, but I didn't like how long it took me to mentally process the placement rules.

## What is the setup?
In the physical version, you lay the board out and draw a random survey tile for each hex showing a triangle symbol. This survey tile shows resources and old ones which are placed on neighbouring hexes. There are restrictions to placement, such as coastal hexes (yellow) never getting resources, and coastal/hill hexes (yellow/green) never getting old one tiles (Eastern Board only, other rules on Western Board/TaZmania).

## How does this tool work?
Simply click "Setup" and all required survey tiles will be drawn, their resources allocated to the relevant neighbouring hexes, and then presented in a visual "hex grid" view. 

The Output Table shows the survey tile drawn in each step, along with the mapped hex ID/grid reference on the map. You can even click those locations in the table, and they will appear highlighted to double-check!

## How do I use this to set up the game?
Once you've clicked the setup button, you can view the visual hex grid and add all resources shown onto the relevant hexes on the physical board.

The Output Table is there for verifying the survey tile at each step and the resources/old ones that *would* be applied to neighbouring hexes. 

Please note that the Output Table shows ALL resources/old ones (as they are shown on the survey tile) but does not exclude resources/old ones based on placement rules. These are applied on the visual hex grid itself. 

For example, a coastal hex might be shown to receive resources on the Output Table, but this does not appear on the visual hex grid (as coastal hexes do not get resources).

## Is this fully featured?
No. This tool currently has the Eastern board, and all survey tiles from the base game.

There are several changes still needed, as follows:
* better overall styling and responsive layout (desktop/phone)
* check remaining old ones/resources (unlimited at present)
* play on the Western/Tazmania board (testing at present)

These will be added in the near future.

## Known Issues
There are a few bugs which I've identified in my testing so far, as follows:
* Visual fixes for Tazmania/Western Board
* Unlimited resources (e.g. old ones)