import './libs/define';
import { Edit } from './libs/edit';
import { Util } from './libs/util';
import { ShowMsg } from './libs/show_msg';
import { Amz } from './libs/amz';

declare global {
  // eslint-disable-next-line camelcase
  interface Window { showMsg: any, amz: any}
}

new Edit();
new Util();
Amz.actions();

window.showMsg = ShowMsg.show;
window.amz = Amz.putName;
