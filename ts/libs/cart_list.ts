import { Cart } from './cart';
import { Product } from './product';
import { Vars } from './vars';
import { GetApi } from './get_api';
import { Session } from './session';
import { Gtag } from './gtag';
import { ShowMsg } from './show_msg';

export class CartList {
  cart:Cart= new Cart()

  gtag: Gtag = new Gtag()

  session = new Session();

  paymentsMethods = {}

  getApi:GetApi

  sum = { subtotal: 0, shipping: 0, total: 0 }

  constructor() {
    this.session = new Session();
    this.getApi = new GetApi(this.session.token);
  }

  putTotals() {
    // Valor del sub total
    $('.cart-subtotal').html(Vars.formatMoney(this.sum.subtotal));
    // Valor del sub total
    this.sum.shipping = 0;
    $.each(this.cart.stores, (i) => {
      const val = parseFloat($(`input[name="shipping-methods-${i}"]:checked`).data('price'));
      if (val) {
        this.sum.shipping += val;
      }
    });
    $('.cart-shipping').html(Vars.formatMoney(this.sum.shipping));
    // Valor del sub total
    this.sum.total = this.sum.subtotal + this.sum.shipping;
    $('.cart-total').html(Vars.formatMoney(this.sum.total));
  }

  static showAddresss() {
    $('.cart-screen-adrress').show();
    $('.show-addresss').on('click', () => {
      sclib.modalShow('#address');
    });
  }

  showCart() {
    let valid = false;
    $('.cart-list').each((_i, el) => {
      const $el = $(el);
      $el.html('');
      // Dibuja en la pantalla de vista de productos
      $.each(this.cart.stores, (i, elem) => {
        const slug = <string>i;
        if (Object.keys(elem.cart).length) {
          valid = true;
          const lineStore = $(`<div id="cart_${slug}" class="mb-5">`)
            .append(`<div class="title">Pedido de: ${elem.name}</div>`);

          const desktop = $('<table class="table table--striped small hide-xs">')
            .append('<thead><tr>'
          + '<th>&nbsp;</th>'
          + '<th colspan="2" class="tc">PRODUCTO</th>'
          + '<th class="tr">PRECIO</th>'
          + '<th class="tc">CANTIDAD</th>'
          + '<th class="tr">SUBTOTAL</th>'
          + '</tr></thead>');
          // Mobile
          const mobile = $('<div class="mobile show-xs">');

          $.each(elem.cart, (sku, product) => {
            const img = Product.img(product, ['48x48', '96x96']);
            const remove = $('<button class="btn btn--secondary small">')
              .html('<i class="fas fa-times hand"></i>')
              .click(() => {
                this.cart.remove(product.sku, `${slug}/page_cart`, slug);
              });

            const add = $('<button class="btn btn--secondary small mr-0-25">')
              .html('<i class="fas fa-plus"></i><span class="out-screen">Aumentar cantidad</span>')
              .click(() => {
                this.cart.add(<string>sku, `${slug}/page_cart`, slug);
              });

            const minus = $('<button class="btn btn--secondary small mr-0-25">')
              .html('<i class="fas fa-minus"></i><span class="out-screen">Disminuir cantidad</span>')
              .click(() => {
                this.cart.minus(<string>sku, `${slug}/page_cart`, slug);
              });
            const controls = $('<div class="box-controls flex justify-content-center">')
              .append(minus.clone(true, true))
              .append(`<div class="value w-48p mr-0-25 tc b p-0-25 br-1 rd-0-2 h-100">${product.quantity}</div>`)
              .append(add.clone(true, true));
            // Desktop
            desktop
              .append($('<tr>')
                .append($('<td>').append(remove.clone(true, true)))
                .append(
                  `<td class="w-48p">${img}</td>`
                  + `<td><div class="b">${product.name}</div></td>`
                  + `<td class="tr">${Vars.formatMoney(product.price)}</td>`,
                )
                .append(
                  $('<td class="tr">').append(controls.clone(true, true)),
                )
                .append(`<td class="tr t-secondary b">${Vars.formatMoney(product.quantity * product.price)}</td>`));
            // Mobile
            mobile
              .append(
                $('<table class="table table--striped small">')
                  .append(`<tr><th class="h-img-48">${img}</th><td class="b big">${product.name}</td></tr>`)
                  .append(
                    $('<tr>')
                      .append(`<th class="b">PRECIO</th><td class="t-secondary tr">${Vars.formatMoney(product.price)}</td>`),
                  )
                  .append(
                    $('<tr>')
                      .append('<th class="b">CANTIDAD</th>')
                      .append($('<td>').append(controls.clone(true, true))),
                  )
                  .append(
                    $('<tr>')
                      .append(`<th class="b">SUBTOTAL</th><td class="t-secondary tr b">${Vars.formatMoney(product.quantity * product.price)}</td>`),
                  ),
              );
          });

          lineStore
            .append(desktop)
            .append(mobile);

          $el.append(lineStore);
        }
      });
      (<any>$el.find('.lazy')).Lazy();
      this.cart.subtotal();
    });

    $('.btn-cart1').click((event) => {
      const products: Array<ProducInterface> = [];
      $.each(this.cart.stores, (_i, elem) => {
        $.each(elem.cart, (_sku, product) => {
          products.push(product);
        });
      });

      this.gtag.cart1($(event.currentTarget), products);
    });

    if (valid) {
      $('.cart-screen').removeClass('hide');
      $('.cart-empty').addClass('hide');
    } else {
      $('.cart-screen').addClass('hide');
      $('.cart-empty').removeClass('hide');
    }
  }

  fixProductsInCart() {
    const list = $('.cart-list-address');
    if (list.length) {
      list.html('');
      this.sum.subtotal = 0;

      $.each(this.cart.stores, (i, elem) => {
        if (Object.keys(elem.cart).length === 0) {
          return;
        }
        const slug = <string>i;
        this.getApi.p(`stores/${i}/services/check-cart`, { items: elem.cart })
          .done((data: any) => {
            let valid = false;
            this.cart.stores[i].cart = data.validateItems.items;
            this.cart.set();
            // pinta los productos
            let lineStore = `<div id="cart_${slug}" class="mt-1">`
              + `<div class="b">${elem.name}</div>`;

            lineStore += '<table class="table table--striped small">'
                + '<thead>'
                + '<tr>'
                + '<th class="tc">PRODUCTO</th>'
                + '<th class="tr">SUBTOTAL</th>'
                + '</tr>'
                + '</thead>';
            $.each(data.validateItems.items, (sku, product) => {
              valid = true;
              // Desktop
              lineStore += '<tr>'
                      + `<td><span class="b">${product.name}</span> (${product.quantity})</td>`
                      + `<td class="tr t-secondary">${Vars.formatMoney(product.quantity * product.price)}</td>`;
              this.sum.subtotal += product.quantity * product.price;
            });
            lineStore += '</table></div>';
            list.append(lineStore);
            // muestra totales
            this.putTotals();

            if (valid) {
              $('.cart-screen-adrress').removeClass('hide');
              $('.cart-empty').addClass('hide');
            } else {
              $('.cart-screen-adrress').addClass('hide');
              $('.cart-empty').removeClass('hide');
            }
          });
      });
    }
  }

  showStepAddress() {
    let valid = false;
    const list = $('.cart-list-availability');
    if (list.length) {
      $('.cart-list-availability').each((_i, el) => {
        const $el = $(el);
        $el.html('');

        // Dibuja en la pantalla de vista de productos
        $.each(this.cart.stores, (i, store) => {
          if (Object.keys(store.cart).length === 0) {
            return;
          }
          valid = true;
          const details = `<div id="step-store-${i}" class="white br-1 rd-0-2 p-1 mt-1">`
          + `<div class="title">${store.name}</div>`
          + '<div class="hr"></div>'
          + '<div class="subtitle b mt-0-25">Método de envío</div>'
          + '<div class="shipping-methods"><div class="bigx2"><i class="fas fa-sync fa-spin"></i></div></div>'
          + '<div class="subtitle b mt-0-25">Método de pago</div>'
          + '<div class="payments-methods"><div class="bigx2"><i class="fas fa-sync fa-spin"></i></div></div>'
          + '</div>';
          $el.append(details);
          // busca en el api los métodos de envío
          this.getApi.p(`stores/${i}/services/search-shipping-methods`, Cart.getAddressJSON())
            .done((data: any) => {
              let m = '';
              $.each(data.shippingMethods, (k, methods) => {
                if ((data.inArea && methods.personalDelivery) || !methods.personalDelivery) {
                  m += `<div class="mt-1 mb-1 ml-1 small"><label data-payments='${JSON.stringify(methods.payments)}'>`
                  + `<input id="r-shipping-methods-${i}-${<string>k}" type="radio" class="radio" name="shipping-methods-${i}" `
                  + `value="${methods.slug}" data-price="${methods.price}" ${k === 0 ? 'checked="checked"' : ''}>`
                  + `<span>${methods.name}</span> - <span class="t-secondary">${Vars.formatMoney(methods.price)}</span></label>`
                  + `<div class="remark">${methods.description}</div>`
                  + '</div>';
                }
              });
              $el.find(`#step-store-${i} .shipping-methods`).html(m)
                .find('label').on('click', (event) => {
                  const list = $(event.currentTarget).data('payments');
                  this.showStepAddressPayment($el, i, list);
                  this.putTotals();
                });

              // busca en el api los métodos de pago
              this.getApi.p(`stores/${i}/services/search-payments-methods`, { shippingMethod: $(`input[name="shipping-methods-${i}"]`).val() })
                .done((data: any) => {
                  this.paymentsMethods[i] = data.paymentsMethods;
                  $el.find(`#step-store-${i} .shipping-methods`).find('label').first().trigger('click');
                });
            });
        });
      });
    }
    $('.btn-cart2').on('click', () => {
      // Mira la dirección
      const address = Cart.getAddressJSON();
      if (this.checkAddress() && !address.address) {
        return sclib.modalShow('#address');
      }
      const errors: Array<string> = [];
      $('.errors-cart2').html('');
      $.each(this.cart.stores, (i, store) => {
        if (Object.keys(store.cart).length === 0) {
          return;
        }
        if (!$(`input[name="shipping-methods-${i}"]:checked`).val()) {
          errors.push(`Seleccione el Método de Envío para <b>${store.name}</b>`);
        }
        this.cart.stores[i].shipping = $(`input[name="shipping-methods-${i}"]:checked`).val();
        if (!$(`input[name="payments-methods-${i}"]:checked`).val()) {
          errors.push(`Seleccione el Método de Pago para <b>${store.name}</b>`);
        }
        this.cart.stores[i].payment = $(`input[name="payments-methods-${i}"]:checked`).val();
      });
      // if (!$('#pptu').is(':checked')) {
      //   errors.push('Debes aceptar <b>la Política de privacidad y los Términos de uso*</b>');
      // }
      if (errors.length) {
        $.each(errors, (i, error) => {
          $('.errors-cart2').append(`<div class="msg error">${error}</div>`);
        });
        ShowMsg.show(errors);
        return;
      }
      $('.errors-cart2').hide();

      // Manda a back
      this.getApi.p('orders', {
        stores: this.cart.stores,
        cartID: this.cart.getCartID(),
        address,
        pptu: $('#pptu').is(':checked'),
      })
        .done((data: any) => {
          Cart.reset();
          document.location.href = `${window.location.origin}/carrito-resumen`;
        })
        .fail(ShowMsg.show);
    });
    if (valid) {
      $('.cart-screen-adrress').removeClass('hide');
      $('.cart-empty').addClass('hide');
    } else {
      $('.cart-screen-adrress').addClass('hide');
      $('.cart-empty').removeClass('hide');
    }
  }

  showStepAddressPayment($el, i, list) {
    let m = '';

    $.each(list, (k, slug) => {
      const methods = this.paymentsMethods[i].find((o) => o.slug === slug);
      if (methods) {
        m += '<div class="mh-1 ml-1 small"><label>'
        + `<input id="r-payments-methods-${i}-${<string>k}" type="radio" class="radio"  name="payments-methods-${i}" `
        + `value="${methods.slug}" data-price="${methods.price}" ${k === 0 ? 'checked="checked"' : ''}>`
        + `<span>${methods.name}</span></label>`
        + `<div class="remark">${methods.description}</div>`
        + '</div>';
      }
    });
    $el.find(`#step-store-${i} .payments-methods`).html(m);
  }

  checkAddress() {
    let checkAddress = false;
    $.each(this.cart.stores, (i, store) => {
      if (Object.keys(store.cart).length === 0) {
        return;
      }
      $.each(store.cart, (i, product) => {
        if (!product.digital?.is) {
          checkAddress = true;
        }
      });
    });
    return checkAddress;
  }
}
