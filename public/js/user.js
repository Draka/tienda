var System={functions:{},register:function(t,e,n){System.functions[t]={requires:e,cb:n}},active:function(){$.each(System.functions,function(t,n){t=n.cb(function(t,e){n[t]=e},{id:t});$.each(t.setters,function(t,e){e(System.functions[n.requires[t]])}),t.execute()})}};System.register("libs/userUtil",[],function(e,t){"use strict";t&&t.id;return{setters:[],execute:function(){function t(){this.lazy()}t.prototype.lazy=function(){var e=0===document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp");$(".lazy").Lazy({beforeLoad:function(t){e&&(t.attr("data-src",t.data("src").replace(".jpg",".webp")),t.data("retina")&&t.attr("data-retina",t.data("retina").replace(".jpg",".webp")))}})},e("Util",t)}}}),System.register("libs/gtag",["../util/products.d"],function(e,t){"use strict";t&&t.id;return{setters:[function(t){}],execute:function(){function t(){this.window=window}window.dataLayer=window.dataLayer||[],t.prototype.event=function(t){window.google_tag_manager?this.window.dataLayer.push(t):null!=t&&t.eventCallback&&(console.log("e gtag"),t.eventCallback())},t.prototype.removeItem=function(t,e,n){var r=[];r.push({id:t.sku,name:t.name,category:t.categoryText.join("/"),brand:t.brandText,list_name:n,position:1,price:t.price,quantity:e,store:t.store}),this.event({event:"removeFromCart",ecommerce:{currencyCode:"COP",remove:{actionField:{list:n},products:r}}})},t.prototype.addItem=function(t,e,n){var r=[];r.push({id:t.sku,name:t.name,category:t.categoryText.join("/"),brand:t.brandText,list_name:n,position:1,price:t.price,quantity:e,store:t.store}),this.event({event:"addToCart",ecommerce:{currencyCode:"COP",add:{actionField:{list:n},products:r}}})},t.prototype.list=function(t,n){var r=[];$.each(t,function(t,e){r.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:n,position:t,price:e.price,store:e.store})}),this.event({ecommerce:{currencyCode:"COP",impressions:r}})},t.prototype.clickItem=function(t,e,n,r){var o=[];return o.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:r,position:n,price:e.price,store:e.store}),this.event({event:"productClick",ecommerce:{currencyCode:"COP",click:{actionField:{list:r},products:o}},eventCallback:function(){document.location.href=$(t).attr("href")}}),!1},t.prototype.viewItem=function(t,e){var n=[];n.push({id:t.sku,name:t.name,category:t.categoryText.join("/"),brand:t.brandText,list_name:e,position:1,price:t.price,store:t.store}),this.event({ecommerce:{currencyCode:"COP",detail:{actionField:{list:e},products:n}}})},t.prototype.cart1=function(t,e){var n=[];return $.each(e,function(t,e){n.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:"cart1",position:1,price:e.price,store:e.store})}),this.event({event:"checkout",ecommerce:{currencyCode:"COP",checkout:{actionField:{step:1},products:n}},eventCallback:function(){document.location.href=$(t).attr("href")}}),!1},t.prototype.cart2=function(t,e){this.event({event:"checkoutOption",ecommerce:{currencyCode:"COP",checkout_option:{actionField:{step:2,option:e}}},eventCallback:function(){document.location.href=$(t).attr("href")}})},t.prototype.cart3=function(t,e){var n=[];return $.each(e,function(t,e){n.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:"cart1",position:1,price:e.price,store:e.store})}),this.event({event:"purchase",ecommerce:{currencyCode:"COP",purchase:{actionField:{id:t.orderID,affiliation:t.store.name,revenue:t.order.subtotal,tax:0,shipping:t.order.shipping},products:n}}}),!1},t.prototype.search=function(t){this.event({event:"search",search_term:t})},e("Gtag",t)}}}),System.register("libs/cart_count",["../util/products.d","libs/gtag"],function(e,t){"use strict";var n;t&&t.id;return{setters:[function(t){},function(t){n=t}],execute:function(){function t(){this.gtag=new n.Gtag,this.stores={},this.count()}t.prototype.getCart=function(){try{this.stores=JSON.parse(localStorage.getItem("stores"))}catch(t){this.stores={}}},t.prototype.count=function(){this.getCart();var n=0,r=[];$.each(this.stores,function(t,e){$.each(null==e?void 0:e.cart,function(t,e){n+=e.quantity,r.push(e)})}),$(".num-shopping-cart").html(n.toString()).removeClass("start-hide")},e("CartCount",t)}}}),System.register("user",["./libs/define","libs/userUtil","libs/cart_count"],function(t,e){"use strict";var n,r;e&&e.id;return{setters:[function(t){},function(t){n=t},function(t){r=t}],execute:function(){new n.Util,new r.CartCount}}}),System.active();