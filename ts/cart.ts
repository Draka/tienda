import './libs/define';
import { CartCount } from './libs/cart_count';
import { CartList } from './libs/cart_list';
import { Cart } from './libs/cart';

new CartCount();
const cartList = new CartList();
cartList.showCart();

cartList.showStepAddress();
cartList.fixProductsInCart();
CartList.showAddresss();
Cart.prepareFormAddress();
