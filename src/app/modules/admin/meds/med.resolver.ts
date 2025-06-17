import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { MedService } from 'app/core/med/med.service';
import { Med } from 'app/core/med/med.type';
import { GetMedParameter } from 'app/core/med/parameters/get-med.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { catchError, throwError } from 'rxjs';

export const medListsResolver: ResolveFn<PageResponse<Med[]>> = (
    route,
    state
) => {
    const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
    const medService = inject(MedService);
    const param = new GetMedParameter();
    param.limit = currPage.limit;
    param.page = currPage.page;
    param.sortBy = currPage.sortBy;
    param.sortType = currPage.sortType;
    return medService.getMedLists(param);
};

export const medResolver: ResolveFn<Med> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const medService = inject(MedService);
    const router = inject(Router);

    return medService.getMedById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
};
