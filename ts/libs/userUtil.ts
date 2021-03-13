/* eslint-disable class-methods-use-this */
import { Session } from './session';
import { GetApi } from './get_api';
import { Wompi } from './wompi';

export class Util {
  session = new Session();

  getApi:GetApi

  constructor() {
    this.session = new Session();
    this.getApi = new GetApi(this.session.token);
    this.lazy();
    this.showDetailOrder();
    this.scrollClick();
    this.figure();
  }

  figure() {
    $('help figure.image_resized').css({
      width: '50%',
      minWidth: '320px',
    });
  }

  scrollClick() {
    $('.scroll-click').on('click', (event) => {
      const $el = $(event.currentTarget);
      const pl = $($el.data('target'));
      const ll = pl.find('> ul li').first().width();
      pl.scrollLeft(ll * $el.index());
    });
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
      Wompi.btn(this.getApi, $(el));
    });

    $('.btn-cancel').on('click', () => {
      sclib.modalShow('#cancelOrder');
    });
  }
}
