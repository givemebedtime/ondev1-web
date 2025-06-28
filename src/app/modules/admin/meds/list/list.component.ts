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
import { MedService } from 'app/core/med/med.service';
import { Med } from 'app/core/med/med.type';
import { GetMedParameter } from 'app/core/med/parameters/get-med.parameter';
import { DEF_LIMIT, Page, SortType } from 'app/core/base/page.type';
import { PageResponse } from 'app/core/base/pageResponse.types';
import { Observable, Subject, debounceTime, merge, takeUntil } from 'rxjs';
import { TableMedComponent } from '../table/table.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UpdateMedDto } from 'app/core/med/dto/update-med.dto';

@Component({
    selector: 'med-list',
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
        TableMedComponent,
        MatTooltipModule
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.scss',
})
export class MedListComponent {
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

    
    meds$: Observable<PageResponse<Med[]>>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _medService: MedService,
        private _fuseConfirmationService: FuseConfirmationService
    ) {
        this.meds$ = this._medService.medLists$.pipe(
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

    onEdit(med: Med): void {
        console.log(med);
        this.onOpenEdit(med.id);
    }

    onDelete(med: Med): void {
        console.log(med);
        this._fuseConfirmationService
            .alertConfirm('ลบข้อมูล', 'คุณต้องการลบข้อมูลนี้ หรือไม่')
            .afterClosed()
            .subscribe((result: boolean) => {
                if (result) {
                    this.deleteMed(med.id);
                }
            });
    }

    deleteMed(id: string): void {
        this._medService
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

    getParameter(): GetMedParameter {
        const param = new GetMedParameter();
        param.limit = this.currPage.limit;
        param.page = this.currPage.page;
        param.sortBy = this.currPage.sortBy;
        param.sortType = this.currPage.sortType;
        param.keyword = this.searchInputControl.value;
        
        console.log(param);
        return param;
    }

    fetchData(): void {
        this._medService
            .getMedLists(this.getParameter())
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
