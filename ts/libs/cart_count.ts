import '../util/products.d';
import { Gtag } from './gtag';

export class CartCount {
  gtag = new Gtag()

  constructor() {
    this.count();
  }

  stores = {}

  private getCart() {
    try {
      this.stores = JSON.parse(<string>localStorage.getItem('stores'));
    } catch (error) {
      this.stores = {};
    }
  }

  /**
   * Pone el número de productos encima del carrito
   */
  count() {
    this.getCart();
    let number = 0;
    const products: ProducInterface[] = [];
    $.each(this.stores, (_i:any, store: any) => {
      $.each(store?.cart, (_i:any, product: ProducInterface) => {
        number += product.quantity;
        products.push(product);
      });
    });
    $('.num-shopping-cart').html(number.toString()).removeClass('start-hide');
    // $('.link-shopping-cart').click((event) => {
    //   this.gtag.cart1($(event.currentTarget), products);
    // });
  }
}
