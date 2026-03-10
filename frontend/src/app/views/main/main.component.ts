import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {ProductService} from "../../shared/services/product.service";
import {ProductType} from "../../../types/product.type";
import {OwlOptions} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isBrowser: boolean;
  products: ProductType[] = [];

  customOptionsProduct: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 24,
    navText: ['', ''],
    responsive: {
      0:    { items: 1 },
      480:  { items: 2 },
      700:  { items: 2 },
      900:  { items: 3 },
      1100: { items: 3 },
      1240: { items: 4 }
    },
    nav: false
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    margin: 26,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1100: {
        items: 3
      }
    },
    nav: false
  };

  reviews = [
    {
      name: 'Ирина',
      image: 'review-1.webp',
      text: 'В ассортименте я встретила все комнатные растения, которые меня интересовали. Цены - лучшие в городе. Доставка - очень быстрая и с заботой о растениях. '
    },
    {
      name: 'Анастасия',
      image: 'review-2.webp',
      text: 'Спасибо огромное! Цветок арека невероятно красив - просто бомба! От него все в восторге! Спасибо за сервис - все удобно сделано, доставили быстро. И милая открыточка приятным бонусом.'
    },
    {
      name: 'Илья',
      image: 'review-3.webp',
      text: 'Магазин супер! Второй раз заказываю курьером, доставлено в лучшем виде. Ваш ассортимент комнатных растений впечатляет! Спасибо вам за хорошую работу!'
    },
    {
      name: 'Станислав',
      image: 'review-4.webp',
      text: 'Хочу поблагодарить консультанта Ирину за помощь в выборе цветка для моей жены. Я ещё никогда не видел такого трепетного отношения к весьма непростому клиенту, которому сложно угодить! Сервис – огонь!'
    },
    {
      name: 'Марина',
      image: 'review-5.webp',
      text: 'Для меня всегда важным аспектом было наличие не только физического магазина, но и онлайн‐маркета, ведь не всегда есть возможность прийти на место. Ещё нигде не встречала такого огромного ассортимента!'
    },
    {
      name: 'Яника',
      image: 'review-6.webp',
      text: 'Спасибо большое за мою обновлённую коллекцию суккулентов! Сервис просто на 5+: быстро, удобно, недорого. Что ещё нужно клиенту для счастья?'
    },
    {
      name: 'Аделина',
      image: 'review-7.webp',
      text: 'Хочу поблагодарить всю команду за помощь в подборе подарка для моей мамы! Все просто в восторге от мини‐сада! А самое главное, что за ним удобно ухаживать, ведь в комплекте мне дали целую инструкцию.'
    },
  ]

  constructor(private productService: ProductService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.productService.getBestProducts()
      .subscribe((data: ProductType[]) => {
        this.products = data;
      });
  }

}
