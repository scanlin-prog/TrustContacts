import Auth from '@pages/auth/auth.vue';
import Contacts from '@pages/contacts/contacts.vue';
import AddContact from '@pages/add-contact/add-contact.vue';
import EditContact from '@pages/edit-contact/edit-contact.vue';

import type { RouteRecordRaw } from 'vue-router';

export const routes: readonly RouteRecordRaw[] = [
  {
    name: 'Auth',
    path: '/auth',
    component: Auth,
  },
  {
    name: 'Contacts',
    path: '/',
    component: Contacts,
    meta: { requiresAuth: true },
  },
  {
    name: 'AddContact',
    path: '/add-contact',
    component: AddContact,
    meta: { requiresAuth: true },
  },
  {
    name: 'EditContact',
    path: '/edit-contact/:id',
    component: EditContact,
    meta: { requiresAuth: true },
    props: true,
  },
];
