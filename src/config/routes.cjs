const Routes = {
    'Super Admin': {
        'dashboard': '/super-admin/dashboard',
        'view-admins': '/view/admins',
        'current-admin': '/view/current-admin',
        'view-admin': '/view/admin',
        'admins': '/super-admin/admins',
        'default': '/super-admin/admins',
        'logout': '/logout',
        'admin-count': '/admins/count',
        'admins-paginate': '/admins/paginate',
        'admins-search': '/admins/search',
        'delete-admin': '/admins/delete'
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