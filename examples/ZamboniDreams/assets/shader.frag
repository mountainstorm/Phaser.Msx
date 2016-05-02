precision mediump float;

uniform vec2 topLeft;
uniform vec2 bottomRight;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main( void ) {
    if (gl_FragCoord.x > topLeft.x && gl_FragCoord.x < bottomRight.x &&
        gl_FragCoord.y > topLeft.y && gl_FragCoord.y < bottomRight.y) {
            if (gl_FragData[0].r != 1.0) {
                
            }
            gl_FragData[0] = vec4(1.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragData[0] = texture2D(uSampler, vTextureCoord);
    }
}
