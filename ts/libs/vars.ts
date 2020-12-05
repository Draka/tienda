import '../util/products.d';

export class Vars {
  static b = $('body');

  static urlSite: string = Vars.b.data('urlSite')

  static urlApi: string = Vars.b.data('urlApi')

  static urlS3: string = Vars.b.data('urlS3')

  static urlS3Images: string = Vars.b.data('urlS3Images');

  static imgNoAvailable= `${Vars.urlS3}common/images/imagen_no_disponible.svg`;

  static store= Vars.b.data('store')

  static place= Vars.b.data('defaultPlace')

  static badge(input: string) {
    const status:any = {
      created: 'Creado',
      paid: 'Pagado',
      cancelled: 'Cancelado',
      cancelledAdmin: 'Cancelado',
      picking: 'Buscando Productos',
      ready: 'Listo Para Envíar',
      onway: 'En Camino',
      arrived: 'Llegó',
      missing: 'No Respondieron',
      completed: 'Completado',
    };
    const color:any = {
      created: 'primary',
      paid: 'alert',
      cancelled: 'error',
      cancelledAdmin: 'error',
      picking: 'alert',
      ready: 'info',
      onway: 'info',
      arrived: 'info',
      missing: 'error',
      completed: 'action',
    };
    return `<span class="badge ${color[input]} inline">${status[input]}</span>`;
  }

  static payment(orderID: string) {
    return `<button class="primary small id_${orderID} w-100">Pagar</button>`;
  }

  static statusToDate(arr:Array<any>, status: string) {
    const st = arr.filter((s) => s.status === status);
    if (!st.length) {
      return '';
    }
    return Vars.format(st[0].date);
  }

  static format(str:string) {
    if (!str) return '';
    const days = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const d = new Date();
    d.setTime(Date.parse(str));
    return `${d.getDate()} de ${days[d.getMonth()]} de ${d.getFullYear()}`;
  }

  static formatMoney(number:number, decPlaces = 0, simbol = '$', decSep = ',', thouSep = '.') {
    const re = `\\d(?=(\\d{${3}})+${decPlaces > 0 ? '\\D' : '$'})`;
    // eslint-disable-next-line no-bitwise
    const num = number.toFixed(Math.max(0, ~~decPlaces));
    return simbol + num.replace('.', thouSep).replace(new RegExp(re, 'g'), `$&${decSep}`);
  }

  static getParameterByName(name:string, url:string = window.location.href) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  static capitalize(input: string) {
    return input[0].toUpperCase() + input.slice(1);
  }
}
