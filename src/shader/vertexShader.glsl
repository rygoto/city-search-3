// vertexShader.glsl

varying vec3 v_pos;
varying vec3 v_dir;

void main() {
    v_dir = position - cameraPosition; // Points from camera to vertex
    v_pos = position;
}