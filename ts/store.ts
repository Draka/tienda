import './libs/define';
import { Util } from './libs/userUtil';
import { StoreUtil } from './libs/storeUtil';
import { CartCount } from './libs/cart_count';
import { ProductCategory } from './libs/products_category';

new Util();
new StoreUtil();
new CartCount();
new ProductCategory();
ProductCategory.originalImage();
