precision mediump float;

uniform sampler2D textureSampler;
uniform sampler2D normalSampler;
uniform vec4 uAmbientColor;

uniform vec3 uLightPos;
uniform vec4 uLightColor;
uniform vec3 uFalloff;
uniform bool uHasDiffuse;
uniform bool uHasSpec;

uniform bool isSecondLightActive;
uniform vec3 uLightPos2;
uniform vec4 uLightColor2;
uniform vec3 uFalloff2;
uniform bool uHasDiffuse2;
uniform bool uHasSpec2;

varying vec2 vTexCoord;
varying vec3 vFragPos;

struct Light{
    bool Active;
    vec3 Pos;
    vec4 Color;
    vec3 Falloff;
    bool HasDiffuse;
    bool HasSpec;
};

uniform Light uLights[8];

vec3 normalZero = vec3(0.5, 0.5, 0.5);

float diffuseWeight = 0.5;
float specularWeight = 0.5;

void main(void)  {
    vec4 textureColor = texture2D(textureSampler, vTexCoord);
    vec3 normal = texture2D(normalSampler, vTexCoord).rgb;
    normal = normalize(normal - normalZero);
    
    vec4 result = textureColor;
    vec3 Ambient = uAmbientColor.rgb * uAmbientColor.a;

    if (textureColor.a > 0.9) {
        vec3 lightIncident = normalize(vFragPos - uLightPos);
        vec3 lightReflect = reflect(lightIncident, normal);

        // float D = length(uLightPos - vFragPos);
        float Attenuation = 0.0;
        
        vec3 diffuse = vec3(0.0, 0.0, 0.0);
        // if (uHasDiffuse) {
        //     diffuse = max(0.0, dot(normal, normalize(uLightPos - vFragPos)))
        //         * Attenuation * uLightColor.rgb * uLightColor.a;
        // }

        vec3 specular = vec3(0.0, 0.0, 0.0);
        // if (uHasSpec) {
        //     specular = pow(max(0.0, lightReflect.z), 2.0)
        //         * Attenuation * uLightColor.rgb * uLightColor.a;
        // }

        // if (isSecondLightActive) {
        //     lightIncident = normalize(vFragPos - uLightPos2);
        //     lightReflect = reflect(lightIncident, normal);
            
        //     D = length(uLightPos2 - vFragPos);
        //     Attenuation = 1.0 /
        //         (uFalloff2.x + (uFalloff2.y*D) + (uFalloff2.z*D*D));
            
        //     if (uHasDiffuse2) {
        //     diffuse += max(0.0, dot(normal, normalize(uLightPos2 - vFragPos)))
        //         * Attenuation * uLightColor2.rgb * uLightColor2.a;
        //     }

        //     if (uHasSpec2) {
        //         specular += pow(max(0.0, lightReflect.z), 2.0)
        //             * Attenuation * uLightColor2.rgb * uLightColor2.a;
        //     }
        // }

        for(int i = 0; i < 8; i++){
            if(uLights[i].Active){
                lightIncident = normalize(vFragPos - uLights[i].Pos);
                lightReflect = reflect(lightIncident, normal);
            
                float D = length(uLights[i].Pos - vFragPos);
                Attenuation = 1.0 /
                    (uLights[i].Falloff.x + (uLights[i].Falloff.y*D) + (uLights[i].Falloff.z*D*D));
            
                if (uLights[i].HasDiffuse) {
                    diffuse += max(0.0, dot(normal, normalize(uLights[i].Pos - vFragPos)))
                        * Attenuation * uLights[i].Color.rgb * uLights[i].Color.a;
                }

                if (uLights[i].HasSpec) {
                    specular += pow(max(0.0, lightReflect.z), 2.0)
                        * Attenuation * uLights[i].Color.rgb * uLights[i].Color.a;
                }
            }
        }
        
        result = vec4((Ambient + diffuse + specular) * vec3(result), 1.0);
    }
    gl_FragColor = result;
}
