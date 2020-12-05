exports.putS3Path = (items, store) => {
  _.each(items, (o) => {
    o.imagesSizes = _.map(o.images, (i) => {
      const sizes = {};
      const pathImg = `ecommerce/${store._id}/products/${o._id}/${i}`;

      _.each(global.imagesSizes, (is) => {
        sizes[`${is.x}x${is.y}_jpg`] = `${config.url.static}${pathImg}/${is.x}x${is.y}.jpg`;
      });

      _.each(global.imagesSizes, (is) => {
        sizes[`${is.x}x${is.y}_webp`] = `${config.url.static}${pathImg}/${is.x}x${is.y}.webp`;
      });
      sizes.original = `${config.url.static}${pathImg}/original`;
      return sizes;
    });
  });
};

exports.putS3LogoPath = (stores) => {
  _.each(stores, (store) => {
    if (!store.image) {
      return;
    }
    const sizes = {};
    const pathImg = `ecommerce/${store._id}/logo`;

    _.each(global.imagesSizes, (is) => {
      sizes[`${is.x}x${is.y}_jpg`] = `${config.url.static}${pathImg}/${is.x}x${is.y}.jpg?v=${store.image}`;
    });

    _.each(global.imagesSizes, (is) => {
      sizes[`${is.x}x${is.y}_webp`] = `${config.url.static}${pathImg}/${is.x}x${is.y}.webp?v=${store.image}`;
    });
    sizes.original = `${config.url.static}${pathImg}/original`;
    store.imageSizes = sizes;
  });
};
