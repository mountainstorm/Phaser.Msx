/*
 * Copyright (c) 2016 Mountainstorm
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
*/


Zamboni = function (rink) {
    this.rink = rink
}


Zamboni.prototype = Object.create(null)
Zamboni.prototype.constructor = Zamboni


Zamboni.FRAME_WIDTH = 192
Zamboni.FRAME_HEIGHT = 108
Zamboni.FRAME_COUNT = 360

Zamboni.MAX_FORWARD_SPEED = 10.0
Zamboni.MAX_REVERSE_SPEED = 7.0

Zamboni.ACCELERATION_FORWARD = 3.5
Zamboni.ACCELERATION_REVERSE = 3.0
Zamboni.DECELERATION = 5.0

Zamboni.ROTATION_PER_SECOND = 0.9 // radians

Zamboni.BOUNCE_SPEED = 3.0

Zamboni.SCAPE_FADE = 0.25
Zamboni.SCRAPE_VOLUME = 0.2


Zamboni.prototype.preload = function () {
    this.game = this.rink.game // it's been set now
    this.game.load.spritesheet(
        'zamboni', 'assets/imgs/zamboni.png',
        Zamboni.FRAME_WIDTH, Zamboni.FRAME_HEIGHT
    )
    this.game.load.spritesheet(
        'zamboni-reflection', 'assets/imgs/zamboni-reflection.png',
        Zamboni.FRAME_WIDTH, Zamboni.FRAME_HEIGHT
    )
}


Zamboni.prototype.create = function () {
    // _userConfig = MSX.userConfig()
    // _soundBump = new Sfx('audio/bump.ogg')
    // _soundScrape = new Sfx('audio/scrape.ogg')
    this.origin = V3.$(0, 0, 0.5)

    // sprites for the zamboni and the reflection
    var game = this.game
    this.sprite = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'zamboni', 0)
    this.sprite.anchor = new Phaser.Point(0.5, 0.5)
    this.reflection = new Phaser.Sprite(game, game.width / 2, game.height / 2, 'zamboni-reflection', 0)
    this.reflection.anchor = new Phaser.Point(0.5, 0.5)
    this.speed = 0.0
    this._direction = 0.0

    Zamboni.RADIANS_PER_FRAME = (2 * Math.PI) / (Zamboni.FRAME_COUNT - 1)

    this.points = {
        polishA: V3.$(-3.9, 1.7, -0.45),
        polishB: V3.$(-3.9, -1.7, -0.45),
        reflection: V3.$(0, 0, -1.0)
    }
}


Zamboni.prototype.shutdown = function () {
    // _soundScrape.stop()
    // _soundBump.stop()
}


Zamboni.prototype.update = function () {
    this.locationUpdate()
    // move zamboni in world coordinates
    // this.origin the sprites
    var sp = this.rink.camera.toScreen(this.origin)
    this.sprite.x = sp.x
    this.sprite.y = sp.y
    var rp = this.rink.camera.toScreen(V3.add(this.origin, this.points.reflection))
    this.reflection.x = rp.x
    this.reflection.y = rp.y

    // choose the right frame
    var f = this.direction / Zamboni.RADIANS_PER_FRAME
    this.sprite.frame = this.reflection.frame = Math.round(f)

    // polishing device is offset from zamboni origin
    var m = M4x4.makeTranslate(this.origin)
    m = M4x4.rotate(-this.direction, V3.z, m)
            
    var a = this.rink.camera.toScreen(M4x4.transformPoint(m, this.points.polishA))
    var b = this.rink.camera.toScreen(M4x4.transformPoint(m, this.points.polishB))
    
    this.rink.rink.blendDestinationOut()
    this.rink.rink.line(a.x, a.y, b.x, b.y, 'black', 10)
}


Zamboni.prototype.locationUpdate = function () {
    // forward/backward/acceleration etc
    var elapsed = PHASER.time.elapsedMS / 1000
    //var elapsed = PHASER.time.physicsElapsed
    if (PHASER.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.touchControl.cursors.up) {
        this.speed += Zamboni.ACCELERATION_FORWARD * elapsed
        if (this.speed > Zamboni.MAX_FORWARD_SPEED) {
            this.speed = Zamboni.MAX_FORWARD_SPEED
        }
    } else if (PHASER.input.keyboard.isDown(Phaser.Keyboard.DOWN) || this.game.touchControl.cursors.down) {
        this.speed -= Zamboni.ACCELERATION_REVERSE * elapsed
        if (this.speed > 0.0) {
            this.speed -= Zamboni.DECELERATION * elapsed
            if (this.speed < 0.0) {
                this.speed = 0.0
            }
        }
        if (this.speed < -Zamboni.MAX_REVERSE_SPEED) {
            this.speed = -Zamboni.MAX_REVERSE_SPEED
        }
    } else {
        var delta = Zamboni.DECELERATION * elapsed
        if (Math.abs(this.speed) < delta) {
            delta = this.speed
        }
        if (this.speed > 0.0) {
            this.speed -= delta
        } else {
            this.speed += delta
        }
    }

    // turning left/right
    console.log(this.game.touchControl.deltaX)
    var turning = false;
    if (this.speed != 0.0) {
        if (PHASER.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.touchControl.deltaX < -50) {
            this.direction += Zamboni.ROTATION_PER_SECOND * elapsed
            turning = true
        } else {
            if (PHASER.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.touchControl.deltaX > 50) {
                this.direction -= Zamboni.ROTATION_PER_SECOND * elapsed
                turning = true             
            }
        }
    }

    // var dv = SCAPE_FADE * SCRAPE_VOLUME * HXP.elapsed;
    // if (turning) {
    //     if (!_soundScrape.playing) {
    //         _soundScrape.play(SCRAPE_VOLUME * _userConfig.soundVolume, 0, true);
    //     } else {
    //         if (_soundScrape.volume + dv < SCRAPE_VOLUME * _userConfig.soundVolume) {
    //             _soundScrape.volume += dv;
    //         } else {
    //             _soundScrape.volume = SCRAPE_VOLUME * _userConfig.soundVolume;
    //         }
    //     }
    // } else {
    //     if (_soundScrape.playing) {
    //         _soundScrape.volume -= dv;
    //         if (_soundScrape.volume < 0.0001) {
    //             _soundScrape.stop();
    //         }
    //     }
    // }

    // update the location of the zamboni
    var dx = Math.cos(-this.direction) * this.speed * elapsed
    var dy = Math.sin(-this.direction) * this.speed * elapsed
    var px = this.origin[0] + dx
    var py = this.origin[1] + dy

    if (this.rink.inRink(px, py) == false) {
        this.origin[0] = px
        this.origin[1] = py
    } else {
        //_soundBump.play(_userConfig.soundVolume);
        this.origin[0] -= dx
        this.origin[1] -= dy
        if (this.speed > 0.0) {
            this.speed = -Zamboni.BOUNCE_SPEED
        } else {
            this.speed = Zamboni.BOUNCE_SPEED
        }
    }        
}


Object.defineProperty(Zamboni.prototype, 'direction', {
    get: function() {
        return this._direction
    },
    set: function(rads) {
        // ensure angle stays in 0.0 - 2*pi; needed for frame calculation
        if (rads >= 2 * Math.PI) {
            rads -= 2 * Math.PI
        } else if (rads < 0.0) {
            rads += 2 * Math.PI
        }
        this._direction = rads
    }
})

