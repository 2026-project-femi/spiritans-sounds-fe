// access/roles.ts
import { Access } from 'payload'

// Only Admins
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

// Admins AND Editors
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}

// Admins, Editors AND Contributors
export const isAnyRole: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor' || user?.role === 'contributor')
}


//Only Contributor
export const isContributor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'contributor')
}