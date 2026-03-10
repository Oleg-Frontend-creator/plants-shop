import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  public isLogged: boolean = false;

  private isBrowser: boolean;

  constructor(private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {
    // На сервере localStorage недоступен — проверяем платформу
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isLogged = this.isBrowser ? !!localStorage.getItem(this.accessTokenKey) : false;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  }

  signup(email: string, password: string, passwordRepeat: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      email, password, passwordRepeat
    });
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    return throwError(() => new Error('Cannot find refresh token'));
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    return throwError(() => new Error('Cannot use token'));
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    if (!this.isBrowser) return {accessToken: null, refreshToken: null};
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  get userId(): null | string {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (!this.isBrowser) return;
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }
}
