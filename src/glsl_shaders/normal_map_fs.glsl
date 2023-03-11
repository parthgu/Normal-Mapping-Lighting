precision mediump float;

uniform sampler2D textureSampler;
uniform sampler2D normalSampler;
uniform vec4 uAmbientColor;

// light 1 uniforms
uniform vec3 uLightPos;
uniform vec4 uLightColor;
uniform vec3 uFalloff;
uniform bool uHasDiffuse;
uniform bool uHasSpec;

uniform vec3 uLightPosModelSpace;
uniform bool uIsInWC;
uniform mat4 uModelRTMat;

// light 2 uniforms
uniform bool isSecondLightActive;
uniform vec3 uLightPos2;
uniform vec4 uLightColor2;
uniform vec3 uFalloff2;
uniform bool uHasDiffuse2;
uniform bool uHasSpec2;

varying vec2 vTexCoord;
varying vec3 vFragPos;

// constants
vec3 normalZero = vec3(0.5, 0.5, 0.5);
float diffuseWeight = 0.5;
float specularWeight = 0.5;
float minWeightThresh = 0.6;

void main(void)  {
    vec4 textureColor = texture2D(textureSampler, vTexCoord);
    vec3 normal = texture2D(normalSampler, vTexCoord).rgb;
    normal = normalize(normal - normalZero);
    
    vec3 lightPosToUse = uLightPos;
    if (!uIsInWC) {
        lightPosToUse = vec3(uModelRTMat * vec4(uLightPosModelSpace, 1.0));
    }

    vec4 result = textureColor;
    vec3 Ambient = uAmbientColor.rgb * uAmbientColor.a;

    if (textureColor.a > 0.9) {
        vec3 lightIncident = normalize(vFragPos - lightPosToUse);
        vec3 lightReflect = reflect(lightIncident, normal);

        float D = length(lightPosToUse - vFragPos);
        float Attenuation = 1.0 /
            (uFalloff.x + (uFalloff.y*D) + (uFalloff.z*D*D));
        
        vec3 diffuse = vec3(0.0, 0.0, 0.0);
        if (uHasDiffuse) {
            float diffuseTerm = max(0.0, dot(normal, normalize(lightPosToUse - vFragPos)))
                * Attenuation;
            if (diffuseTerm > minWeightThresh) diffuseTerm = minWeightThresh;
            else diffuseTerm = 0.0;

            diffuse = diffuseTerm * uLightColor.rgb * uLightColor.a;
        }

        vec3 specular = vec3(0.0, 0.0, 0.0);
        if (uHasSpec) {
            float specTerm = pow(max(0.0, lightReflect.z), 2.0)
                * Attenuation;
            if (specTerm > minWeightThresh) specTerm = minWeightThresh;
            else specTerm = 0.0;

            specular = specTerm * uLightColor.rgb * uLightColor.a;
        }

        // second light logic
        if (isSecondLightActive) {
            lightIncident = normalize(vFragPos - uLightPos2);
            lightReflect = reflect(lightIncident, normal);
            
            D = length(uLightPos2 - vFragPos);
            Attenuation = 1.0 /
                (uFalloff2.x + (uFalloff2.y*D) + (uFalloff2.z*D*D));
            
            if (uHasDiffuse2) {
                float diffuseTerm = max(0.0, dot(normal, normalize(uLightPos2 - vFragPos)))
                    * Attenuation;
                if (diffuseTerm > minWeightThresh) diffuseTerm = minWeightThresh;
                else diffuseTerm = 0.0;

                diffuse += diffuseTerm * uLightColor2.rgb * uLightColor2.a;
            }

            if (uHasSpec2) {
                float specTerm = pow(max(0.0, lightReflect.z), 2.0)
                    * Attenuation;
                if (specTerm > minWeightThresh) specTerm = minWeightThresh;
                else specTerm = 0.0;

                specular += specTerm * uLightColor2.rgb * uLightColor2.a;
            }
        }
        
        result = vec4((Ambient + diffuse + specular) * vec3(result), 1.0);
    }
    gl_FragColor = result;
}
