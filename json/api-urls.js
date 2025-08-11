export const apiUrls = {
    url: {
        baseUrl: 'https://pioneerrocketry.com',
        auth: {
            googleLogin: '/auth/google',
        },
        admin: {
            users: {
                getAll: '/admin/users',
                update: '/admin/users/',
            },
            events: {
                create: '/admin/events',
                update: '/admin/events/',
                remove: '/admin/events/',
            },
            images: {
                create: '/admin/images',
                remove: '/admin/images/',
                replace: '/admin/images/',
            },
            modules: {
                get: '/admin/modules/',
                getAll: '/admin/modules',
                create: '/admin/modules',
                update: '/admin/modules/',
                remove: '/admin/modules/',
                css: {
                    get: '/admin/css/',
                    getAll: '/admin/css',
                    create: '/admin/css',
                    update: '/admin/css/',
                    remove: '/admin/css/',
                },
                scripts: {
                    get: '/admin/scripts/',
                    getAll: '/admin/scripts',
                    create: '/admin/scripts',
                    update: '/admin/scripts/',
                    remove: '/admin/scripts/',
                },
            },
            pages: {
                create: '/admin/pages',
                update: '/admin/pages/',
            },
            rockets: {
                create: '/admin/rockets/',
                remove: '/admin/rockets/',
            },
        },
        events: {
            getAll: '/calendar/events',
            get: '/calendar/events/',
            serve: '/calendar/events//page',
        },
        images: {
            get: '/images/',
            getAll: '/images',
        },
        pages: {
            serve: '/pages/',
        },
        rockets: {
            get: '/rockets/',
        },
    },
    methods: {
        auth: {
            googleLogin: 'POST',
        },
        admin: {
            users: {
                getAll: 'GET',
                update: 'PUT',
            },
            events: {
                create: 'POST',
                update: 'PUT',
                remove: 'DELETE',
            },
            images: {
                create: 'POST',
                remove: 'DELETE',
                replace: 'PUT',
            },
            modules: {
                get: 'GET',
                getAll: 'GET',
                create: 'POST',
                update: 'PUT',
                remove: 'DELETE',
                css: {
                    get: 'GET',
                    getAll: 'GET',
                    create: 'POST',
                    update: 'PUT',
                    remove: 'DELETE',
                },
                scripts: {
                    get: 'GET',
                    getAll: 'GET',
                    create: 'POST',
                    update: 'PUT',
                    remove: 'DELETE',
                },
            },
            pages: {
                create: 'POST',
                update: 'PUT',
            },
            rockets: {
                create: 'POST',
                remove: 'DELETE',
            },
        },
        events: {
            getAll: 'GET',
            get: 'GET',
            serve: 'GET',
        },
        images: {
            get: 'GET',
            getAll: 'GET',
        },
        pages: {
            serve: 'GET',
        },
        rockets: {
            get: 'GET',
        },
    },
};
