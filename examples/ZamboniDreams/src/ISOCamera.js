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


Ray = function (origin, direction) {
    this.origin = origin
    this.direction = direction
}


Ray.prototype = Object.create(null)
Ray.prototype.constructor = Ray


Ray.prototype.intersectionPlane = function (plane) {
    var denom = V3.dot(plane.normal, this.direction)
    if (Math.abs(denom) > 0.0001) {
        var t = V3.dot(plane.normal, V3.sub(plane.point, this.origin)) / denom
        return t
    }
    return 0.0
}




Plane = function (point, normal) {
    this.point = point
    this.normal = normal
}


Plane.prototype = Object.create(null)
Plane.prototype.constructor = Plane




ISOCamera = function (game, origin, rotation, scale) {
    var game = game
    this.origin = origin
    this.rotation = rotation
    this.scale = scale

    // pre-calculate translation values
    var RAD = Math.PI / 180

    // forshorten factor = world dist (hypotenuse) * cos(rot.x)
    // rot.x = 0 if looking straight down, +60 is typical iso view
    this._forshorten = Math.cos(rotation[0] * RAD)

    // orthographic scale is the # of world units in the longest dimension of the screen
    var dim = game.width > game.height ? game.width: game.height
    this._pixelsPerWorldUnit = dim / scale

    // to covert we also need to adjust for rotation around z
    // envisage this as a top down view (looking straight down) => rot.x = 0
    // and with rot.z > 0.  Hypotenuse is the actual distance in world units
    // adjacent/oposite of the two formed trinagles are the screen x and y
    this._rx = Math.cos(rotation[2] * RAD)
    this._ry = Math.sin(rotation[2] * RAD)

    // we also need the offset between the two origins - we're going to figure out the 
    // world location (on the ground plane) of the top left of the screen 

    // create a vertex (in camera coordinates) for the top left corner
    var lge = scale / 2
    var sml = (game.height / game.width) * scale / 2
    var ox = game.width > game.height ? lge: sml
    var oy = game.width <= game.height ? lge: sml
    var topLeft = [-ox, oy, 0]
    // rotate topLeft by rotation, then transform by origin
    // https://github.com/ron116/webgl-mjs
    // NOTE: for some reason this library needs everything backwards; even rotations
    var m = M4x4.makeTranslate(origin)
    m = M4x4.rotate(rotation[2] * RAD, V3.z, m)
    m = M4x4.rotate(rotation[1] * RAD, V3.y, m)
    m = M4x4.rotate(rotation[0] * RAD, V3.x, m)
    var cameraLocation = M4x4.transformPoint(m, topLeft)

    m = M4x4.makeRotate(rotation[2] * RAD, V3.z)
    m = M4x4.rotate(rotation[1] * RAD, V3.y, m)
    m = M4x4.rotate(rotation[0] * RAD, V3.x, m)
    var cameraNormal = M4x4.transformPoint(m, [0, 0, -1])

    // find the topLeft ray intersection with the ground plane
    var ray = new Ray(cameraLocation, cameraNormal)
    var distance = ray.intersectionPlane(new Plane([0, 0, 0], V3.z))
    var point = V3.add(ray.origin, V3.scale(ray.direction, distance))

    // point is the world location (on ground plane) of the viewport origin
    var sx = point[0] * this._rx * this._pixelsPerWorldUnit
    var sy = point[1] * this._ry * this._pixelsPerWorldUnit
    this._sx = sy + sx
    this._sy = (sy - sx) * this._forshorten
    //console.log(this)
}


ISOCamera.prototype = Object.create(null)
ISOCamera.prototype.constructor = ISOCamera


ISOCamera.prototype.toScreen = function (v) {
    // XXX: this should be the opposite of the above 'find point in camera plane'
    // then if its in bounds convert to pixels

    // do projection matrix to get screen position

    // covert to screen units, and adjust for rotation around z
    var sx = (v[0] * this._rx * this._pixelsPerWorldUnit)
    var sy = (v[1] * this._ry * this._pixelsPerWorldUnit)
    // add components - consider top down view with rot.z = 45
    //   * as world X increases, screen x goes up and screen y goes up
    //   * as world Y increases, screen x goes up and screen y goes down
    // then adjust for position of camera and round to ints 
    var x = (-sy + sx) - this._sx
    var y = ((-sx - sy) * this._forshorten) - this._sy - (v[2] * this._pixelsPerWorldUnit)
    //console.log(x + ', ' + y)
    return new Phaser.Point(x, y)
}
