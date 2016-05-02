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


Phaser.Msx.AttractScreen = function () {
    Phaser.Msx.Attract.call(this)
    this._attractID = 'phaser.msx.attractscreen.' + Phaser.Msx.AttractScreen._nextAttractId
    Phaser.Msx.AttractScreen._nextAttractId++
    this.url = null
}


Phaser.Msx.AttractScreen._nextAttractId = 0


Phaser.Msx.AttractScreen.prototype = Object.create(Phaser.Msx.Attract.prototype)
Phaser.Msx.AttractScreen.prototype.constructor = Phaser.Msx.AttractScreen


Phaser.Msx.AttractScreen.prototype.preload = function () {
    Phaser.Msx.Attract.prototype.preload.call(this)
    if (this.url.endsWith('.mp4')) {
        this.game.load.video(this._attractID, this.url)
    } else {
        this.game.load.image(this._attractID, this.url)
    }
}


Phaser.Msx.AttractScreen.prototype.create = function () {
    Phaser.Msx.Attract.prototype.create.call(this)
    if (this.url.endsWith('.mp4')) {
        var video = this.game.add.video(this._attractID)
        video.addToWorld()
        video.play()
    } else {
        this.game.add.sprite(0, 0, this._attractID)
    }
}
