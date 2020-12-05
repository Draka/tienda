import { Cart } from './cart';
import { Gtag } from './gtag';

/* eslint-disable class-methods-use-this */
export class Util {
  gtag = new Gtag()

  constructor() {
    this.lazy();
    this.prepareBtns();
  }

  lazy() {
    const webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    (<any>$('.lazy')).Lazy({
      beforeLoad(element: any) {
        if (webp) {
          element.attr('data-src', element.data('src').replace('.jpg', '.webp'));
          if (element.data('retina')) {
            element.attr('data-retina', element.data('retina').replace('.jpg', '.webp'));
          }
        }
      },
    });
  }

  prepareBtns() {
    $('.product').each((_i, el) => {
      const $el = $(el);
      $el.find('.add').on('click', () => {
        const cart = new Cart();
        const product = $el.data('product');
        cart.add($el.data('sku'), $el.data('list'), product.store);
      });
      $el.find('a').on('click', (event) => this.gtag.clickItem($(event.currentTarget), $el.data('product'), $el.data('pos'), $el.data('list')));
    });
  }
}
