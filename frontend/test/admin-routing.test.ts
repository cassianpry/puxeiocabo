import test from 'node:test'
import assert from 'node:assert/strict'

import {
  getPostAuthPath,
  getProtectedHomePath,
  shouldRequireFighterLink,
  getAuthNavItems,
} from '../src/lib/admin-routing.ts'

test('routes admins to admin home after auth', () => {
  assert.equal(getPostAuthPath('admin'), '/admin')
})

test('routes users to dashboard after auth', () => {
  assert.equal(getPostAuthPath('user'), '/dashboard')
})

test('sends admins away from protected user routes', () => {
  assert.equal(getProtectedHomePath('admin'), '/admin')
})

test('does not require fighter link for admins', () => {
  assert.equal(shouldRequireFighterLink({ role: 'admin', shortId: null }), false)
})

test('requires fighter link for unlinked users', () => {
  assert.equal(shouldRequireFighterLink({ role: 'user', shortId: null }), true)
})

test('shows admin-only navigation for unlinked admins', () => {
  assert.deepEqual(getAuthNavItems({ isAuthenticated: true, isLinked: false, isAdmin: true }), [
    { to: '/admin', label: 'Painel Admin' },
    { to: '/admin/flagged', label: 'Denúncias Sinalizadas' },
    { action: 'logout', label: 'Sair' },
  ])
})

test('shows logout-only navigation for unlinked users', () => {
  assert.deepEqual(getAuthNavItems({ isAuthenticated: true, isLinked: false, isAdmin: false }), [
    { action: 'logout', label: 'Sair' },
  ])
})
