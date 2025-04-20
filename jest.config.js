module.exports = {
  moduleNameMapper: {
    '\\.module\\.scss$': 'identity-obj-proxy',
    '\\.scss$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};