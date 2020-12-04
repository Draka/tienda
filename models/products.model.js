const schema = new mongoose.Schema({
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${config.dbPrefix}stores`,
    index: true,
    required: true,
  },
  publish: {
    type: Boolean,
    index: true,
    default: false,
  },
  delete: {
    type: Boolean,
    index: true,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  inventory: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  sku: {
    type: String,
    trim: true,
    index: true,
  },
  upc: {
    type: String,
    trim: true,
    index: true,
  },
  brandText: {
    type: String,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
  },
  longDescription: {
    type: String,
    trim: true,
  },
  imagesURLs: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    trim: true,
  }],
  imagesSizes: [],
  categoryIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: `${config.dbPrefix}categories`,
    index: true,
  }],
  categoryText: [{
    type: String,
    trim: true,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  features: [{
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    value: {
      type: String,
      trim: true,
    },
  }],
  export: {
    type: Date,
  },
  digital: {
    is: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      trim: true,
    },
  },
  available: {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
  },
  groups: [{
    name: {
      type: String,
      trim: true,
    },
    products: [
      {
        meta: {
          type: String,
          trim: true,
        },
        aux: {
          type: String,
          trim: true,
        },
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: `${config.dbPrefix}products`,
        },
      },
    ],
  }],
  fix: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__product__${result._id}`);
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  if (result.features) {
    result.features.forEach((e) => {
      e.slug = _.kebabCase(_.deburr(e.name));
    });
  }
  next();
}
schema.post('validate', preUpdate);

schema.index({ storeID: 1, sku: 1 }, { unique: true });

const Model = mongoose.model(`${config.dbPrefix}products`, schema);

module.exports = Model;
