module.exports = {
  extends: 'next',
  root: true,
  'react-hooks/exhaustive-deps': [
    'error',
    {
      additionalHooks: '(useAnimatedStyle|useDerivedValue|useAnimatedProps)',
    },
  ],
}
