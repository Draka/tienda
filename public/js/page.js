/**
 * Aunque no lo crea, este script permite usar la funcionalidad de ts que exporta a un solo archivo
 * usarse en una página sin cargar módulos, sin complejidad y con menos líneas
 */
var System = {
    functions: {},
    register: function (name, requires, cb) {
        System.functions[name] = { requires: requires, cb: cb };
    },
    active: function () {
        $.each(System.functions, function (name, fc) {
            var m = fc.cb(function (nameClass, fcClass) {
                fc[nameClass] = fcClass;
            }, { id: name });
            $.each(m.setters, function (i, fcs) {
                fcs(System.functions[fc.requires[i]]);
            });
            m.execute();
        });
    }
};
System.register("libs/wompi", [], function (exports_1, context_1) {
    "use strict";
    var Wompi;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            Wompi = /** @class */ (function () {
                function Wompi() {
                }
                Wompi.btn = function (obj) {
                    var order = obj.data('order');
                    if (!order.ref) {
                        return;
                    }
                    obj.on('click', function (event) {
                        event.stopPropagation();
                        var checkout = new WidgetCheckout({
                            currency: 'COP',
                            amountInCents: order.total * 100,
                            reference: "" + order.ref,
                            publicKey: Wompi.key,
                        });
                        checkout.open(function (result) {
                            setTimeout(function () {
                                document.location.href = window.location.origin + window.location.pathname;
                            }, 3000);
                        });
                    });
                };
                Wompi.key = 'pub_test_Utcl6o6rEhg8FHIhmI37vLFI16EjGSCc';
                return Wompi;
            }());
            exports_1("Wompi", Wompi);
        }
    };
});
System.register("libs/userUtil", ["libs/wompi"], function (exports_2, context_2) {
    "use strict";
    var wompi_1, Util;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (wompi_1_1) {
                wompi_1 = wompi_1_1;
            }
        ],
        execute: function () {
            Util = /** @class */ (function () {
                function Util() {
                    this.lazy();
                    this.showDetailOrder();
                }
                Util.prototype.lazy = function () {
                    var webp = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
                    $('.lazy').Lazy({
                        beforeLoad: function (element) {
                            if (webp) {
                                element.attr('data-src', element.data('src').replace('.jpg', '.webp'));
                                if (element.data('retina')) {
                                    element.attr('data-retina', element.data('retina').replace('.jpg', '.webp'));
                                }
                            }
                        },
                    });
                };
                Util.prototype.showDetailOrder = function () {
                    $('button.payment').each(function (_i, el) {
                        wompi_1.Wompi.btn($(el));
                    });
                };
                return Util;
            }());
            exports_2("Util", Util);
        }
    };
});
System.register("libs/gtag", ["../util/products.d"], function (exports_3, context_3) {
    "use strict";
    var Gtag;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (_1) {
            }
        ],
        execute: function () {
            window.dataLayer = window.dataLayer || [];
            Gtag = /** @class */ (function () {
                function Gtag() {
                    this.window = window;
                }
                Gtag.prototype.event = function (obj) {
                    if (window.google_tag_manager) {
                        this.window.dataLayer.push(obj);
                    }
                    else if (obj === null || obj === void 0 ? void 0 : obj.eventCallback) {
                        console.log('e gtag');
                        obj.eventCallback();
                    }
                };
                Gtag.prototype.removeItem = function (product, quantity, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: 1,
                        price: product.price,
                        quantity: quantity,
                        store: product.store,
                    });
                    this.event({
                        event: 'removeFromCart',
                        ecommerce: {
                            currencyCode: 'COP',
                            remove: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                    });
                };
                Gtag.prototype.addItem = function (product, quantity, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: 1,
                        price: product.price,
                        quantity: quantity,
                        store: product.store,
                    });
                    this.event({
                        event: 'addToCart',
                        ecommerce: {
                            currencyCode: 'COP',
                            add: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                    });
                };
                /**
                 * Evento para saber cuando se muestra un producto
                 * @param products
                 * @param list
                 */
                Gtag.prototype.list = function (products, list) {
                    var l = [];
                    $.each(products, function (i, product) {
                        l.push({
                            id: product.sku,
                            name: product.name,
                            category: product.categoryText.join('/'),
                            brand: product.brandText,
                            list_name: list,
                            position: i,
                            price: product.price,
                            store: product.store,
                        });
                    });
                    this.event({
                        ecommerce: {
                            currencyCode: 'COP',
                            impressions: l,
                        },
                    });
                };
                /**
                 * Evento para saber cuando alguien le hace click a un producto
                 * @param obj
                 * @param product
                 * @param i
                 * @param list
                 */
                Gtag.prototype.clickItem = function (obj, product, i, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: i,
                        price: product.price,
                        store: product.store,
                    });
                    this.event({
                        event: 'productClick',
                        ecommerce: {
                            currencyCode: 'COP',
                            click: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                        eventCallback: function () {
                            document.location.href = $(obj).attr('href');
                        },
                    });
                    return false;
                };
                Gtag.prototype.viewItem = function (product, list) {
                    var l = [];
                    l.push({
                        id: product.sku,
                        name: product.name,
                        category: product.categoryText.join('/'),
                        brand: product.brandText,
                        list_name: list,
                        position: 1,
                        price: product.price,
                        store: product.store,
                    });
                    this.event({
                        ecommerce: {
                            currencyCode: 'COP',
                            detail: {
                                actionField: { list: list },
                                products: l,
                            },
                        },
                    });
                };
                Gtag.prototype.cart1 = function (obj, products) {
                    var l = [];
                    $.each(products, function (_i, product) {
                        l.push({
                            id: product.sku,
                            name: product.name,
                            category: product.categoryText.join('/'),
                            brand: product.brandText,
                            list_name: 'cart1',
                            position: 1,
                            price: product.price,
                            store: product.store,
                        });
                    });
                    this.event({
                        event: 'checkout',
                        ecommerce: {
                            currencyCode: 'COP',
                            checkout: {
                                actionField: {
                                    step: 1,
                                },
                                products: l,
                            },
                        },
                        eventCallback: function () {
                            document.location.href = $(obj).attr('href');
                        },
                    });
                    return false;
                };
                Gtag.prototype.cart2 = function (obj, typePayment) {
                    this.event({
                        event: 'checkoutOption',
                        ecommerce: {
                            currencyCode: 'COP',
                            checkout_option: {
                                actionField: {
                                    step: 2,
                                    option: typePayment,
                                },
                            },
                        },
                        eventCallback: function () {
                            document.location.href = $(obj).attr('href');
                        },
                    });
                };
                Gtag.prototype.cart3 = function (order, products) {
                    var l = [];
                    $.each(products, function (_i, product) {
                        l.push({
                            id: product.sku,
                            name: product.name,
                            category: product.categoryText.join('/'),
                            brand: product.brandText,
                            list_name: 'cart1',
                            position: 1,
                            price: product.price,
                            store: product.store,
                        });
                    });
                    this.event({
                        event: 'purchase',
                        ecommerce: {
                            currencyCode: 'COP',
                            purchase: {
                                actionField: {
                                    id: order.orderID,
                                    affiliation: order.store.name,
                                    revenue: order.order.subtotal,
                                    tax: 0,
                                    shipping: order.order.shipping,
                                },
                                products: l,
                            },
                        },
                    });
                    return false;
                };
                Gtag.prototype.search = function (searchTerm) {
                    this.event({
                        event: 'search',
                        search_term: searchTerm,
                    });
                };
                return Gtag;
            }());
            exports_3("Gtag", Gtag);
        }
    };
});
System.register("libs/cart_count", ["../util/products.d", "libs/gtag"], function (exports_4, context_4) {
    "use strict";
    var gtag_1, CartCount;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (_2) {
            },
            function (gtag_1_1) {
                gtag_1 = gtag_1_1;
            }
        ],
        execute: function () {
            CartCount = /** @class */ (function () {
                function CartCount() {
                    this.gtag = new gtag_1.Gtag();
                    this.stores = {};
                    this.count();
                }
                CartCount.prototype.getCart = function () {
                    try {
                        this.stores = JSON.parse(localStorage.getItem('stores'));
                    }
                    catch (error) {
                        this.stores = {};
                    }
                };
                /**
                 * Pone el número de productos encima del carrito
                 */
                CartCount.prototype.count = function () {
                    this.getCart();
                    var number = 0;
                    var products = [];
                    $.each(this.stores, function (_i, store) {
                        $.each(store === null || store === void 0 ? void 0 : store.cart, function (_i, product) {
                            number += product.quantity;
                            products.push(product);
                        });
                    });
                    if (number) {
                        $('.num-shopping-cart').html(number.toString()).removeClass('start-hide');
                        $('.cart-empty').addClass('start-hide');
                    }
                    else {
                        $('.num-shopping-cart').html(number.toString()).addClass('start-hide');
                        $('.cart-empty').removeClass('start-hide');
                    }
                    // $('.link-shopping-cart').click((event) => {
                    //   this.gtag.cart1($(event.currentTarget), products);
                    // });
                };
                return CartCount;
            }());
            exports_4("CartCount", CartCount);
        }
    };
});
System.register("page", ["./libs/define", "libs/userUtil", "libs/cart_count"], function (exports_5, context_5) {
    "use strict";
    var userUtil_1, cart_count_1;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (_3) {
            },
            function (userUtil_1_1) {
                userUtil_1 = userUtil_1_1;
            },
            function (cart_count_1_1) {
                cart_count_1 = cart_count_1_1;
            }
        ],
        execute: function () {
            new userUtil_1.Util();
            new cart_count_1.CartCount();
        }
    };
});
System.active();
