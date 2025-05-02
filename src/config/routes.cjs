const Routes = {
    'Super Admin': {
        'dashboard': '/super-admin/dashboard',
        'view-admins': '/view-admins/:limit',
        'view-admin': '/view-admin',
        'admins': '/super-admin/admins',
        'default': '/super-admin/admins',
        'logout': '/logout',
        'admin-count': '/admins/count',
    },
    'System Admin': {
        'users': '/system-admin/users',
        'devices': '/system-admin/devices',
        'dashboard': '/system-admin/dashboard',
        'default': '/system-admin/users',
        'logout': '/logout'
    },
}

module.exports = Routes;