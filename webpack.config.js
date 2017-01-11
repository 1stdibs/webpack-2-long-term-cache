const path = require('path');
const os = require('os');
const webpack = require('webpack');

// This function generates the path where the "records", or state, of the builds
// are stored. If this is the first time you're reading this file, skip down to
// the configuration object exported below and come back later.
function recordsPath(jobName) {
    if (jobName) {
        // Path on CI server where records will be stored.
        // In our case, we're using Jenkins and jobs are able to write to the
        // `/jenkins` directory.
        const filename = jobName.replace(/\W+/g, '').trim();
        return '/jenkins/webpack.records/' + filename + '.json';
    }
    // When building outside a Jenkins environment, save the records file in the
    // users home folder.
    const records = '.' + path.basename(process.cwd()) + '.webpack.records.json';
    return path.resolve(os.homedir(), records);
}

module.exports = {
    // ref: https://webpack.js.org/configuration/entry-context/#context
    context: __dirname,

    // ref: https://webpack.js.org/configuration/entry-context/#entry
    entry: {
        // Create a vendor entry with react and react-dom. Also need to
        // configure the CommonsChunkPlugin lower down.
        vendor: ['react', 'react-dom'],
        // Current best practice is to have one entry per page.
        entryA: './src/entry-a.js'
    },

    // Basic webpack output config. The only interesting thing here is that
    // we're directing webpack to generate hashed file names (and restrict the
    // hash to 8 characters).
    // ref: https://webpack.js.org/configuration/output/
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist'
    },

    // `recordsPath` allows webpack builds to save state between runs. This
    // allows you to add more entries without breaking the vendor bundle hash.
    // Note: in Jenkins, there is an environment variable, JOB_NAME, set to the
    // current job name. We use JOB_NAME to save state for different jobs which
    // use the same config (e.g. deploying to different development and qa
    // servers). Unfortunately, this is currently undocumented.
    recordsPath: recordsPath(process.env.JOB_NAME),

    plugins: [
        // This is where some magic happens (not in a good way, nothing magical
        // in code is good). Setting 'runtime' as the last 'name' in the name
        // array passed to CommonsChunkPlugin will cause the webpack runtime to
        // be extracted into it's own chunk. If you don't do this, you will have
        // hash updates to your vendor bundle if *any* entry file changes, since
        // the runtime references each entry and their hashes change.
        // ref: https://webpack.js.org/guides/code-splitting-libraries/#manifest-file
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor', 'runtime'],
            // Ensures that no other modules go into the vendor chunk.
            // ref: https://webpack.js.org/plugins/commons-chunk-plugin/#explicit-vendor-chunk
            minChunks: Infinity
        })
    ]
};
