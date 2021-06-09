import { GetApi } from './get_api';

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

  static product(product: any) {
    return `${'<div class="col">'
    + '<div class="h-100 white-sm white-md white-lg white-xl p-1-sm p-1-md p-1-lg p-1-xl sh-hover-sm sh-hover-md sh-hover-lg sh-hover-xl rd-0-2 oh">'
    + '<div class="h-100 relative mb-0-5">'
    + '<a class="mb-1" href="/tiendas/test-1/productos/udfji-249">'
    + '<div class="relative rd-0-5 oh lh-0">'
    + '<img class="w-100" alt="'}${product.truncate}" src="${product.imagesSizes[0]['392x392_jpg']}" />`
    + '<div class="absolute top black op-0-05 w-100 h-100"></div>'
                + '</div>'
            + '</a>'
            + '<div class="w-100 mt-1-sm mt-1-md mt-1-lg mt-1-xl">'
            + `<a class="mb-1" href="/tiendas/test-1/productos/udfji-249" title="${product.name}">`
            + `<div class="small oh ellipsis lines-2 mb-0-5">${product.name}</div>`
            + '<div class="b t t-gray-2">$120,000</div>'
            + '<div class="b t-primary">$90,000</div>'
            + '</a>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';
  }

  launcher(type: string) {
    if ($('.products-line-history').length) {
      this.getApi.g(`users/${type}`)
        .done((data) => {
          let html = '';
          for (let index = 0; index < data.length || index < 5; index++) {
            html += Session.product(data[index]);
          }
          $('.products-line-history').html(html);
        });
    }
  }
}
