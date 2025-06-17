import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './store.guard';
import { storeListsResolver, storeResolver } from './store.resolver';
import { StoreComponent } from './store.component';
import { EditStoreComponent } from './edit/edit.component';
import { StoreListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: StoreComponent,
        children: [
            {
                path: '',
                component: StoreListComponent,
                resolve: {
                    initialData: storeListsResolver,
                },
                children: [
                    {
                        path: 'create',
                        component: EditStoreComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path: 'edit/:id',
                        component: EditStoreComponent,
                        resolve: {
                            initialData: storeResolver,
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                ],
            },
        ],
    },
] as Routes;
