import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { MedService } from 'app/core/med/med.service';
import { EditMedComponent } from './edit/edit.component';

export const CanDeactivateUserEdit = (
    component: EditMedComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) => {
  
  const medService = inject(MedService);
  
  let nextRoute: ActivatedRouteSnapshot = nextState.root;
  while (nextRoute.firstChild) {
    nextRoute = nextRoute.firstChild;
  }

  if (!nextState.url.includes('/med')) {
    return true;
  }

  if (nextRoute.paramMap.get('id')) {
    return true;
  }

  
  return component.closeDrawer().then(() => {
    medService.med = null;
    return true
  });
  
};