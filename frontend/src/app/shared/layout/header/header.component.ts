import {Component, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationStart, Router} from "@angular/router";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CartService} from "../../services/cart.service";
import {ProductService} from "../../services/product.service";
import {ProductType} from "../../../../types/product.type";
import {environment} from "../../../../environments/environment";
import {FormControl} from "@angular/forms";
import {debounceTime, filter, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @HostBinding('class.menu-open') get menuOpenClass() {
    return this.menuOpen;
  }

  searchField = new FormControl();
  showedSearch: boolean = false;
  products: ProductType[] = [];
  count: number = 0;
  isLogged: boolean = false;
  menuOpen: boolean = false;
  serverStaticPath = environment.serverStaticPath;
  @Input() categories: CategoryWithTypeType[] = [];

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private productService: ProductService,
              private cartService: CartService) {
    this.isLogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.searchField.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(value => {
        if (value && value.length > 2) {
          this.productService.searchProducts(value)
            .subscribe((data: ProductType[]) => {
              this.products = data;
              this.showedSearch = true;
            });
        } else {
          this.products = [];
        }
      });

    this.authService.isLogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
      });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;
      });

    this.cartService.count$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.count = count;
      });

    // Закрываем меню при навигации
    this.router.events
      .pipe(filter(e => e instanceof NavigationStart), takeUntil(this.destroy$))
      .subscribe(() => this.closeMenu());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    document.body.style.overflow = this.menuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => this.doLogout(),
        error: () => this.doLogout()
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchField.setValue('');
    this.products = [];
    this.showedSearch = false;
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.header-bottom-search')) {
      this.showedSearch = false;
    }
  }
}
