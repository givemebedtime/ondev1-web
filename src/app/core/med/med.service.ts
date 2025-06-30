import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Med } from './med.type';
import { CreateMedDto } from './dto/create-med.dto';
import { UpdateMedDto } from './dto/update-med.dto';

export interface MedicineStoreCount {
  storeID: string;
  medicineCount: number;
  storeName: string;
  building: string;
  floor: string;
}

@Injectable({ providedIn: 'root' })
export class MedService {
    private _baseMedUrl = '/api/meds';

    readonly apiUrl = {
        medUrl: this._baseMedUrl,
        medWithIdUrl: (id: string): string => `${this._baseMedUrl}/${id}`,
        countByStoreUrl: `${this._baseMedUrl}/count-by-store`,  // เพิ่ม endpoint นี้
    };

    private _httpClient = inject(HttpClient);
    private _medLists: BehaviorSubject<PageResponse<Med[]>> = new BehaviorSubject<PageResponse<Med[]>>(null);
    private _med: BehaviorSubject<Med> = new BehaviorSubject<Med>(null);

    set medLists(value: PageResponse<Med[]>) {
        this._medLists.next(value);
    }

    set med(value: Med) {
        this._med.next(value);
    }

    get medLists$(): Observable<PageResponse<Med[]>> {
        return this._medLists.asObservable();
    }

    get med$(): Observable<Med> {
        return this._med.asObservable();
    }

    getMedLists(param: SearchParameter): Observable<PageResponse<Med[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Med[]>>(this.apiUrl.medUrl,options).pipe(
            tap((med) => {
                this._medLists.next(med);
            })
        );
    }

    getMedById(id: string): Observable<Med> {
        return this._httpClient.get<Response<Med>>(this.apiUrl.medWithIdUrl(id)).pipe(
            map((m: Response<Med>) => m.item),
            tap((med) => {
                this._med.next(med);
            })
        );
    }

    create(body: CreateMedDto): Observable<any> {
        return this._httpClient.post(this.apiUrl.medUrl, body);
    }

    update(id: string, body: UpdateMedDto): Observable<any> {
        return this._httpClient.put(this.apiUrl.medWithIdUrl(id), body);
    }

    delete(id: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.medWithIdUrl(id));
    }

    // เพิ่ม method สำหรับดึงข้อมูลจำนวนยาแยกตาม store
    getMedicineCountByStore(): Observable<MedicineStoreCount[]> {
        return this._httpClient.get<MedicineStoreCount[]>(this.apiUrl.countByStoreUrl);
    }
}
