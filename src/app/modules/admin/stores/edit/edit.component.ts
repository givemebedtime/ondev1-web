import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { StoreService } from 'app/core/store/store.service';
import { Store } from 'app/core/store/store.type';
import { CreateStoreDto } from 'app/core/store/dto/create-store.dto';
import { UpdateStoreDto } from 'app/core/store/dto/update-store.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { StoreListComponent } from '../list/list.component';

@Component({
    selector: 'app-edit-store',
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
    ],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.scss',
})
export class EditStoreComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup = null;
    storeId: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    get name() {
        return this.initForm.get('name');
    }

    constructor(
        private _formBuilder: FormBuilder,
        private _listStoreComponent: StoreListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _storeService: StoreService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.storeId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.storeId;
    }

    ngOnInit(): void {
        this._listStoreComponent.matDrawer.open();

        this._storeService.store$
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((resp: Store) => {
                console.log(resp);
                this.initForm = this.initialForm(resp);
            });
    }

    initialForm(store?: Store): FormGroup {
        return this._formBuilder.group(
            {
                storeID: [store?.storeID || '', [Validators.required]],
                storeName: [store?.storeName || '', [Validators.required]],
                building: [store?.building || '', [Validators.required]],
                floor: [store?.floor || '', [Validators.required]],
            }
        );
    }


    onSave(): void {
        this.disableSave = true;
        const payload = this.initForm.getRawValue();
        if (this.isEdit) {
            this.update(this.storeId, payload);
        } else {
            this.create(payload);
        }
    }

    create(body: CreateStoreDto): void {
        this._storeService
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listStoreComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    update(id: string, body: UpdateStoreDto): void {
        this._storeService
            .update(id, body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listStoreComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._listStoreComponent.matDrawer.close();
    }

    onClose(): void {
        if (this.isEdit) {
            this.backFromUpdate();
        } else {
            this.backFromCreate();
        }
    }

    backFromCreate(): void {
        this._router.navigate(['../'], { relativeTo: this._route });
    }

    backFromUpdate(): void {
        this._router.navigate(['../../'], { relativeTo: this._route });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
