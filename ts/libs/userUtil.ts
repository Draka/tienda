/* eslint-disable class-methods-use-this */
import { Wompi } from './wompi';

export class Util {
  constructor() {
    this.lazy();
    this.showDetailOrder();
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

  showDetailOrder() {
    $('button.payment').each((_i, el) => {
      Wompi.btn($(el));
    });
  }
}
