module.exports = {
    env: {
        browser: true,
    },
    extends: ['airbnb-base'],
    globals: {
        expect: true,
        sinon: true,
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
        sourceType: 'module',
    },
    root: true,
    rules: {
        'arrow-body-style': 'off',
        'class-methods-use-this': 0,
        'import/prefer-default-export': 'off',
        'indent': ['error', 4, {
            MemberExpression: 0,
            SwitchCase: 1,
        }],
        'jsx-a11y/href-no-hash': 0,
        'linebreak-style': ['error', 'unix'],
        'max-len': ['error', { 'code': 120 }],
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
        'no-else-return': ['error', { allowElseIf: true }],
        'no-multiple-empty-lines': ['error', { 'max': 1, 'maxBOF': 1 }],
        'no-param-reassign': [2, { props: false }],
        'no-trailing-spaces': 'error',
        'prefer-destructuring': ['error', {
            AssignmentExpression: {
                array: false,
                object: false,
            },
            VariableDeclarator: {
                array: false,
                object: false,
            },
        }, {
            'enforceForRenamedProperties': false
        }],
        quotes: [
            'error',
            'single',
        ],
        'require-jsdoc': ['error', {
            require: {
                ArrowFunctionExpression: true,
                ClassDeclaration: true,
                FunctionDeclaration: true,
                FunctionExpression: true,
                MethodDefinition: true,
            },
        }],
        semi: [
            'error',
            'always',
        ],
        'space-infix-ops': 'error',
        'valid-jsdoc': 'off',
    },
};
