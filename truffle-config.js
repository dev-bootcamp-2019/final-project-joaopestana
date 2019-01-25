const nodeExternals = require('webpack-node-externals');

module.exports = {
  networks: {
    // in order to ignore all modules in node_modules folder from bundling
    externals: [nodeExternals()],
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    }
  }
};
