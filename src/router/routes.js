
const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/browse',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/daily',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Daily.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/history',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Wizard.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/sign-up',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Signup.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
