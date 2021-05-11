import { GetApi } from './get_api';

export class Session {
  token: string

  user: any

  constructor() {
    this.token = <string>localStorage.getItem('token');
    try {
      this.user = JSON.parse(<string>localStorage.getItem('user'));

      if (this.token) {
        if (this.user?.personalInfo?.firstname) {
          $('.userFirstname').html(this.user.personalInfo.firstname.split(' ')[0]);
        }
        $('.nologin').hide();
        $('.login').show();
      } else {
        $('.login').hide();
        $('.nologin').show();
      }
    } catch (error) {
      $('.login').hide();
      $('.nologin').show();
    }
  }

  static checkWebpFeature(feature:any, callback:any) {
    const kTestImages:any = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    const img = new Image();
    img.onload = function () {
      const result = (img.width > 0) && (img.height > 0);
      callback(feature, result);
    };
    img.onerror = function () {
      callback(feature, false);
    };
    img.src = `data:image/webp;base64,${kTestImages[feature]}`;
  }
}
