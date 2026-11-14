import { requireEnv } from '../build/require-env.js'

test('throws naming each missing var', () => {
  expect(() => requireEnv({}, ['VITE_EMAIL'])).toThrow('Missing env: VITE_EMAIL')
  expect(() => requireEnv({ VITE_EMAIL: ' ' }, ['VITE_EMAIL'])).toThrow('VITE_EMAIL')
})

test('passes when present', () => {
  expect(() => requireEnv({ VITE_EMAIL: 'a@b.c' }, ['VITE_EMAIL'])).not.toThrow()
})
