// this is the fragment (or pixel) shader

precision mediump float;
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D textureSampler;
uniform sampler2D normalSampler;

// Color of pixel
uniform vec4 uPixelColor;
uniform vec4 uCameraPos;
uniform vec4 uLightPos;

// The "varying" keyword is for signifying that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTextureCoord;
varying vec2 vNormalCoord;
varying vec3 fragPos;
varying vec3 cameraPos;

vec3 lightColor = vec3(1.0, 1.0, 1.0);

void main(void)  {
    vec4 textureColor = texture2D(textureSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    vec3 normal = texture2D(normalSampler, vec2(vNormalCoord.s, vNormalCoord.t));
    normal = normalize(vec3(normal));
    
    // different options:
    // e.g.  tint the transparent area also
    // vec4 result = c * (1.0-uPixelColor.a) + uPixelColor * uPixelColor.a;
    
    // or: tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(c) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    vec4 result = vec4(r, c.a);

    vec4 result = textureColor;
    if (textureColor.a > 0.9) {
        vec3 lightIncident = normalize(fragPos - lightPos);
        vec3 lightReflect = reflect(lightIncident, normal);

        vec3 ambient = 0.1 * lightColor;
        vec3 diffuse = max(0.0, dot(normal, normalize(uLightPos - fragPos))) * lightColor;
        vec3 specular = pow(max(0.0, dot(normalize(uCameraPos - fragPos), lightReflect)), 16) * 0.5 * lightColor;

        result = vec4(ambient + diffuse + specular, textureColor.a);
    }
    
    gl_FragColor = result;
}