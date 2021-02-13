import './libs/define';
import { Edit } from './libs/edit';
import { Util } from './libs/util';
import { ShowMsg } from './libs/show_msg';

declare global {
  // eslint-disable-next-line camelcase
  interface Window { showMsg: any;}
}

new Edit();
new Util();

window.showMsg = ShowMsg.show;
