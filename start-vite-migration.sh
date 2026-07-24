#!/bin/bash
# Pre-reqs for Vite Migration

npm install vite@4.5.2 vite-plugin-nunjucks@0.1.3 --save-dev --legacy-peer-deps
npm uninstall webpack webpack-dev-server babel-core babel-loader babel-preset-es2015 babel-preset-stage-0 css-loader style-loader url-loader webpack-glsl-loader webpack-sources --legacy-peer-deps

echo "Done"
