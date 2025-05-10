#!/usr/bin/env node
require('dotenv').config();
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' }
});
require('./seedContent.ts');
