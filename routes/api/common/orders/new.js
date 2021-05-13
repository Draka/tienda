const geolib = require('geolib');
const validateProducts = require('../../../../libs/validate_products.lib');
const queryStore = require('../../../../libs/query_store.lib');
const sqsMailer = require('../../../../libs/sqs_mailer');

module.exports = (req, res, next) => {
  const errors = [];
  const body = _.pick(req.body, ['stores', 'address', 'cartID']);
  body.tenancy = req.tenancy;

  async.auto({
    validate: (cb) => {
      if (!body.cartID) {
        errors.push({ field: 'cartID', msg: __('Carrito de compras inválido, intente recargar la página.') });
      }

      const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!re.test(body.cartID)) {
        errors.push({ code: 1001, field: 'cartID', msg: __('Identificador de Carrito de compras inválido, intente recargar la página.') });
      }
      let cartEmpty = true;
      _.each(body.stores, (store, i) => {
        // const schedule = (store.schedule || '').split(',');
        // if (schedule.length !== 2) {
        //   errors.push({ field: 'schedule', msg: __('Seleccione una fecha de entrega válida.') });
        // }

        if (store.cart && Object.keys(store.cart).length) {
          cartEmpty = false;
        } else {
          delete body.stores[i];
        }
      });

      if (cartEmpty) {
        errors.push({ field: 'cart', msg: __('El carrito de compras esta vacio.') });
      }
      if (errors.length) {
        return cb(listErrors(400, null, errors));
      }
      cb();
    },
    orders: ['validate', (_results, cb) => {
      async.mapValues(body.stores, (store, slug, cb) => {
        async.auto({
          store: (cb) => {
            queryStore.storeBySlug(req, slug, cb);
          },
          delivery: ['store', (results, cb) => {
            if (!results.store) {
              errors.push({ field: 'store', msg: __('El registro no existe.') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            store.images = results.store.images;
            if (!_.get(req, 'site.modules.deliveries')) {
              results.store.deliveries = _.clone(global.deliveriesMaster);
              _.each(results.store.deliveries, (o) => {
                o.value = _.get(req, 'site.modules.deliveryPrice');
              });
              if (_.get(req, 'site.modules.payments')) {
                _.each(results.store.deliveries, (o) => {
                  o.payments = _.map(global.payments, (i) => i.slug);
                });
              }
            }
            const d = results.store.deliveries.find((d) => d.slug === store.shipping && d.active);
            if (!d) {
              errors.push({ field: 'delivery1', msg: __('El registro no existe.') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }

            const delivery = _.find(global.deliveries, { slug: d.slug });
            cb(null, {
              name: delivery.name,
              slug: delivery.slug,
              description: delivery.description,
              price: _.get(d, 'value') || 0,
              virtualDelivery: delivery.virtualDelivery,
              personalDelivery: delivery.personalDelivery,
              payments: delivery.payments,
              active: _.get(d, 'active') || false,
            });
          }],
          payment: ['store', (results, cb) => {
            let p;
            let d;
            let payment;
            if (_.get(req, 'site.modules.payments')) {
              p = results.store.payments.find((d) => d.slug === store.payment && d.active);
              d = global.deliveries.find((d) => d.slug === store.shipping);
              payment = _.find(global.payments, { slug: p.slug });
            } else {
              results.store.payments = _.clone(global.paymentsMaster);
              p = results.store.payments.find((d) => d.slug === store.payment);
              d = global.deliveriesMaster.find((d) => d.slug === store.shipping);
              payment = _.find(global.paymentsMaster, { slug: p.slug });
            }
            if (!p) {
              errors.push({ field: 'delivery2', msg: __('El registro no existe.') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            if (!d || d.payments.indexOf(p.slug) === -1) {
              errors.push({ field: 'delivery3', msg: __('El registro no existe.') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            cb(null, {
              active: _.get(d, 'active') || false,
              name: payment.name,
              slug: payment.slug,
              description: payment.description,
              trust: payment.trust,
              fields: _.map(payment.fields, (field) => {
                const e = _.find(p.fields, { slug: field.slug });
                return {
                  slug: field.slug,
                  type: field.type,
                  label: field.label,
                  options: field.options,
                  value: _.get(e, 'value') || '',
                };
              }),
              file: payment.file,
            });
          }],
          coveragesAreas: ['delivery', 'payment', (results, cb) => {
            if (_.get(req, 'site.modules.coveragesAreas') && results.delivery && results.delivery.personalDelivery) {
              queryStore.coveragesAreas(req, results.store._id, cb);
            } else {
              return cb(null, []);
            }
          }],
          range: ['coveragesAreas', (results, cb) => {
            if (results.delivery && !results.delivery.personalDelivery) {
              return cb(null, false);
            }
            if (results.delivery && results.delivery.personalDelivery && !results.coveragesAreas.length) {
              errors.push({ field: 'delivery', msg: __('No puede atender su solicitud, elija otro medio de entrega') });
              // TODO: Enviar mensaje correo que la configuración tienda esta mal
              return cb(listErrors(400, null, errors));
            }
            const latitude = _.get(req.body, 'address.location.lat');
            const longitude = _.get(req.body, 'address.location.lng');
            if (!latitude || !longitude) {
              errors.push({ field: 'delivery', msg: __('No se puede encontrar la dirección de envío, Latitud y Longitud para este tipo de entrega') });
              // TODO: Enviar mensaje correo que la configuración tienda esta mal
              return cb(listErrors(400, null, errors));
            }
            async.mapLimit(results.coveragesAreas, 5, (area, cb) => {
              const inArea = geolib.isPointInPolygon(
                {
                  latitude,
                  longitude,
                },
                area.points.map((point) => ({
                  latitude: point.lat,
                  longitude: point.lng,
                })),
              );
              cb(null, { inArea, area });
            }, (_err, xresults) => {
              xresults = _.orderBy(xresults, ['area.price'], ['desc']);
              const isArea = _.find(xresults, { inArea: true });
              if (!isArea) {
                errors.push({ field: 'delivery', msg: __('No puede atender la solicitud por estar fuera de cobertura') });
                return cb(listErrors(400, null, errors));
              }
              // pone el precio en el envio
              results.delivery.price = isArea.area.price;
              cb(null, true);
            });
          }],
          // busca que el uuid no este
          findUUIDOrders: ['delivery', (results, cb) => {
            models.Order
              .countDocuments({
                tenancy: req.tenancy,
                browserUUID: body.cartID,
                storeID: results.store._id,
              })
              .exec(cb);
          }],
          checkUUID: ['findUUIDOrders', (results, cb) => {
            if (results.findUUIDOrders) {
              errors.push({ field: 'activeOrders', code: 1002, msg: __('Este carrito de compras ya se ha procesado.') });
            }
            if (errors.length) {
              return cb(listErrors(400, null, errors));
            }
            cb();
          }],
          validateProducts: ['store', (results, cb) => {
            validateProducts(req, results.store, store.cart, cb);
          }],
          checkProducts: ['validateProducts', (results, cb) => {
            store.cart = results.validateProducts.items;
            if (results.validateProducts.noActives.length || results.validateProducts.changePrice.length) {
              errors.push({
                code: 1000, store: slug, field: 'products', msg: __('Algunos productos no se encuentran disponibles en la tienda seleccionada, se ha actualizado el carrito'),
              });
              return cb(listErrors(400, null, errors));
            }
            cb();
          }],
        }, cb);
      }, cb);
    }],
    save: ['orders', (results, cb) => {
      async.map(results.orders, (order, cb) => {
        async.auto({
          order: (cb) => {
            const items = _.values(order.validateProducts.items);

            const orderDoc = {
              tenancy: req.tenancy,
              storeID: order.store._id,
              store: {
                slug: order.store.slug,
                name: order.store.name,
                images: { logo: _.get(order, 'store.images.logo') },
              },
              // Id del navegador, para evitar una misma orden varias veces
              browserUUID: body.cartID,
              userID: req.user._id,
              userData: {
                name: req.user.personalInfo.name,
                cellphone: `${req.user.personalInfo.callsign}${req.user.personalInfo.cellphone}`,
                firstname: req.user.personalInfo.firstname,
                lastname: req.user.personalInfo.lastname,
                email: req.user.email,
              },
              products: items,
              order: {
                items: items.length,
                subtotal: _.sumBy(items, (o) => o.price * o.quantity),
                shipping: order.delivery.price,
                total: (_.sumBy(items, (o) => o.price * o.quantity) + order.delivery.price),
              },
              delivery: {
                name: order.delivery.name,
                slug: order.delivery.slug,
                personalDelivery: order.delivery.personalDelivery,
              },
              payment: order.payment,
              statuses: [{
                status: 'created',
                userID: req.user._id,
              }],
            };

            if (orderDoc.payment.slug === 'contra-entrega' || orderDoc.total <= 0) {
              orderDoc.payment.pse = false;
            } else {
              orderDoc.payment.pse = true;
            }

            if (body.address && body.address.address) {
              orderDoc.address = {
                address: body.address.address,
                cellphone: `${req.user.personalInfo.callsign}${req.user.personalInfo.cellphone}`,
                city: body.address.city,
                neighborhood: _.get(_.find(body.address.form, { name: 'neighborhood' }), 'value'),
                extra: body.extra,
                location: {
                  type: 'Point',
                  coordinates: [_.get(body, 'address.location.lng') || 0, _.get(body, 'address.location.lat') || 0],
                },
              };
            }
            // Si el tipo de pago es contraentrega
            if (!orderDoc.payment.pse) {
              orderDoc.status = 'picking';
              orderDoc.statuses.push({
                status: 'picking',
                userID: req.user._id,
              });
            }
            const xorder = new models.Order(orderDoc);
            xorder.save(cb);
          },
          mailerAdmin: ['order', (results, cb) => {
            // correo solo para contra entrega
            if (results.order.status === 'created' || results.order.payment.pse) {
              return cb();
            }
            results.order.populate({
              path: 'storeID',
              select: 'name',
              populate: {
                path: 'userID',
                select: 'email personalInfo',
              },
            }, () => {
              const admin = _.get(results.order, 'storeID.userID');
              if (admin) {
                sqsMailer(req, {
                  to: { email: admin.email, name: admin.personalInfo.name },
                  subject: `Nueva Orden #${results.order.orderID}`,
                  template: 'seller-new-order-payment-against-delivery',
                  order: _.pick(results.order, ['_id', 'orderID']),
                }, admin,
                cb);
              } else {
                cb();
              }
            });
          }],
          mailerClient: ['order', (results, cb) => {
            // correo solo para contra entrega
            if (results.order.status === 'created' || results.order.payment.pse) {
              return cb();
            }
            sqsMailer(req, {
              to: { email: results.order.userData.email, name: results.order.userData.name },
              subject: `Orden #${results.order.orderID} Confirmada`,
              template: 'client-new-order-payment-against-delivery',
              order: _.pick(results.order, ['_id', 'orderID']),
            }, { _id: results.order.userID },
            cb);
          }],
        }, cb);
      }, cb);
    }],
  }, (err, results) => {
    if (err) {
      return next(err);
    }
    res.status(201).send({ orderIDs: _.map(results.save, (o) => o.orderID).join(','), orders: results.save });
  });
};
