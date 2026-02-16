import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FavoriteType} from "../../../types/favorite.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) {
  }

  getFavorites(): Observable<FavoriteType[] | DefaultResponseType> {
    return this.http.get<FavoriteType[] | DefaultResponseType>(environment.api + 'favorites');
  }

  removeFavorite(productId: string): Observable<DefaultResponseType> {
    return this.http.delete<DefaultResponseType>(environment.api + 'favorites', {
      body: { productId },
      headers: new HttpHeaders().set('x-skip-loader', 'true')
    });
  }

  addFavorite(productId: string): Observable<FavoriteType | DefaultResponseType> {
    return this.http.post<FavoriteType | DefaultResponseType>(environment.api + 'favorites',
      {productId},
      {headers: new HttpHeaders().set('x-skip-loader', 'true')}
    );
  }
}
