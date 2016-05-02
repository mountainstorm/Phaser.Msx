/*
 * Copyright (c) 2016 Mountainstorm
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


Play = function () {
    Phaser.Msx.Play.call(this, true)
    this.zamboni = new Zamboni(this)
    this.level = 0
}


Play.prototype = Object.create(Phaser.Msx.Play.prototype)
Play.prototype.constructor = Play


Play.prototype.init = function (level) {
    this.game.stage.backgroundColor = Phaser.Msx.BACKGROUND
    this.level = {
        number: level
    }
}


Play.prototype.preload = function () {
    // load the level files
    this.level.location = this.game.levelInfo.levels[this.level.number].location
    var activity = this.game.levelInfo.levels[this.level.number].activity
    this.level.description = this.game.levelInfo.levels[this.level.number].description
    this.game.load.image('background', 'assets/' + this.level.location + '/background.jpg')
    this.game.load.image('foreground', 'assets/' + this.level.location + '/foreground.png')
    this.game.load.image('rink', 'assets/' + this.level.location + '/rink-' + activity + '.png')

    // touch contorls
    this.game.load.image('compass', 'assets/imgs/compass_rose.png');
    this.game.load.image('touch_segment', 'assets/imgs/touch_segment.png');
    this.game.load.image('touch', 'assets/imgs/touch.png');

    // setup all the rink bits
    var location = this.game.levelInfo.locations[this.level.location]

    // create the rink edge polygon
    this.rinkBounds = []
    for (i = 0; i < location.bounds.length; i++) {
        var vec = location.bounds[i];
        this.rinkBounds.push(new Phaser.Point(vec.x, vec.y));
    }

    // setup camera
    this.camera = new ISOCamera(
        this.game,
        V3.$(location.camera.x, location.camera.y, location.camera.z),
        V3.$(location.camera.rx, location.camera.ry, location.camera.rz),
        location.camera.scale
    )

    // calculate this in photoshop by selecting the area and 
    // looking in the advanced histogram MAKE sure you have 
    // clicked [to remove] ANY warning triangles
    this.area = location.area

    // load the zamboni
    this.zamboni.preload()
}


Play.prototype.create = function () {
    // enable the touch controls
    this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl)
    this.game.touchControl.inputEnable()

    // setup zamboni
    this.zamboni.create()

    // create a bitmap and load the rink onto it
    this.rink = new Phaser.BitmapData(this.game, 'rinkbmd', this.game.world.width, this.game.world.height)
    this.rink.draw(this.game.cache.getImage('rink'))
    this.rink.update()
    
    // create the image stack
    this.game.add.image(0, 0, 'background')
    this.game.add.existing(this.zamboni.reflection)
    this.game.add.sprite(0, 0, this.rink)
    this.game.add.existing(this.zamboni.sprite)
    this.game.add.image(0, 0, 'foreground')

    this.locBounds = { x: this.game.world.width / 2, width: 15, y: 0, height: 15 }

    // // XXX: y inverted
    // var uniforms = {
    //     topLeft: { type: '2f', value: { x: this.locBounds.x, y: this.locBounds.y } },
    //     bottomRight: { type: '2f', value: { x: this.locBounds.x + this.locBounds.width, y: this.locBounds.y + this.locBounds.height } }
    // };
    // this.filter = new Phaser.Filter(this.game, uniforms, this.game.cache.getShader('bacteria'))
    // this.filter.setResolution(1920, 1080)
    // r.filters = [ this.filter ]
}


Play.prototype.update = function () {
    // this.filter.uniforms.topLeft.value = { x: this.locBounds.x, y: this.locBounds.y }
    // this.filter.uniforms.bottomRight.value = { x: this.locBounds.x + this.locBounds.width, y: this.locBounds.y + this.locBounds.height }
    // this.filter.update()
    //this.locBounds.y += 1
    this.zamboni.update()
}


Play.prototype.render = function() {
    this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00")
}


Play.prototype.inRink = function (x, y) {
    // point in polygon algoritm
    var rinkBounds = this.rinkBounds
    var c = false
    var i = 0
    var j = rinkBounds.length - 1
    while (i < rinkBounds.length) {
        if (((rinkBounds[i].y >= y ) != (rinkBounds[j].y >= y) ) &&
            (x <= (rinkBounds[j].x - rinkBounds[i].x) * (y - rinkBounds[i].y) / (rinkBounds[j].y - rinkBounds[i].y) + rinkBounds[i].x)
        ) {
            c = !c
        }
        j = i++
    }
    return !c
}
