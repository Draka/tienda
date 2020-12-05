var System={functions:{},register:function(t,e,a){System.functions[t]={requires:e,cb:a}},active:function(){$.each(System.functions,function(t,a){t=a.cb(function(t,e){a[t]=e},{id:t});$.each(t.setters,function(t,e){e(System.functions[a.requires[t]])}),t.execute()})}};System.register("libs/vars",["../util/products.d"],function(t,e){"use strict";e&&e.id;return{setters:[function(t){}],execute:function(){function a(){}a.badge=function(t){return'<span class="badge '+{created:"primary",paid:"alert",cancelled:"error",cancelledAdmin:"error",picking:"alert",ready:"info",onway:"info",arrived:"info",missing:"error",completed:"action"}[t]+' inline">'+{created:"Creado",paid:"Pagado",cancelled:"Cancelado",cancelledAdmin:"Cancelado",picking:"Buscando Productos",ready:"Listo Para Envíar",onway:"En Camino",arrived:"Llegó",missing:"No Respondieron",completed:"Completado"}[t]+"</span>"},a.payment=function(t){return'<button class="primary small id_'+t+' w-100">Pagar</button>'},a.statusToDate=function(t,e){t=t.filter(function(t){return t.status===e});return t.length?a.format(t[0].date):""},a.format=function(t){if(!t)return"";var e=new Date;return e.setTime(Date.parse(t)),e.getDate()+" de "+["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][e.getMonth()]+" de "+e.getFullYear()},a.formatMoney=function(t,e,a,s,r){void 0===e&&(e=0),void 0===a&&(a="$"),void 0===s&&(s=","),void 0===r&&(r=".");var i="\\d(?=(\\d{3})+"+(0<e?"\\D":"$")+")";return a+t.toFixed(Math.max(0,~~e)).replace(".",r).replace(new RegExp(i,"g"),"$&"+s)},a.getParameterByName=function(t,e){void 0===e&&(e=window.location.href),t=t.replace(/[[\]]/g,"\\$&");e=new RegExp("[?&]"+t+"(=([^&#]*)|&|#|$)").exec(e);return e?e[2]?decodeURIComponent(e[2].replace(/\+/g," ")):"":null},a.capitalize=function(t){return t[0].toUpperCase()+t.slice(1)},a.b=$("body"),a.urlSite=a.b.data("urlSite"),a.urlApi=a.b.data("urlApi"),a.urlS3=a.b.data("urlS3"),a.urlS3Images=a.b.data("urlS3Images"),a.imgNoAvailable=a.urlS3+"common/images/imagen_no_disponible.svg",a.store=a.b.data("store"),a.place=a.b.data("defaultPlace"),t("Vars",a)}}}),System.register("libs/get_api",["../util/sclib.d","libs/vars"],function(e,t){"use strict";var a;t&&t.id;return{setters:[function(t){},function(t){a=t}],execute:function(){function t(t){this.h={},t&&(this.h={Authorization:"bearer "+t})}t.prototype.gs=function(t,e){return void 0===e&&(e=a.Vars.store),this.g(e+"/"+t)},t.prototype.g=function(t){return sclib.ajax({url:a.Vars.urlApi+t,type:"GET",headers:this.h})},t.prototype.ps=function(t,e){return void 0===e&&(e={}),this.p(a.Vars.store+"/"+t,e)},t.prototype.p=function(t,e){return void 0===e&&(e={}),sclib.ajax({url:a.Vars.urlApi+t,type:"POST",headers:this.h,data:JSON.stringify(e)})},e("GetApi",t)}}}),System.register("libs/gtag",[],function(e,t){"use strict";t&&t.id;return{setters:[],execute:function(){function t(){this.window=window}window.dataLayer=window.dataLayer||[],t.prototype.event=function(t){window.google_tag_manager?this.window.dataLayer.push(t):null!=t&&t.eventCallback&&(console.log("e gtag"),t.eventCallback())},t.prototype.removeItem=function(t,e,a){var s=[];s.push({id:t.sku,name:t.name,category:t.categoryText.join("/"),brand:t.brandText,list_name:a,position:1,price:t.price,quantity:e,store:t.store}),this.event({event:"removeFromCart",ecommerce:{currencyCode:"COP",remove:{actionField:{list:a},products:s}}})},t.prototype.addItem=function(t,e,a){var s=[];s.push({id:t.sku,name:t.name,category:t.categoryText.join("/"),brand:t.brandText,list_name:a,position:1,price:t.price,quantity:e,store:t.store}),this.event({event:"addToCart",ecommerce:{currencyCode:"COP",add:{actionField:{list:a},products:s}}})},t.prototype.list=function(t,a){var s=[];$.each(t,function(t,e){s.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:a,position:t,price:e.price,store:e.store})}),this.event({ecommerce:{currencyCode:"COP",impressions:s}})},t.prototype.clickItem=function(t,e,a,s){var r=[];return r.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:s,position:a,price:e.price,store:e.store}),this.event({event:"productClick",ecommerce:{currencyCode:"COP",click:{actionField:{list:s},products:r}},eventCallback:function(){document.location.href=$(t).attr("href")}}),!1},t.prototype.viewItem=function(t,e){var a=[];a.push({id:t.sku,name:t.name,category:t.categoryText.join("/"),brand:t.brandText,list_name:e,position:1,price:t.price,store:t.store}),this.event({ecommerce:{currencyCode:"COP",detail:{actionField:{list:e},products:a}}})},t.prototype.cart1=function(t,e){var a=[];return $.each(e,function(t,e){a.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:"cart1",position:1,price:e.price,store:e.store})}),this.event({event:"checkout",ecommerce:{currencyCode:"COP",checkout:{actionField:{step:1},products:a}},eventCallback:function(){document.location.href=$(t).attr("href")}}),!1},t.prototype.cart2=function(t,e){this.event({event:"checkoutOption",ecommerce:{currencyCode:"COP",checkout_option:{actionField:{step:2,option:e}}},eventCallback:function(){document.location.href=$(t).attr("href")}})},t.prototype.cart3=function(t,e){var a=[];return $.each(e,function(t,e){a.push({id:e.sku,name:e.name,category:e.categoryText.join("/"),brand:e.brandText,list_name:"cart1",position:1,price:e.price,store:e.store})}),this.event({event:"purchase",ecommerce:{currencyCode:"COP",purchase:{actionField:{id:t.orderID,affiliation:t.store.name,revenue:t.order.subtotal,tax:0,shipping:t.order.shipping},products:a}}}),!1},t.prototype.search=function(t){this.event({event:"search",search_term:t})},e("Gtag",t)}}}),System.register("libs/cart_count",["libs/gtag"],function(e,t){"use strict";var a;t&&t.id;return{setters:[function(t){a=t}],execute:function(){function t(){this.gtag=new a.Gtag,this.stores={},this.count()}t.prototype.getCart=function(){try{this.stores=JSON.parse(localStorage.getItem("stores"))}catch(t){this.stores={}}},t.prototype.count=function(){var e=this;this.getCart();var a=0,s=[];$.each(this.stores,function(t,e){$.each(null==e?void 0:e.cart,function(t,e){a+=e.quantity,s.push(e)})}),$(".num-shopping-cart").html(a.toString()),$(".link-shopping-cart").click(function(t){e.gtag.cart1($(t.currentTarget),s)})},e("CartCount",t)}}}),System.register("libs/show_msg",["libs/cart"],function(e,t){"use strict";var n;t&&t.id;return{setters:[function(t){n=t}],execute:function(){function t(){}t.show=function(t,r){void 0===r&&(r="secondary");var i=$(".error-modal");i.length||(i=$('<div class="error-modal fixed ab-0 w-100 p-3">').hide(),$("body").append(i)),i.show(),t.responseJSON&&t.responseJSON.values&&(t=t.responseJSON.values),$.each(t,function(t,e){e.code,1001===e.code&&n.Cart.updateUUID(),1002===e.code&&(n.Cart.reset(),setTimeout(function(){document.location.href=window.location.origin+window.location.pathname},5e3));var a=$('<div class="msg '+r+' p-3 trn-3 op-0">'),s=$('<button class="absolute ar-1 flat small" data-dismiss="modal" aria-label="Cerrar">').html('<span aria-hidden="true">&times;</span>').click(function(){a.removeClass("op-1"),setTimeout(function(){a.remove(),""===i.html()&&i.hide()},300)});a.append(s),e.title&&a.append('<div class="b">'+e.title+"</div>"),a.append(e.msg),i.append(a),setTimeout(function(){a.addClass("op-1")},1),setTimeout(function(){s.trigger("click")},5e3)})},e("ShowMsg",t)}}}),System.register("libs/product",["libs/vars","libs/gtag","libs/cart"],function(t,e){"use strict";var o,c,d;e&&e.id;return{setters:[function(t){o=t},function(t){c=t},function(t){d=t}],execute:function(){function n(){}n.img=function(t,e){if(void 0===e&&(e=["196x196","392x392"]),null!=t&&t.imagesSizes&&t.imagesSizes.length){var a=t.imagesSizes[0],s=a[e[0]],r=a[e[1]];return s||"48x48"!==e[0]&&"96x96"!==e[0]||(s=a["75x75"],r=a["150x150"]),'<img class="w-100 lazy" data-src="'+s+'" data-retina="'+r+'" alt="'+t.name+'">'}return'<img class="w-100 lazy" data-src="'+o.Vars.imgNoAvailable+'" alt="'+t.name+'">'},n.imgNow=function(t,e){void 0===e&&(e=["196x196","392x392"]);var a=e[0].split("x")[0];return null!=t&&t.imagesSizes&&t.imagesSizes.length?'<img class="h-img-'+a+'" src="'+t.imagesSizes[0][e[1]]+'" alt="'+t.name+'">':'<img class="h-img-'+a+'" src="'+o.Vars.imgNoAvailable+'" alt="'+t.name+'">'},n.single=function(e,a,s){var r=new c.Gtag,t="",t=e.inventory?0===e.stock?"Agotado":e.stock&&e.stock<10?"En stock, Pocas unidades":"En stock":"En stock",i=$('<div class="w-230p w-170p-xs w-170p-sm br-1 white h-100">');return i.html('<div class="h-100 relative p-3 pb-7 product" data-sku="'+e.sku+'"><a href="/'+o.Vars.store+"/productos/"+e.sku+'">'+n.img(e)+"</a>"+(e.brandText?'<div class="t-white-700 small mb-1">'+e.brandText+"</div>":"")+'<div class="t-primary tc b small">'+e.name+'</div><div class="t-secondary b big">'+o.Vars.formatMoney(e.price)+'</div><div class="t-action small mb-4">'+t+'</div><div class="absolute w-100c2 ab-1"><button class="secondary w-100 add"><i class="fas fa-cart-plus"></i> Agregar</button></div></div></div>'),i.find(".add").click(function(t){(new d.Cart).add(e.sku,s)}),i.find("a").click(function(t){return r.clickItem($(t.currentTarget),e,a,s)}),i},t("Product",n)}}}),System.register("libs/session",[],function(e,t){"use strict";t&&t.id;return{setters:[],execute:function(){function t(){var t;this.token=localStorage.getItem("token");try{this.user=JSON.parse(localStorage.getItem("user")),this.token?(null!==(t=null===(t=this.user)||void 0===t?void 0:t.personalInfo)&&void 0!==t&&t.firstname&&$(".userFirstname").html(this.user.personalInfo.firstname.split(" ")[0]),$(".nologin").hide(),$(".login").show()):($(".login").hide(),$(".nologin").show())}catch(t){$(".login").hide(),$(".nologin").show()}}t.checkWebpFeature=function(e,a){var s=new Image;s.onload=function(){var t=0<s.width&&0<s.height;a(e,t)},s.onerror=function(){a(e,!1)},s.src="data:image/webp;base64,"+{lossy:"UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",lossless:"UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",alpha:"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",animation:"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"}[e]},e("Session",t)}}}),System.register("libs/wompi",[],function(t,e){"use strict";e&&e.id;return{setters:[],execute:function(){function a(){}a.btn=function(t,e){e.ref&&e.ref.reference&&t.click(function(t){t.stopPropagation(),new WidgetCheckout({currency:"COP",amountInCents:100*e.order.total,reference:""+e.ref.reference,publicKey:a.key}).open(function(t){setTimeout(function(){document.location.href=window.location.origin+window.location.pathname},3e3)})})},a.key="pub_test_Utcl6o6rEhg8FHIhmI37vLFI16EjGSCc",t("Wompi",a)}}}),System.register("libs/cart_list",["libs/cart","libs/product","libs/vars","libs/get_api","libs/session","libs/gtag","libs/show_msg","libs/wompi"],function(e,t){"use strict";var n,l,u,a,s,r,o,c;t&&t.id;return{setters:[function(t){n=t},function(t){l=t},function(t){u=t},function(t){a=t},function(t){s=t},function(t){r=t},function(t){o=t},function(t){c=t}],execute:function(){function t(){this.cart=new n.Cart,this.gtag=new r.Gtag,this.session=new s.Session,this.sum={subtotal:0,shipping:0,total:0},this.session=new s.Session,this.getApi=new a.GetApi(this.session.token)}t.prototype.putTotals=function(){var e=this;$(".cart-subtotal").html(u.Vars.formatMoney(this.sum.subtotal)),this.sum.shipping=0,$.each(this.cart.stores,function(t){t=parseFloat($('input[name="shipping-methods-'+t+'"]:checked').data("price"));t&&(e.sum.shipping+=t)}),$(".cart-shipping").html(u.Vars.formatMoney(this.sum.shipping)),this.sum.total=this.sum.subtotal+this.sum.shipping,$(".cart-total").html(u.Vars.formatMoney(this.sum.total))},t.showAddresss=function(){$(".cart-screen-adrress").show(),$(".show-addresss").click(function(){sclib.modalShow("#address")})},t.prototype.showCart=function(){var d=this,s=!1;$(".cart-list").each(function(t,e){var a=$(e);a.html(""),$.each(d.cart.stores,function(t,e){var n,o,c=t;Object.keys(e.cart).length&&(s=!0,t=$('<div id="cart_'+c+'" class="mb-5">').append('<div class="title">Pedido de: '+e.name+"</div>"),n=$('<table class="small hide-xs striped">').append('<thead><tr><th>&nbsp;</th><th colspan="2" class="tc">PRODUCTO</th><th class="tr">PRECIO</th><th class="tc">CANTIDAD</th><th class="tr">SUBTOTAL</th></tr></thead>'),o=$('<div class="mobile show-xs">'),$.each(e.cart,function(t,e){var a=l.Product.img(e,["48x48","96x96"]),s=$('<button class="secondary small">').html('<i class="fas fa-times hand"></i>').click(function(){d.cart.remove(e.sku,c+"/page_cart",c)}),r=$('<button class="secondary small mr-2">').html('<i class="fas fa-plus"></i><span class="out-screen">Aumentar cantidad</span>').click(function(){d.cart.add(t,c+"/page_cart",c)}),i=$('<button class="secondary small mr-2">').html('<i class="fas fa-minus"></i><span class="out-screen">Disminuir cantidad</span>').click(function(){d.cart.minus(t,c+"/page_cart",c)}),r=$('<div class="box-controls flex">').append(i.clone(!0,!0)).append('<div class="value w-img-48 mr-2 tc b br-1 rd-0-2 h-100">'+e.quantity+"</div>").append(r.clone(!0,!0));n.append($("<tr>").append($("<td>").append(s.clone(!0,!0))).append('<td class="w-img-48">'+a+'</td><td><div class="b">'+e.name+'</div></td><td class="tr">'+u.Vars.formatMoney(e.price)+"</td>").append($('<td class="tr">').append(r.clone(!0,!0))).append('<td class="tr t-secondary b">'+u.Vars.formatMoney(e.quantity*e.price)+"</td>")),o.append($('<table class="small striped">').append('<tr><th class="h-img-48">'+a+'</th><td class="b big">'+e.name+"</td></tr>").append($("<tr>").append('<th class="b">PRECIO</th><td class="t-secondary tr">'+u.Vars.formatMoney(e.price)+"</td>")).append($("<tr>").append('<th class="b">CANTIDAD</th>').append($("<td>").append(r.clone(!0,!0)))).append($("<tr>").append('<th class="b">SUBTOTAL</th><td class="t-secondary tr b">'+u.Vars.formatMoney(e.quantity*e.price)+"</td>")))}),t.append(n).append(o),a.append(t))}),a.find(".lazy").Lazy(),d.cart.subtotal()}),$(".btn-cart1").click(function(t){var a=[];$.each(d.cart.stores,function(t,e){$.each(e.cart,function(t,e){a.push(e)})}),d.gtag.cart1($(t.currentTarget),a)}),s?($(".cart-screen").removeClass("hide"),$(".cart-empty").addClass("hide")):($(".cart-screen").addClass("hide"),$(".cart-empty").removeClass("hide"))},t.prototype.fixProductsInCart=function(){var i=this,n=$(".cart-list-address");n.length&&(n.html(""),this.sum.subtotal=0,$.each(this.cart.stores,function(e,s){var r;0!==Object.keys(s.cart).length&&(r=e,i.getApi.p(e+"/services/check-cart",{items:s.cart}).done(function(t){i.cart.stores[e].cart=t.validateItems.items,i.cart.set();var a='<div id="cart_'+r+'" class="mt-5"><div class="b">'+s.name+"</div>";a+='<table class="small striped"><thead><tr><th class="tc">PRODUCTO</th><th class="tr">SUBTOTAL</th></tr></thead>',$.each(t.validateItems.items,function(t,e){a+='<tr><td><span class="b">'+e.name+"</span> (x"+e.quantity+')</td><td class="tr t-secondary">'+u.Vars.formatMoney(e.quantity*e.price)+"</td>",i.sum.subtotal+=e.quantity*e.price}),a+="</table></div>",n.append(a),i.putTotals()}))}))},t.prototype.showStepAddress=function(){var i=this,a=!1;$(".cart-list-availability").length&&$(".cart-list-availability").each(function(t,e){var r=$(e);r.html(""),$.each(i.cart.stores,function(s,t){var e;0!==Object.keys(t.cart).length&&(a=!0,t='<div id="step-store-'+(e=s)+'" class="white br-1 rd-0-2 p-3 mt-3"><div class="title">'+t.name+'</div><div class="hr"></div><div class="subtitle b mt-2">Método de envío</div><div class="shipping-methods"><div class="bigx2"><i class="fas fa-sync fa-spin"></i></div></div><div class="subtitle b mt-2">Método de pago</div><div class="payments-methods"><div class="bigx2"><i class="fas fa-sync fa-spin"></i></div></div></div>',r.append(t),i.getApi.p(s+"/services/search-shipping-methods",n.Cart.getAddressJSON()).done(function(t){var a="";$.each(t.shippingMethods,function(t,e){a+='<div class="mt-3 mb-1 ml-3 small"><label><input id="r-shipping-methods-'+s+"-"+t+'" type="radio" name="shipping-methods-'+s+'" value="'+e.slug+'" data-price="'+e.price+'" '+(0===t?'checked="checked"':"")+"><span>"+e.name+'</span> - <span class="t-secondary">'+u.Vars.formatMoney(e.price)+'</span></label><div class="remark">'+e.description+"</div></div>"}),r.find("#step-store-"+e+" .shipping-methods").html(a),i.getApi.p(s+"/services/search-payments-methods",{shippingMethod:$('input[name="shipping-methods-'+s+'"]').val()}).done(function(t){var a="";$.each(t.paymentsMethods,function(t,e){a+='<div class="mh-1 ml-3 small"><label><input id="r-payments-methods-'+s+"-"+t+'" type="radio" name="payments-methods-'+s+'" value="'+e.slug+'" data-price="'+e.price+'" '+(0===t?'checked="checked"':"")+"><span>"+e.name+'</span></label><div class="remark">'+e.description+"</div></div>"}),r.find("#step-store-"+e+" .payments-methods").html(a)})}))})}),$(".btn-cart2").click(function(){var t=n.Cart.getAddressJSON();if(i.checkAddress()&&!t.address)return sclib.modalShow("#address");var a=[];if($(".errors-cart2").html(""),$.each(i.cart.stores,function(t,e){0!==Object.keys(e.cart).length&&($('input[name="shipping-methods-'+t+'"]:checked').val()||a.push("Seleccione el Método de Envío para <b>"+e.name+"</b>"),i.cart.stores[t].shipping=$('input[name="shipping-methods-'+t+'"]:checked').val(),$('input[name="payments-methods-'+t+'"]:checked').val()||a.push("Seleccione el Método de Pago para <b>"+e.name+"</b>"),i.cart.stores[t].payment=$('input[name="payments-methods-'+t+'"]:checked').val())}),a.length)return $.each(a,function(t,e){$(".errors-cart2").append('<div class="msg error">'+e+"</div>")}),void o.ShowMsg.show(a);$(".errors-cart2").hide(),i.getApi.p("orders",{stores:i.cart.stores,cartID:i.cart.getCartID(),address:t,pptu:$("#pptu").is(":checked")}).done(function(t){n.Cart.reset(),document.location.href=window.location.origin+"/carrito-resumen?id="+t.orderIDs}).fail(o.ShowMsg.show)}),a?($(".cart-screen-adrress").removeClass("hide"),$(".cart-empty").addClass("hide")):($(".cart-screen-adrress").addClass("hide"),$(".cart-empty").removeClass("hide"))},t.prototype.checkAddress=function(){var a=!1;return $.each(this.cart.stores,function(t,e){0!==Object.keys(e.cart).length&&$.each(e.cart,function(t,e){null!==(e=e.digital)&&void 0!==e&&e.streaming||(a=!0)})}),a},t.prototype.showDetailOrder=function(){var t,e=$(".cart-detail-order");e.length&&(t=u.Vars.getParameterByName("id")||"",e.find(".number-order").html(t),this.getApi.g("orders/id/"+t).done(function(t){var i=e.find(".order-detail");i.html(""),$.each(t.orders,function(t,e){var a=e.store.slug,a=$('<div id="cart_'+a+'" class="mt-5">').append('<div class="row"><div class="col-md-8"><h2>Pedido #'+e.orderID+" de: "+e.store.name+'</h2></div><div class="col-md-4"><button id="id_'+e.orderID+'" class="secondary small w-100 hide">Pagar '+u.Vars.formatMoney(e.order.total)+"</button></div></div>");e.payment.pse&&0<=["created"].indexOf(e.status)&&c.Wompi.btn(a.find("#id_"+e.orderID).removeClass("hide"),e);var s='<table class="hide-xs small striped"><thead><tr><th colspan="2" class="tc">PRODUCTO</th><th class="tr">PRECIO</th><th class="tr">CANTIDAD</th><th class="tr">SUBTOTAL</th></tr></thead><tbody>',r='<div class="show-xs">';$.each(e.products,function(t,e){var a=l.Product.img(e,["96x96","196x196"]);s+='<tr><td class="w-img-96">'+a+'</td><td><div class="b">'+e.name+'</div></td><td class="tr">'+u.Vars.formatMoney(e.price)+'</td><td class="tr">'+e.quantity+'</td><td class="tr t-secondary b">'+u.Vars.formatMoney(e.quantity*e.price)+"</td></tr>",r+='<table class="small striped"><tr><th class="w-img-48">'+a+'</th><td class="b big">'+e.name+'</td></tr><tr><th class="b">PRECIO</th><td class="t-secondary">'+u.Vars.formatMoney(e.price)+'</td></tr><tr><th class="b">CANTIDAD</th><td class="big">'+e.quantity+'</td></tr><tr><th class="b">SUBTOTAL</th><td class="b big t-secondary">'+u.Vars.formatMoney(e.quantity*e.price)+"</td></tr>",r+="</table>"}),s+='</tbody><tfoot><tr><td class="b" colspan="4">Subtotal</td><td class="tr t-secondary">'+u.Vars.formatMoney(e.order.subtotal)+'</td></tr><tr><td class="b" colspan="4">Envío</td><td class="tr t-secondary">'+u.Vars.formatMoney(e.order.shipping)+'</td></tr><tr><td class="b" colspan="4">Total</td><td class="tr big t-secondary b">'+u.Vars.formatMoney(e.order.total)+"</td></tr></tfoot></table>",r+='<table class="small striped"><tr><td class="b">Subtotal</td><td class="tr t-secondary">'+u.Vars.formatMoney(e.order.subtotal)+'</td></tr><tr><td class="b">Envío</td><td class="tr t-secondary">'+u.Vars.formatMoney(e.order.shipping)+'</td></tr><tr><td class="b">Total</td><td class="tr big t-secondary b">'+u.Vars.formatMoney(e.order.total)+"</td></tr></table>",s+="</div>",r+="</div>",a.append(s).append(r),i.append(a)}),i.find(".lazy").Lazy()}))},e("CartList",t)}}}),System.register("libs/cart",["../util/mapbox.d","libs/vars","libs/get_api","libs/gtag","libs/cart_count","libs/show_msg","libs/product","libs/cart_list"],function(t,e){"use strict";var c,a,s,r,d,i,l;e&&e.id;return{setters:[function(t){},function(t){c=t},function(t){a=t},function(t){s=t},function(t){r=t},function(t){d=t},function(t){i=t},function(t){l=t}],execute:function(){function o(){this.getApi=new a.GetApi(""),this.cartCount=new r.CartCount,this.gtag=new s.Gtag,this.cartID="",this.getCart()}o.reset=function(){localStorage.removeItem("stores"),o.updateUUID()},o.prototype.getCart=function(){try{this.stores=JSON.parse(localStorage.getItem("stores"))||{}}catch(t){this.stores={}}},o.prototype.set=function(){localStorage.setItem("stores",JSON.stringify(this.stores)),this.cartCount.count()},o.prototype.get=function(a,s,r){var i=this;this.stores[a]||(this.stores[a]={cart:{},name:""});var t=this.stores[a].cart[s];null!=t&&t.sku?r(t):(t="",t=c.Vars.place?"products/"+s+"?place="+c.Vars.place:"products/"+s,this.getApi.gs(t,a).done(function(t){var e={store:a,sku:s,name:t.product.name,categoryText:t.product.categoryText,brandText:t.product.brandText,price:t.inventory.price,quantity:0,imagesSizes:t.product.imagesSizes};i.stores[a].cart[s]=e,i.stores[a].name=t.store.name,i.set(),r(e)}))},o.lineImg=function(t){return'<div class="flex mt-3"><div class="mr-3">'+i.Product.imgNow(t,["48x48","96x96"])+"</div><div>"+t.name+"</div></div>"},o.updateUUID=function(){localStorage.setItem("cartID",o.uuidv4())},o.uuidv4=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var e=16*Math.random()|0;return("x"===t?e:3&e|8).toString(16)})},o.prototype.getCartID=function(){return this.cartID=localStorage.getItem("cartID"),this.cartID||(this.cartID=o.uuidv4(),localStorage.setItem("cartID",this.cartID)),this.cartID},o.prototype.setQuantity=function(a,s,r,i){var n=this;void 0===i&&(i=c.Vars.store),this.getCartID(),this.get(i,a,function(t){if(t){var e=o.lineImg(t);if(0===s)t.quantity=s,n.gtag.removeItem(t,s,r),d.ShowMsg.show([{code:0,title:"Producto eliminado",msg:e}]),delete n.stores[i].cart[a];else if(t.quantity<s)n.gtag.addItem(t,s-t.quantity,r),t.quantity=s,d.ShowMsg.show([{code:0,title:"Producto agregado",msg:e}]);else{if(!(t.quantity>s))return;n.gtag.removeItem(t,t.quantity-s,r),t.quantity=s,d.ShowMsg.show([{code:0,title:"Producto modificado",msg:e}])}n.set(),n.subtotal(),(new l.CartList).showCart()}})},o.prototype.subtotal=function(){var a=0;$.each(this.stores,function(t,e){$.each(e.cart,function(t,e){a+=e.quantity*e.price})}),$(".cart-subtotal").html(""+c.Vars.formatMoney(a))},o.prototype.add=function(t,e,a){void 0===a&&(a=c.Vars.store);var s=null===(s=this.stores[a])||void 0===s?void 0:s.cart[t];this.setQuantity(t,((null==s?void 0:s.quantity)||0)+1,e,a)},o.prototype.minus=function(t,e,a){void 0===a&&(a=c.Vars.store);var s=this.stores[a].cart[t];s&&0<s.quantity&&this.setQuantity(t,s.quantity-1,e,a)},o.prototype.remove=function(t,e,a){this.setQuantity(t,0,e,a)},o.getAddressJSON=function(){try{return JSON.parse(localStorage.getItem("address")||"{}")}catch(t){return localStorage.removeItem("address"),{}}},o.setAddressJSON=function(e){if("string"==typeof e)try{e=JSON.parse(e)}catch(t){e=""}return localStorage.setItem("address",JSON.stringify(e)),e},o.prepareFormAddress=function(){var t=o.getAddressJSON();t.form&&$.each(t.form,function(t,e){$('input[name="'+e.name+'"]').val(e.value)}),t.address?$(".user-address").html(t.city+" - "+t.address):$(".user-address").html('<div class="msg error">Proporcione una dirección para continuar</div>'),$("#addressForm").data("post",o.checkAddress),$("#mapForm .back").click(function(){$("#addressForm").show(),$("#mapForm").hide()}),$("#mapForm").data("post",function(){var t=o.setAddressJSON($("#addressJSON").val());sclib.modalHide("#address"),$(".user-address").html(t.city+" - "+t.address),(new l.CartList).showStepAddress()})},o.checkAddress=function(t){var e={city:$('#addressForm input[name="city"]').val(),address:t.address,location:t.location,extra:$("#extra").val(),form:$("#addressForm").serializeArray()};$("#addressJSON").val(JSON.stringify(e)),$("#addressForm").hide(),$("#mapForm").show(),mapboxgl.accessToken="pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw";var a=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:[t.location.lng,t.location.lat],zoom:16}),s=new mapboxgl.Marker({draggable:!0}).setLngLat([t.location.lng,t.location.lat]).addTo(a);s.on("dragend",function(){var t=s.getLngLat();e.location=t,$("#addressJSON").val(JSON.stringify(e))}),t.ok||((t=new MapboxGeocoder({accessToken:mapboxgl.accessToken,marker:!1,mapboxgl:mapboxgl})).on("result",function(t){s.setLngLat(t.result.center)}),a.addControl(t))},t("Cart",o)}}}),System.register("libs/userUtil",["libs/cart","libs/gtag"],function(e,t){"use strict";var r,a;t&&t.id;return{setters:[function(t){r=t},function(t){a=t}],execute:function(){function t(){this.gtag=new a.Gtag,this.lazy(),this.prepareBtns()}t.prototype.lazy=function(){var e=0===document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp");$(".lazy").Lazy({beforeLoad:function(t){e&&(t.attr("data-src",t.data("src").replace(".jpg",".webp")),t.data("retina")&&t.attr("data-retina",t.data("retina").replace(".jpg",".webp")))}})},t.prototype.prepareBtns=function(){var s=this;$(".product").each(function(t,e){var a=$(e);a.find(".add").on("click",function(){var t=new r.Cart,e=a.data("product");t.add(a.data("sku"),a.data("list"),e.store)}),a.find("a").on("click",function(t){return s.gtag.clickItem($(t.currentTarget),a.data("product"),a.data("pos"),a.data("list"))})})},e("Util",t)}}}),System.register("page",["./libs/define","libs/userUtil"],function(t,e){"use strict";var a;e&&e.id;return{setters:[function(t){},function(t){a=t}],execute:function(){new a.Util}}}),System.active();