import type { FieldAccess } from 'payload'

type FieldUser = { role?: string | null } | null | undefined

const roleOf = (user: FieldUser) => user?.role

/** Any authenticated staff member can read the field. */
export const authenticatedField: FieldAccess = ({ req: { user } }) => Boolean(user)

/** Admin and editor roles can write the field. */
export const adminOrEditorField: FieldAccess = ({ req: { user } }) => {
  const role = roleOf(user as FieldUser)
  return role === 'admin' || role === 'editor'
}

/** Admin and publishing-admin roles can read/write the field. */
export const adminOrPublishingAdminField: FieldAccess = ({ req: { user } }) => {
  const role = roleOf(user as FieldUser)
  return role === 'admin' || role === 'publishing_admin'
}
