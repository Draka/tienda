import { Cart } from './cart';

interface ErrorInterface {
  responseJSON: any
}

export class ShowMsg {
  // Muestra los errores del back
  static show(errors:any, alert = 'secondary') {
    let em = $('.error-modal');
    if (!em.length) {
      em = $('<div class="error-modal fixed ab-0 w-100 p-3">').hide();
      $('body').append(em);
    }
    em.show();
    if (errors.responseJSON && errors.responseJSON.values) {
      errors = errors.responseJSON.values;
    }

    $.each(errors, (_i, error) => {
      // error de los productos del carro, se pide actualizar
      if (error.code === 1000) {
        // cart.check();
      }
      // id de carro de compras dañado
      if (error.code === 1001) {
        Cart.updateUUID();
      }
      // id de carro de compras procesado
      if (error.code === 1002) {
        Cart.reset();
        setTimeout(() => {
          document.location.href = window.location.origin + window.location.pathname;
        }, 5000);
      }
      const msg = $(`<div class="msg ${alert} p-3 trn-3 op-0">`);
      const close = $('<button class="absolute ar-1 flat small" data-dismiss="modal" aria-label="Cerrar">')
        .html('<span aria-hidden="true">&times;</span>')
        .click(() => {
          msg.removeClass('op-1');
          setTimeout(() => {
            msg.remove();
            if (em.html() === '') {
              em.hide();
            }
          }, 300);
        });

      msg
        .append(close);
      if (error.title) {
        msg
          .append(`<div class="b">${error.title}</div>`);
      }
      msg
        .append(error.msg);

      em.append(msg);
      setTimeout(() => {
        msg.addClass('op-1');
      }, 1);
      setTimeout(() => {
        close.trigger('click');
      }, 5000);
    });
  }
}
