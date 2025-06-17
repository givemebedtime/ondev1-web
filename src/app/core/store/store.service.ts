import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject, tap, of } from 'rxjs';
import { PageResponse } from '../base/pageResponse.types';
import { Response } from '../base/response.types';
import { SearchParameter } from '../base/parameters/searchParameter.entity';
import { Store } from './store.type';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable({ providedIn: 'root' })
export class StoreService {
    private _baseStoreUrl = '/api/stores';

    readonly apiUrl = {
        storeUrl: this._baseStoreUrl,
        storeWithIdUrl: (id: string): string => `${this._baseStoreUrl}/${id}`
    };

    private _httpClient = inject(HttpClient);
    private _storeLists: BehaviorSubject<PageResponse<Store[]>> = new BehaviorSubject<PageResponse<Store[]>>(null);
    private _store: BehaviorSubject<Store> = new BehaviorSubject<Store>(null);

    set storeLists(value: PageResponse<Store[]>) {
        this._storeLists.next(value);
    }

    set store(value: Store) {
        this._store.next(value);
    }


    get storeLists$(): Observable<PageResponse<Store[]>> {
        return this._storeLists.asObservable();
    }

    get store$(): Observable<Store> {
        return this._store.asObservable();
    }

    getStoreLists(param: SearchParameter): Observable<PageResponse<Store[]>> {
        let options = {
            params: param.toHttpParams()
        };
        return this._httpClient.get<PageResponse<Store[]>>(this.apiUrl.storeUrl,options).pipe(
            tap((store) => {
                this._storeLists.next(store);
            })
        );
    }

    getStoreById(id: string): Observable<Store> {
        return this._httpClient.get<Response<Store>>(this.apiUrl.storeWithIdUrl(id)).pipe(
            map((m: Response<Store>) => m.item),
            tap((store) => {
                this._store.next(store);
            })
        );
    }

    create(body: CreateStoreDto): Observable<any> {
        return this._httpClient.post(this.apiUrl.storeUrl, body);
    }

    update(id: string, body: UpdateStoreDto): Observable<any> {
        return this._httpClient.put(this.apiUrl.storeWithIdUrl(id), body);
    }

    delete(id: string): Observable<any> {
        return this._httpClient.delete(this.apiUrl.storeWithIdUrl(id));
    }
}
