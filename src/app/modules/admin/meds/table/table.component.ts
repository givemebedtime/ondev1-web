import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Med } from 'app/core/med/med.type';
import { UpdateMedDto } from 'app/core/med/dto/update-med.dto';
import { PageResponse } from 'app/core/base/pageResponse.types';

@Component({
    selector: 'app-table-med',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIcon,
        MatMenuModule,
        MatSelectModule,
    ],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
})
export class TableMedComponent implements OnChanges {
    @ViewChildren('selectStatus') selectStatues: QueryList<MatSelect>;

    @Input() medResp: PageResponse<Med[]>;
    @Output() delete: EventEmitter<Med> = new EventEmitter<Med>(null);
    @Output() edit: EventEmitter<Med> = new EventEmitter<Med>(null);
    @Output() updateStatus: EventEmitter<{id: string, body: UpdateMedDto}> = new EventEmitter<{id: string, body: UpdateMedDto}>(null);
    @Output() changePage: EventEmitter<PageEvent> = new EventEmitter<PageEvent>(
        null
    );

    displayedColumns: string[] = [
        'id',
        'name',
        'edit'
    ];
    dataSource: Med[] = [];

    constructor(
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.dataSource = this.medResp.items;
    }

    onChangePage(event: PageEvent) {
        event.pageIndex = event.pageIndex + 1;
        this.changePage.emit(event);
    }
}
