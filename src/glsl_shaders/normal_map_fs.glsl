// this is the fragment (or pixel) shader

precision mediump float;
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D textureSampler;
uniform sampler2D normalSampler;

// Color of pixel
// uniform vec4 uPixelColor;
uniform vec3 uLightPos;

uniform float uIntensity;
uniform vec3 uFalloff;
uniform vec4 uAmbientColor;

// The "varying" keyword is for signifying that the texture coordinate will be
// interpolated and thus varies.
varying vec2 vTexCoord;
varying vec3 vFragPos;

uniform vec4 uLightColor;
vec3 normalZero = vec3(0.5, 0.5, 0.5);

float diffuseWeight = 0.5;
float specularWeight = 0.5;

void main(void)  {
    vec4 textureColor = texture2D(textureSampler, vTexCoord);
    vec3 normal = texture2D(normalSampler, vTexCoord).rgb;
    vec3 N = normalize(normal * 2.0 - 1.0);

    normal = normalize(normal - normalZero);
    
    vec4 result = textureColor;
    if (textureColor.a > 0.9) {
        vec3 lightIncident = normalize(vFragPos - uLightPos);
        vec3 lightReflect = reflect(lightIncident, normal);
        float D = length(uLightPos - vFragPos);

        vec3 Ambient = uAmbientColor.rgb * uAmbientColor.a; 
        vec3 diffuse = max(0.0, dot(normal, normalize(uLightPos - vFragPos))) * diffuseWeight * uLightColor.rgb;
        vec3 specular = pow(max(0.0, lightReflect.z), 2.0) * specularWeight * uLightColor.rgb;
        float Attenuation = 1.0 / (uFalloff.x + (uFalloff.y*D) + (uFalloff.z*D*D));
        
        // result = vec4((Ambient + specular + diffuse * Attenuation) * vec3(result), 1.0);
        result = vec4((Ambient + diffuse * Attenuation) * vec3(result), 1.0);
    }
    gl_FragColor = result;
}
