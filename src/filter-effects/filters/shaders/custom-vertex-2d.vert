// SPDX-FileCopyrightText: 2021 SecretFire
//
// SPDX-License-Identifier: BSD-3-Clause

// Custom vertex shader with filterLocalCoord()
precision mediump float;

attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
uniform mat3 filterMatrix;
uniform vec4 inputSize;
uniform vec4 outputFrame;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

vec4 filterVertexPosition(void) {
  vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

  return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0., 1.);
}

vec2 filterTextureCoord(void) {
  return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void) {
  gl_Position = filterVertexPosition();
  vTextureCoord = filterTextureCoord();
  vFilterCoord = (filterMatrix * vec3(vTextureCoord, 1.0)).xy;
}
