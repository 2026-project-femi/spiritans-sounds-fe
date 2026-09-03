// access/roles.ts
import { Access } from 'payload'

// Only Admins
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin')
}

// Admins AND Publishing Admins
export const isAdminOrPublishingAdmin: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'publishing_admin')
}

// Admins AND Editors
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor')
}

// Admins, Editors AND Contributors
export const isAnyRole: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'editor' || user?.role === 'contributor' || user?.role === 'publishing_admin' || user?.role === 'author')
}

//Only Contributor
export const isContributor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'contributor')
}

// Admins, Publishing Admins, and Authors (can read their own data)
// Note: We might need specific author constraints, but this just checks if they have one of these roles.
export const isAdminOrPublishingAdminOrAuthor: Access = ({ req: { user } }) => {
  return Boolean(user?.role === 'admin' || user?.role === 'publishing_admin' || user?.role === 'author')
}