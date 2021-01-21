var System={functions:{},register:function(t,e,n){System.functions[t]={requires:e,cb:n}},active:function(){$.each(System.functions,function(t,n){t=n.cb(function(t,e){n[t]=e},{id:t});$.each(t.setters,function(t,e){e(System.functions[n.requires[t]])}),t.execute()})}};System.register("libs/edit",[],function(e,t){"use strict";t&&t.id;return{setters:[],execute:function(){function t(){this.token="pk.eyJ1Ijoic3JkcmFrYSIsImEiOiJja2FlZHBmYXUwMHpoMnJudHJnazZsOWY1In0.tAAoQbjhJKq_DdwpTTimrw",this.toolbarOptions=[["bold","italic","underline","strike"],["blockquote","code-block"]],this.cke(),this.mapEdit(),this.mapEditPoint(),this.mapMarkers(),this.addFeature()}t.prototype.cke=function(){var t=$(".cke");t.length&&t.each(function(t,e){ClassicEditor.create(e).then(function(t){t.model.document.on("change:data",function(){$(e).val(t.getData())})}).catch(function(t){console.error(t)})})},t.prototype.mapEdit=function(){var t;$("#map-edit").length&&(t=($("#center").val()||",").split(","),this._mapEdit({latitude:t[1]||4.646876,longitude:t[0]||-74.087547}))},t.prototype._mapEdit=function(t){var e=[t.latitude,t.longitude],n=L.map("map-edit").setView(e,13);L.control.locate({initialZoomLevel:15,locateOptions:{enableHighAccuracy:!0,maxZoom:15},strings:{title:"Localizar mi posición"}}).addTo(n),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(n);var a=[];try{a=JSON.parse($("#points").val())}catch(t){a=[]}a.length&&(t={type:"FeatureCollection",features:[{type:"Feature",properties:{},geometry:{type:"Polygon",coordinates:[a.map(function(t){return[t.lng,t.lat]})]}}]},(e=L.geoJson(null,{pmIgnore:!1})).addTo(n),e.addData(t),e.on("pm:edit",function(t){t=t.layer._latlngs[0];$("#points").val(JSON.stringify(t))}),e.on("pm:dragend",function(t){t=t.layer._latlngs[0];$("#points").val(JSON.stringify(t))}),e.on("pm:remove",function(){$("#points").val("[]")})),n.pm.addControls({position:"topleft",drawMarker:!1,drawCircleMarker:!1,drawRectangle:!1,drawPolyline:!1,drawCircle:!1,cutPolygon:!1}),n.on("pm:drawstart",function(){var t=n.pm.getGeomanDrawLayers();$.each(t,function(t,e){e.remove()})}),n.on("pm:create",function(t){var e=t.layer._latlngs[0];$("#points").val(JSON.stringify(e)),t.layer.on("pm:ediit",function(t){t=t.layer._latlngs[0];$("#points").val(JSON.stringify(t))}),t.layer.on("pm:dragend",function(t){t=t.layer._latlngs[0];$("#points").val(JSON.stringify(t))}),t.layer.on("pm:remove",function(){$("#points").val("[]")})})},t.prototype.mapEditPoint=function(){var t;$("#map-edit-point").length&&(t=$("#point").val().split(","),this._mapEditPoint({latitude:t[1]||4.646876,longitude:t[0]||-74.087547}))},t.prototype._mapEditPoint=function(t){var e=L.map("map-edit-point").setView([t.latitude,t.longitude],13);L.control.locate({initialZoomLevel:15,locateOptions:{enableHighAccuracy:!0,maxZoom:15},strings:{title:"Localizar mi posición"}}).addTo(e),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(e);var n=L.marker([t.latitude,t.longitude],{draggable:!0}).addTo(e);n.on("dragend",function(){$("#point").val(n.getLatLng().lng+","+n.getLatLng().lat)}),e.on("locationfound",function(t){$("#point").val(n.getLatLng().lng+","+n.getLatLng().lat),n.setLatLng(t.latlng).bindPopup("Mueva el marcador si es necesario").openPopup()})},t.prototype.mapMarkers=function(){if($("#map-markers").length)try{var t=JSON.parse($("#markers").val());this._mapMarkers(t)}catch(t){this._mapMarkers([])}},t.prototype._mapMarkers=function(t){var e=($("#center").val()||",").split(","),n=L.map("map-markers").setView([e[1]||4.646876,e[0]||-74.087547],11);L.control.locate({initialZoomLevel:15,locateOptions:{enableHighAccuracy:!0,maxZoom:15},strings:{title:"Localizar mi posición"}}).addTo(n),L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(n),t.forEach(function(t){L.marker([t[1],t[0]]).addTo(n)})},t.prototype.addFeature=function(){var t=$(".list-features");t.length&&t.each(function(t,e){function n(){var n="";i.forEach(function(t,e){n+='<div class="form-group flex">',n+='<div class="form-control">',n+='<input type="text" id="i_'+e+'" class="input" placeholder=" " name="features['+e+'][name]" value="'+t.name+'" data-index="'+e+'" data-name="name">',n+='<label for="i_'+e+'">Nombre</label>',n+="</div>",n+='<div class="form-control pl-1">',n+='<input type="text" id="v_'+e+'" class="input" placeholder=" " name="features['+e+'][value]" value="'+t.value+'" data-index="'+e+'" data-name="value">',n+='<label for="v_'+e+'">Valor</label>',n+="</div>",n+="</div>"}),a.html(n),a.find("input").each(function(t,e){var n=$(e);n.on("input",function(){i[n.data("index")][n.data("name")]=n.val()})})}var a=$(e),i=a.data("features");n(),$(a.data("btn")).on("click",function(){i.push({name:"",value:"",slug:""}),n()})})},e("Edit",t)}}}),System.register("libs/vars",["../util/products.d"],function(t,e){"use strict";e&&e.id;return{setters:[function(t){}],execute:function(){function n(){}n.badge=function(t){return'<span class="badge '+{created:"primary",paid:"alert",cancelled:"error",cancelledAdmin:"error",picking:"alert",ready:"info",onway:"info",arrived:"info",missing:"error",completed:"action"}[t]+' inline">'+{created:"Creado",paid:"Pagado",cancelled:"Cancelado",cancelledAdmin:"Cancelado",picking:"Buscando Productos",ready:"Listo Para Envíar",onway:"En Camino",arrived:"Llegó",missing:"No Respondieron",completed:"Completado"}[t]+"</span>"},n.payment=function(t){return'<button class="primary small id_'+t+' w-100">Pagar</button>'},n.statusToDate=function(t,e){t=t.filter(function(t){return t.status===e});return t.length?n.format(t[0].date):""},n.format=function(t){if(!t)return"";var e=new Date;return e.setTime(Date.parse(t)),e.getDate()+" de "+["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][e.getMonth()]+" de "+e.getFullYear()},n.formatMoney=function(t,e,n,a,i){void 0===e&&(e=0),void 0===n&&(n="$"),void 0===a&&(a=","),void 0===i&&(i=".");var o="\\d(?=(\\d{3})+"+(0<e?"\\D":"$")+")";return n+t.toFixed(Math.max(0,~~e)).replace(".",i).replace(new RegExp(o,"g"),"$&"+a)},n.getParameterByName=function(t,e){void 0===e&&(e=window.location.href),t=t.replace(/[[\]]/g,"\\$&");e=new RegExp("[?&]"+t+"(=([^&#]*)|&|#|$)").exec(e);return e?e[2]?decodeURIComponent(e[2].replace(/\+/g," ")):"":null},n.capitalize=function(t){return t[0].toUpperCase()+t.slice(1)},n.b=$("body"),n.urlSite=n.b.data("urlSite"),n.urlApi=n.b.data("urlApi"),n.urlS3=n.b.data("urlS3"),n.urlS3Images=n.b.data("urlS3Images"),n.imgNoAvailable="/images/imagen_no_disponible.svg",n.store=n.b.data("store"),n.place=n.b.data("defaultPlace"),n.webp=0===document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp"),t("Vars",n)}}}),System.register("libs/get_api",["../util/sclib.d","libs/vars"],function(e,t){"use strict";var n;t&&t.id;return{setters:[function(t){},function(t){n=t}],execute:function(){function t(t){this.h={},t&&(this.h={Authorization:"bearer "+t})}t.prototype.gs=function(t,e){return void 0===e&&(e=n.Vars.store),this.g(e+"/"+t)},t.prototype.g=function(t){return sclib.ajax({url:n.Vars.urlApi+t,type:"GET",headers:this.h})},t.prototype.ps=function(t,e){return void 0===e&&(e={}),this.p(n.Vars.store+"/"+t,e)},t.prototype.p=function(t,e){return void 0===e&&(e={}),sclib.ajax({url:n.Vars.urlApi+t,type:"POST",headers:this.h,data:JSON.stringify(e)})},e("GetApi",t)}}}),System.register("libs/session",[],function(e,t){"use strict";t&&t.id;return{setters:[],execute:function(){function t(){var t;this.token=localStorage.getItem("token");try{this.user=JSON.parse(localStorage.getItem("user")),this.token?(null!==(t=null===(t=this.user)||void 0===t?void 0:t.personalInfo)&&void 0!==t&&t.firstname&&$(".userFirstname").html(this.user.personalInfo.firstname.split(" ")[0]),$(".nologin").hide(),$(".login").show()):($(".login").hide(),$(".nologin").show())}catch(t){$(".login").hide(),$(".nologin").show()}}t.checkWebpFeature=function(e,n){var a=new Image;a.onload=function(){var t=0<a.width&&0<a.height;n(e,t)},a.onerror=function(){n(e,!1)},a.src="data:image/webp;base64,"+{lossy:"UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",lossless:"UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",alpha:"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",animation:"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"}[e]},e("Session",t)}}}),System.register("libs/util",["libs/session","libs/get_api"],function(e,t){"use strict";var n,a;t&&t.id;return{setters:[function(t){n=t},function(t){a=t}],execute:function(){function t(){this.session=new n.Session,this.session=new n.Session,this.getApi=new a.GetApi(this.session.token),this.count(),this.lazy(),this.showDetailOrder(),this.changeTowns()}t.prototype.count=function(){var a=this;$("[data-count]").each(function(t,e){var n=$(e);a._color(n),n.on("input",function(){a._color(n)})})},t.prototype._color=function(t){var e=t.val().length,n=$(t.data("target"));e>parseInt(t.data("count"),10)?n.parent().addClass("t-error"):n.parent().removeClass("t-error"),n.html(""+e)},t.prototype.lazy=function(){var e=0===document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp");$(".lazy").Lazy({beforeLoad:function(t){e&&(t.attr("data-src",t.data("src").replace(".jpg",".webp")),t.data("retina")&&t.attr("data-retina",t.data("retina").replace(".jpg",".webp")))}})},t.prototype.showDetailOrder=function(){$(".btn-next-status").on("click",function(){sclib.modalShow("#modalNextStatus")}),$(".btn-cancel").on("click",function(){sclib.modalShow("#cancelOrder")})},t.prototype.changeTowns=function(){var n=this;$(".department").on("change",function(t){var e=$(t.currentTarget);n.getApi.g("towns/"+e.val()).done(function(t){var n=$(e.data("target"));n.empty(),n.append($("<option></option>").attr("value","").text("--")),$.each(t,function(t,e){n.append($("<option></option>").attr("value",e.name).text(e.name))})})})},e("Util",t)}}}),System.register("admin",["./libs/define","libs/edit","libs/util"],function(t,e){"use strict";var n,a;e&&e.id;return{setters:[function(t){},function(t){n=t},function(t){a=t}],execute:function(){new n.Edit,new a.Util}}}),System.active();
