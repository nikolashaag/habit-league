const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/weekly',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Weekly.vue') }],
    meta: {
      requiresAuth: true,
      title: 'Weekly Overview'
    }
  },
  {
    path: '/browse',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Browse.vue') }],
    meta: {
      requiresAuth: true,
      title: 'Browse Challenges'
    }
  },
  {
    path: '/daily',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Daily.vue') }],
    meta: {
      requiresAuth: true,
      title: 'Daily view'
    }
  },
  {
    path: '/invite',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Invite.vue') }],
    meta: {
      requiresAuth: true,
      title: 'Join Challenge'
    }
  },
  {
    path: '/create',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Wizard.vue') }],
    meta: {
      requiresAuth: true,
      title: 'New Habit'
    }
  },
  {
    path: '/login',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Login.vue') }],
    meta: {
      requiresAuth: false,
      title: 'Login'
    }
  },
  {
    path: '/sign-up',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Signup.vue') }],
    meta: {
      requiresAuth: false,
      title: 'Signup'
    }
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MyLayout.vue'),
    children: [{ path: '', component: () => import('pages/Dashboard.vue') }],
    meta: {
      requiresAuth: true,
      title: 'Dashboard'
    }
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
