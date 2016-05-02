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

var PHASER = null


window.onload = function () {
    // wait until the window has loaded i.e. EVERY linked resource has been loaded
    // use canvas rendere as WebGL is killed by the uploading of the texture
    PHASER = new Phaser.Msx.Game(
        'Zamboni Dreams',
        '../../msx/',
        'uk.co.mountainstorm.zambonidreams',
        1920, 1080,
        Phaser.CANVAS,
        'msx', {
            preload: function() {
                PHASER.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
                PHASER.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

                PHASER.load.json('credits', 'assets/credits.json')
                PHASER.load.json('settings', 'assets/settings.json')
                PHASER.load.json('levelInfo', 'assets/levels.json')
                //PHASER.load.audio('music', 'assets/sounds/music.mp3')               

                PHASER.load.script('ISOCamera', 'src/ISOCamera.js')
                PHASER.load.script('Zamboni', 'src/Zamboni.js')

                //PHASER.load.script('Menu', 'src/menu.js')
                PHASER.load.script('Play', 'src/play.js')
                
                PHASER.progress = PHASER.add.text(
                    PHASER.world.centerX, PHASER.world.centerY,
                    'Progress: 0%',
                    { font: '64px Lato', fontWeight: '300', fill: "#ffffff", align: "center" }
                )
                PHASER.progress.anchor.setTo(0.5, 0.5)
            },

            loadUpdate: function () {
                PHASER.progress.text = 'Loading: ' + PHASER.load.progress + '%'
            },

            create: function () {
                PHASER.levelInfo = PHASER.cache.getJSON('levelInfo')
                PHASER.settings.defaults = PHASER.cache.getJSON('settings')
                //PHASER.settings.save() // update local version

                // var winners = PHASER.state.add('Winners', Phaser.Msx.AttractScreen)
                // winners.url = 'assets/winners.mp4'

                // var demo = PHASER.state.add('Demo', Phaser.Msx.Demo)
                // demo.play = new Play()

                // var highscores = PHASER.state.add('HighScores', Phaser.Msx.HighScores)
                // highscores.nextState = 'Phaser.Msx.Credits'

                // PHASER.attractStates = [
                //     winners,
                //     PHASER.state.add('Menu', Menu),
                //     demo,
                //     highscores
                // ]

                // var credits = PHASER.state.add('Phaser.Msx.Credits', Phaser.Msx.Credits)
                // credits.credits = PHASER.cache.getJSON('credits')

                // var options = PHASER.state.add('Options', Options)
                PHASER.state.add('Play', Play)

                // options.music = PHASER.sound.play('music', PHASER.settings.load('musicVolume'))

                //PHASER.state.start('Winners')
                PHASER.state.start('Play', undefined, undefined, 0)
            }
        }
    )
    // 3D stuff with three.js
    // this.canvasTarget = Phaser.Canvas.create(256,256,"renderHere");
    // this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas:this.canvasTarget });    
}

