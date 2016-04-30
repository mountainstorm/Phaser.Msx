Phaser.Msx
==========

Phaser.Msx is a set of helper class which attempt to take the effort out of making a game polished.  They aren't going to help you make your actual game any easier to wite - but they will simplify all the other bits; menu screens, options, highscores, credits etc

In the examples directory are a few different games I've made for different reasons which use the framework.

All fonts are based on Google Webfonts and you can customize the display styles of all the classes by overriding the defaults e.g. Phaser.Msx.H1 (all in utils.js)


## Classes ##

### Phaser.Msx.Toolbar ###

The toolbar is automatically added when you use Phaser.Msx.Game.  The toolbar is only shown when the game isn't running fullscreen and provides a titlebar and fullscreen button.  The fullscreen button does the following:

* On Mobile: Displays a small set of rotating instructions on how to add to the homesceen (and relauch fullscreen)
* On Desktop: Goes fullscreen


### Phaser.Msx.Settings ###

A simple wrapper around localStorage for saving/loading settings


### Phaser.Msx.Game ###

A simple class which extends Phaser.Game.  It automatically hooks up the toolbar, settings etc


### Phaser.Msx.Button ###

A multi purpose button.  It can operate in one of three different ways:

* Font based text button.  No need to make small graphics for the button, just use this and it will render over, down without any prep work.  You can see an eample if this on the menu pages.
* Checkbox button.  Simple square toggle button.  You can see an example of this on the optios page.
* Radio button.  Simple round radio button.


### Phaser.Msx.Slider ###

A slider for things like volume; moves a value between 0 and 1.0.  You can see an example on the option page


### Phaser.Msx.Attract ###

This is a base class which extends Phaser.State and provides the ability to change to a new state after a set time period or when someone provides input.  The idea is to use these for attraction mode style screens liek you used to get on arcade games.

In general you'll want to extend these, and there are lots of examples of me doing that.

When the state is skipped it moves to the next state in this.game.attractStates; looping when there are no more states.


### Phaser.Msx.Play ###

A class which extends Phaser.State and is intended to be extended for you actual game state.  This implements a pause menu and ensures if the game goes out of focus it's paused when it returns


### Phaser.Msx.Credits ###

A simple class extending Phaser.Msx.Attract which provides rolling credits for your game.  A click causes it to jump to the next state.


### Phaser.Msx.Demo ###

A class which extends Phaser.Msx.Attract and runs another state e.g. you actual play state.  It wraps your play state and telling it it's in demo mode via a param to init.


### Phaser.Msx.Highscores ###

A class which extends Phaser.Msx.Attract and provides a simple high score table.  The default implementation saves scores using the settings into 'scores'.  


### Phaser.Msx.Options ###

A which provides a basic options screen.  The default implementation has sound and music sliders which save into settings 'soundVolume' and 'musicVolume'.


### Phaser.Msx.Utils ###

Defines all the standard styles used as defaults


## Building ##

To build the phaser js file I use coyote.  For that it's as simple as running this:
    coyote -w src/:phaser.msx.js

It watches for changes and rebuilds phaser.msx.js  **Note:** it somethimes needs restarting to pickup new files


## Hosting ##

To test stuff serve files using node.js - Python SimpleHTTPServer doesn't work for video (no idea why)
    http-server -p 8000


## Keywords ##

Phaser, HTML5, Msx, GameEngine
