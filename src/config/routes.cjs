const Routes = {
    'Super Admin': {
        'dashboard': '/super-admin/dashboard',
        'show-admins': '/show-admins',
        'admins': '/super-admin/admins',
        'default': '/super-admin/admins',
        'logout': '/logout'
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