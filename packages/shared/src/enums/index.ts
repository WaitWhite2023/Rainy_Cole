export const USER_ROLES = ['admin', 'editor'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const POST_STATUSES = ['draft', 'published', 'archived'] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const POST_SOURCE_TYPES = ['database', 'markdown'] as const;
export type PostSourceType = (typeof POST_SOURCE_TYPES)[number];
