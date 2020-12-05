/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-void */
/* eslint-disable class-methods-use-this */
import '../util/sclib.d';
import { Vars } from './vars';

export class GetApi {
  h = {}

  constructor(
    token: string
  ) {
    if (token) {
      this.h = {
        Authorization: `bearer ${token}`
      };
    }
  }

  /**
   * GET: api la ruta de la tienda
   * @param path ruta del api
   * @param store Opcional, tienda activa
   */
  gs(path: string, store = Vars.store) {
    return this.g(`${store}/${path}`);
  }

  g(path: string) {
    return sclib.ajax({
      url: Vars.urlApi + path,
      type: 'GET',
      headers: this.h
    });
  }

  /**
   * POST: api la ruta de la tienda
   * @param path ruta del api
   * @param data Opcional, data
   */
  ps(path: string, data = {}) {
    return this.p(`${Vars.store}/${path}`, data);
  }

  p(path: string, data = {}) {
    return sclib.ajax({
      url: Vars.urlApi + path,
      type: 'POST',
      headers: this.h,
      data: JSON.stringify(data)
    });
  }
}
