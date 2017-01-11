# webpack 2 long-term-cache

The purpose of this repo is to demonstrate the minimal amount of configuration required to generate deterministic hash-based vendor and entry file names that persist over webpack builds.

To make any sense of this, you should understand the basics of [webpack](https://webpack.js.org/get-started/). I strongly encourage you to visit the documentation if some concepts here aren't familiar to you.

## What's covered
* The minimal config required to generate highly-cacheable name-hashed bundle files
* The config also ensures that if any particular bundle changes, it doesn't break the hash of other bundles
* This config also allows you to **add** entry files without breaking the vendor or entry file hashes.  

## What's not covered
* CSS or other assets are not covered
* how to actually, you know, **use** the hashed-named assets. [Other tutorials](http://madole.xyz/asset-hashing-with-webpack/) cover this, but you'll most likely use [a plugin that generates a cache manifest](https://www.npmjs.com/package/webpack-plugin-manifest), then use a template filter or some other scheme to write the asset script tags to your HTML.
* minification

## And&hellip;?

Read `webpack.config.js` in this repo. 

It's heavily commented with lots of references to webpack docs.
 
Then, 

1. install the depencencies (`yarn install` or use npm). 
1. Play around with the build: `yarn run webpack`. 
1. Make some changes (for example, add `entry-z.js` to the `entry` field or change the implementation of a module). 

You should see stable vendor output unless you change the modules in the vendor bundle by altering `entry.vendor` field.

Note that the `runtime` bundle will change with each build (if any modules change). This is necessary and OK. The `runtime` file after minification and gzipping should be very small (<5k depending on the size of the project). It will be cached across your site, but not between builds. 

## Problems?

If so, please create an issue! It's very hard to extensively test the behavior over many builds. I'd love to hear any cases where the bundle hashes weren't persisted properly.
