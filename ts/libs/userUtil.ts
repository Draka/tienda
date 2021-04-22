/* eslint-disable class-methods-use-this */
import { Session } from './session';
import { GetApi } from './get_api';
import { Wompi } from './wompi';
import { Vars } from './vars';

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
    $('.help figure.image_resized').css({
      width: '50%',
      minWidth: '320px',
    });

    $('oembed[url]').each((_i, el) => {
      const ael = document.createElement('a');
      ael.href = $(el).attr('url');
      const urlParams = new URLSearchParams(ael.search);
      let url = '';
      if (ael.host === 'youtube.com' || ael.host === 'www.youtube.com') {
        url = `//${ael.host}/embed/${urlParams.get('v')}`;
      } else if (ael.host === 'youtu.be') {
        url = `//www.youtube.com/embed${ael.pathname}`;
      }
      $(el).html(`<iframe width="100%" height="315" src="${url}" `
      + 'title="YouTube video player" frameborder="0" '
      + 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
      + 'allowfullscreen></iframe>');
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
    $('button.payment--wompi').each((_i, el) => {
      Wompi.btn(this.getApi, $(el));
    });
    $('button.payment--file').on('click', (event) => {
      const $el = $(event.currentTarget);
      const payment = $el.data('payment');
      $('#paymentFileOrder').data('page', `/usuario/pedidos/${$el.data('id')}`);
      $('#redirect').val(`/usuario/pedidos/${$el.data('orderid')}`);
      $('#paymentFileOrderForm').attr('action', `${Vars.urlApi}orders/payment/${$el.data('id')}`);
      $('#paymentName').html(payment.info.name);
      $('#paymentInstructions').html(payment.info.instructions);
      let fields = '';
      $.each(payment.fields, (i, v) => {
        fields += `<div>${payment.info.fields[i].label}: <b>${v.value}</b></div>`;
      });
      $('#paymentFields').html(fields);

      sclib.modalShow('#paymentFileOrder');
    });

    $('.btn-cancel').on('click', () => {
      sclib.modalShow('#cancelOrder');
    });
  }
}
