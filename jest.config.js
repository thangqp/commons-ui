module.exports = {
    roots: ['src'],
    verbose: true,
    transform: {
        '^.+\\.js$': '<rootDir>/jest.transform.js',
    },
    testRegex: '(/__tests__/.*|\\.(jest|spec))\\.jsx?$',
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
};
