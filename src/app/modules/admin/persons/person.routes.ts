import { Routes } from '@angular/router';
import { CanDeactivateUserEdit } from './person.guard';
import { personListsResolver, personResolver } from './person.resolver';
import { PersonComponent } from './person.component';
import { EditPersonComponent } from './edit/edit.component';
import { PersonListComponent } from './list/list.component';

export default [
    {
        path: '',
        component: PersonComponent,
        children: [
            {
                path: '',
                component: PersonListComponent,
                resolve: {
                    initialData: personListsResolver,
                },
                children: [
                    {
                        path: 'create',
                        component: EditPersonComponent,
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                    {
                        path: 'edit/:id',
                        component: EditPersonComponent,
                        resolve: {
                            initialData: personResolver,
                        },
                        canDeactivate: [CanDeactivateUserEdit],
                    },
                ],
            },
        ],
    },
] as Routes;
