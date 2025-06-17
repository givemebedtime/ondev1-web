import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    ResolveFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { StoreService } from 'app/core/store/store.service';
import { Store } from 'app/core/store/store.type';
import { GetStoreParameter } from 'app/core/store/parameters/get-store.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { catchError, throwError } from 'rxjs';

export const storeListsResolver: ResolveFn<PageResponse<Store[]>> = (
    route,
    state
) => {
    const currPage: Page = { page: 1, limit: DEF_LIMIT, sortBy: 'updatedAt', sortType: SortType.desc };
    const storeService = inject(StoreService);
    const param = new GetStoreParameter();
    param.limit = currPage.limit;
    param.page = currPage.page;
    param.sortBy = currPage.sortBy;
    param.sortType = currPage.sortType;
    return storeService.getStoreLists(param);
};

export const storeResolver: ResolveFn<Store> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const storeService = inject(StoreService);
    const router = inject(Router);

    return storeService.getStoreById(route.paramMap.get('id')).pipe(
        catchError((error) => {
            console.error(error);
            const parentUrl = state.url.split('/').slice(0, -1).join('/');
            router.navigateByUrl(parentUrl);
            return throwError(error);
        })
    );
};
