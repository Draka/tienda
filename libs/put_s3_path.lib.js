exports.putS3Path = (items, store) => {
  _.each(items, (o) => {
    o.imagesSizes = _.map(o.images, (i) => {
      const sizes = {};
      const s3 = process.env.NODE_ENV === 'production' ? config.url.s3 : '';
      const pathImg = `ecommerce/${store._id}/products/${o._id}/${i}`;

      _.each(global.imagesSizes, (is) => {
        sizes[`${is.x}x${is.y}_jpg`] = `${s3}/${pathImg}/${is.x}x${is.y}.jpg`;
      });

      _.each(global.imagesSizes, (is) => {
        sizes[`${is.x}x${is.y}_webp`] = `${s3}/${pathImg}/${is.x}x${is.y}.webp`;
      });
      sizes.original = `${s3}/${pathImg}/original`;
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
    const s3 = process.env.NODE_ENV === 'production' ? config.url.s3 : '';
    const pathImg = `ecommerce/${store._id}/logo`;

    _.each(global.imagesSizes, (is) => {
      sizes[`${is.x}x${is.y}_jpg`] = `${s3}/${pathImg}/${is.x}x${is.y}.jpg?v=${store.image}`;
    });

    _.each(global.imagesSizes, (is) => {
      sizes[`${is.x}x${is.y}_webp`] = `${s3}/${pathImg}/${is.x}x${is.y}.webp?v=${store.image}`;
    });
    sizes.original = `${s3}/${pathImg}/original`;
    store.imageSizes = sizes;
  });
};
