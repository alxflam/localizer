module.exports = {
    root: true,
    extends: [
        './eslint/base.eslintrc.json',
        './eslint/warnings.eslintrc.json',
        './eslint/errors.eslintrc.json',
        './eslint/xss.eslintrc.json',
    ],
    ignorePatterns: [
        '**/{node_modules,lib}',
        'plugins'
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json'
    }
};