import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MatDateRangePicker,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { StoreService } from 'app/core/store/store.service';
import { Store } from 'app/core/store/store.type';
import { GetStoreParameter } from 'app/core/store/parameters/get-store.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { Observable, Subject, debounceTime, merge, takeUntil } from 'rxjs';
import { TableStoreComponent } from '../table/table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdateStoreDto } from 'app/core/store/dto/update-store.dto';

@Component({
    selector: 'store-list',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatSelectModule,
        RouterModule,
        MatTabsModule,
        MatDatepickerModule,
        TableStoreComponent,
        MatTooltipModule
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class StoreListComponent {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    @ViewChild('dropdownContainer', { static: false })

    isShowReset: boolean = false;
    showLoading = {
        search: false,
    };

    drawerMode: 'side' | 'over' = 'over';
    currPage: Page = {
        page: 1,
        limit: DEF_LIMIT,
        sortBy: 'updatedAt',
        sortType: SortType.desc,
    };

    searchInputControl: UntypedFormControl = new UntypedFormControl();
    statusControl: UntypedFormControl = new UntypedFormControl('');

    
    stores$: Observable<PageResponse<Store[]>>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _storeService: StoreService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.stores$ = this._storeService.storeLists$.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300)
        );

        merge(this.statusControl.valueChanges)
            .pipe(debounceTime(300))
            .subscribe(() => {
                this.fetchData();
            });
    }


    onOpenCreate(): void {
        this._router.navigate(['./', 'create'], {
            relativeTo: this._activatedRoute,
        });
    }

    onOpenEdit(id: string): void {
        this._router.navigate(['./', 'edit', id], {
            relativeTo: this._activatedRoute,
        });
    }

    onEdit(store: Store): void {
        console.log(store);
        this.onOpenEdit(store.storeID);
    }

    onDelete(store: Store): void {
        console.log(store);
        this._fuseConfirmationService
            .alertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้ หรือไม่')
            .afterClosed()
            .subscribe((result: boolean) => {
                if (result) {
                    this.deleteStore(store.storeID);
                }
            });
    }

    deleteStore(id: string): void {
        this._storeService
            .delete(id)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((res) => {
                this.fetchData();
                this._fuseConfirmationService.alertSuccess();
            });
    }

    onChangePage(event: PageEvent): void {
        this.currPage.limit = event.pageSize;
        this.currPage.page = event.pageIndex;
        this.fetchData();
    }

    getParameter(): GetStoreParameter {
        const param = new GetStoreParameter();
        param.limit = this.currPage.limit;
        param.page = this.currPage.page;
        param.sortBy = this.currPage.sortBy;
        param.sortType = this.currPage.sortType;
        param.keyword = this.searchInputControl.value;
        
        console.log(param);
        return param;
    }

    fetchData(): void {
        this._storeService
            .getStoreLists(this.getParameter())
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe(() => {
                
            });
    }

    onReset() {
        this.searchInputControl.setValue('');
        this.fetchData();
        this.isShowReset = false;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
