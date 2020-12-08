import { Cart } from './cart';
import { Gtag } from './gtag';

/* eslint-disable class-methods-use-this */
export class StoreUtil {
  gtag = new Gtag()

  constructor() {
    this.prepareBtns();
  }

  prepareBtns() {
    $('.product').each((_i, el) => {
      const $el = $(el);
      $el.find('.add').on('click', () => {
        const cart = new Cart();
        const product = $el.data('product');
        cart.add(product.sku, $el.data('list'), product.store);
      });
      $el.find('a').on('click', (event) => this.gtag.clickItem($(event.currentTarget), $el.data('product'), $el.data('pos'), $el.data('list')));
    });
  }
}
