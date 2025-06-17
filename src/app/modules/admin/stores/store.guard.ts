import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { StoreService } from 'app/core/store/store.service';
import { EditStoreComponent } from './edit/edit.component';

export const CanDeactivateUserEdit = (
    component: EditStoreComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const storeService = inject(StoreService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/store')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    storeService.store = null;
    return true
  });
  
};