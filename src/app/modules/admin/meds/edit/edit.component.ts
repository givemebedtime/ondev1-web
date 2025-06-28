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
import { MedService } from 'app/core/med/med.service';
import { Med } from 'app/core/med/med.type';
import { CreateMedDto } from 'app/core/med/dto/create-med.dto';
import { UpdateMedDto } from 'app/core/med/dto/update-med.dto';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { MedListComponent } from '../list/list.component';

@Component({
    selector: 'app-edit-med',
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
export class EditMedComponent implements OnInit {
    isEdit: boolean = false;
    initForm: FormGroup = null;
    medId: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    disableSave: boolean = false;

    get name() {
        return this.initForm.get('name');
    }

    constructor(
        private _formBuilder: FormBuilder,
        private _listMedComponent: MedListComponent,
        private _router: Router,
        private _route: ActivatedRoute,
        private _medService: MedService,
        private _fuseConfirmationService: FuseConfirmationService,
        private cdr: ChangeDetectorRef
    ) {
        this.medId = this._route.snapshot.paramMap.get('id');
        this.isEdit = !!this.medId;
    }

    ngOnInit(): void {
        this._listMedComponent.matDrawer.open();

        this._medService.med$
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe((resp: Med) => {
                console.log(resp);
                this.initForm = this.initialForm(resp);
            });
    }

    initialForm(med?: Med): FormGroup {
        return this._formBuilder.group(
            {
                medID: [med?.medID || '', [Validators.required]],
                medName: [med?.medName || '', [Validators.required]],
                storeID: [med?.storeID || '', [Validators.required]],
                location: [med?.location || 0, [Validators.required]],
            }
        );
    }


    onSave(): void {
        this.disableSave = true;
        const payload = this.initForm.getRawValue();
        if (this.isEdit) {
            this.update(this.medId, payload);
        } else {
            this.create(payload);
        }
    }

    create(body: CreateMedDto): void {
        this._medService
            .create(body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listMedComponent.fetchData();
                    this.onClose();
                    this._fuseConfirmationService.alertSuccess();
                },
                error: (err) => {
                    this.disableSave = false;
                    this.cdr.detectChanges();
                },
            });
    }

    update(id: string, body: UpdateMedDto): void {
        this._medService
            .update(id, body)
            .pipe(takeUntil(this._unsubscribeAll), debounceTime(300))
            .subscribe({
                next: (res) => {
                    this._listMedComponent.fetchData();
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
        return this._listMedComponent.matDrawer.close();
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
