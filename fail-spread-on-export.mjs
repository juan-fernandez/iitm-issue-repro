import pkg from './fail-spread-on-export/dependency.js'

const dependency = pkg.dependency;

console.log(dependency()); // 'dependency'