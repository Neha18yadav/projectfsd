export const PERMISSIONS = {
  Admin: {
    "posts:create": true,
    "posts:read": true,
    "posts:update": true,
    "posts:delete": true,
    "users:manage": true, // Admin can manage users
  },
  Editor: {
    "posts:create": true,
    "posts:read": true,
    "posts:update:own": true,
    "posts:delete:own": true,
  },
  Viewer: {
    "posts:read": true,
  },
};
