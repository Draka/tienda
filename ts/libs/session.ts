import { GetApi } from './get_api';

declare const moment: any;

export class Session {
  static session:any = null

  getApi:GetApi

  constructor() {
    this.getApi = new GetApi();
    this.userSession();
  }

  userSession() {
    if (Session.session === null) {
      Session.session = false;
      this.getApi.g('users/me')
        .done((data) => {
          Session.session = data;
          $('.session').show();
          this.launcher('history');
        });
    }
  }

  static product(product: any, xclass: string) {
    if (!product) {
      return `<div class="col ${xclass}"></div>`;
    }
    let html = `<div class="col ${xclass}"><div class="h-100 white-sm white-md white-lg white-xl p-1-sm p-1-md p-1-lg p-1-xl sh-hover-sm sh-hover-md sh-hover-lg sh-hover-xl rd-0-2 oh">`
              + '<div class="h-100 relative mb-0-5">'
              + `<a class="mb-1" href="/tiendas/${product.storeID.slug}/productos/${product.sku}">`
              + '<div class="relative rd-0-5 oh lh-0">'
              + `<img class="w-100 lazy" alt="${product.truncate}" src="${product.imagesSizes[0]['392x392_jpg']}" style="" />`
              + '<div class="absolute top black op-0-05 w-100 h-100"></div>'
              + '</div>'
              + '</a>'
              + '<div class="w-100 mt-1-sm mt-1-md mt-1-lg mt-1-xl">'
              + `<a class="mb-0-25 small b t-gray-2-500" href="/tiendas/${product.storeID.slug}" title="${product.storeID.name}">`
              + `<div class="oh ellipsis nowrap">${product.storeID.name}</div></a>`
              + `<div class="mb-0-25 small eb" style="color: #000000c9" title="${product.name}">`
              + `<div class="oh ellipsis lines-2">${product.name}</div>`
              + '</div>';
    if (product?.offer?.percentage
      && ((product.offer.available.start && moment().isAfter(moment(product.offer.available.start)))
       || !product.offer.available.start)
       && ((product.offer.available.end && moment().isBefore(moment(product.offer.available.end))) || !product.offer.available.end)) {
      html += `<div class="b t-primary">$${product.offer.price} <span class="very-small">(Precio Final)</span></div>`
            + `<div class="b t t-gray-2-500 mb-3">$${product.price} <span class="very-small">(Precio original)</span></div>`
            + `<div class="absolute at-0 ar-0"><div class="m-0-5 info very-small ph-0-25 pw-0-5 rd-0-5">${product.offer.percentage}%</div></div>`;
    } else {
      html += `<div class="b mb-3">$${product.price} <span class="very-small">(Precio Final)</span></div>`;
    }

    html += `<a class="btn btn--primary mt-0-25 small ph-0-25 rd-50 w-100 absolute ab-0" href="/tiendas/${product.storeID.slug}/productos/${product.sku}">¡Lo quiero!</a>`
          + '</div>'
          + '</div>'
          + '</div></div>';

    return html;
  }

  launcher(type: string) {
    if ($('.products-line-history').length) {
      this.getApi.g(`users/${type}`)
        .done((data) => {
          $('.products-line-history').show();
          let html = '';
          if (data.length) {
            for (let index = 0; index < data.length && index < 5; index++) {
              let xclass = '';
              if (index === 2) {
                xclass = 'hide-xs hide-sm ';
              } else if (index === 3) {
                xclass = 'hide-xs hide-sm hide-md';
              } else if (index === 4) {
                xclass = 'hide-xs hide-sm hide-md hide-lg';
              }
              html += Session.product(data[index], xclass);
            }
            $('.products-line-history .data').html(html);
          }
        });
    }
  }
}
