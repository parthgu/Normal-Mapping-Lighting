precision mediump float;

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D textureSampler;
uniform sampler2D normalSampler;

// Color of pixel
// uniform vec4 uPixelColor;
uniform vec3 uLightPos;
uniform vec4 uLightColor;
uniform vec4 uAmbientColor;
uniform vec3 uFalloff;

uniform bool uHasDiffuse;
uniform bool uHasSpec;

// The "varying" keyword is for signifying that the texture coordinate will be
// interpolated and thus varies.
varying vec2 vTexCoord;
varying vec3 vFragPos;

vec3 normalZero = vec3(0.5, 0.5, 0.5);

float diffuseWeight = 0.5;
float specularWeight = 0.5;

void main(void)  {
    vec4 textureColor = texture2D(textureSampler, vTexCoord);
    vec3 normal = texture2D(normalSampler, vTexCoord).rgb;
    normal = normalize(normal - normalZero);
    
    vec4 result = textureColor;
    if (textureColor.a > 0.9) {
        vec3 lightIncident = normalize(vFragPos - uLightPos);
        vec3 lightReflect = reflect(lightIncident, normal);
        float D = length(uLightPos - vFragPos);

        vec3 diffuse = vec3(0.0, 0.0, 0.0);
        vec3 specular = vec3(0.0, 0.0, 0.0);
        vec3 Ambient = uAmbientColor.rgb * uAmbientColor.a; 
        
        float Attenuation = 1.0 /
            (uFalloff.x + (uFalloff.y*D) + (uFalloff.z*D*D));
        
        if (uHasDiffuse) {
            diffuse = max(0.0, dot(normal, normalize(uLightPos - vFragPos)))
                // * diffuseWeight * Attenuation * uLightColor.rgb;
                * Attenuation * uLightColor.rgb * uLightColor.a;
        }

        if (uHasSpec) {
            specular = pow(max(0.0, lightReflect.z), 2.0)
                * Attenuation * uLightColor.rgb * uLightColor.a;
        }
        
        result = vec4((Ambient + diffuse + specular) * vec3(result), 1.0);
    }
    gl_FragColor = result;
}
