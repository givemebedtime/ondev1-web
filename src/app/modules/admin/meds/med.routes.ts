import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './med.guard';
import { medListsResolver, medResolver } from './med.resolver';
import { MedComponent } from './med.component';
import { EditMedComponent } from './edit/edit.component';
import { MedListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: MedComponent,
        children: [
            {
                path: '',
                component: MedListComponent,
                resolve: {
                    initialData: medListsResolver,
                },
                children: [
                    {
                        path: 'create',
                        component: EditMedComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path: 'edit/:id',
                        component: EditMedComponent,
                        resolve: {
                            initialData: medResolver,
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                ],
            },
        ],
    },
] as Routes;
