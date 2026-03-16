export default {
    presets: [
        ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: '3.8', proposals: true } }],
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-optional-chaining',
        '@babel/plugin-transform-private-methods'
    ]
};
