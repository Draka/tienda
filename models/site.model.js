/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    required: true,
    index: {
      unique: true,
      sparse: true,
    },
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  email: {
    title: {
      type: String,
      trim: true,
    },
    emailNoreply: {
      type: String,
      trim: true,
    },
    emailInfo: {
      type: String,
      trim: true,
    },
  },
  contacts: [{
    slug: {
      type: String,
      trim: true,
    },
    value: {
      type: String,
      trim: true,
    },
  }],
  images: {
    favicon: {},
    favpng: {},
    logoTop: {},
    logoSquare: {},
    logoEmail: {},
    social: {},
  },
  sameAs: [{
    type: String,
    trim: true,
  }],
  style: {
    emailColor: {
      type: String,
      trim: true,
    },
    base: {
      type: String,
      trim: true,
    },
    css: {
      type: String,
      trim: true,
    },
    header: {
      type: String,
      trim: true,
    },
    headerFontClass: {
      type: String,
      trim: true,
    },
    footer: {
      type: String,
      trim: true,
    },
  },
  trm: {
    date: {
      type: String,
      trim: true,
    },
    cop: {
      type: Number,
    },
  },
  modules: {
    coverageAreas: {
      type: Boolean,
      default: false,
    },
    deliveries: {
      type: Boolean,
      default: false,
    },
    deliveryPrice: {
      type: Number,
      default: 0,
    },
    deliveryFree: {
      type: Number,
      default: 0,
    },
    payments: {
      type: Boolean,
      default: false,
    },
    socialMedia: {
      type: Boolean,
      default: false,
    },
    places: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Boolean,
      default: false,
    },
    storesMax: {
      type: Number,
      default: 1,
    },
    imagesMax: {
      type: Number,
      default: 10,
    },
    productsMax: {
      type: Number,
      default: 10,
    },
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__tenancy:${result.tenancy}__site__`);
  if (result.url && result.url[result.url.length - 1] !== '/') {
    result.url += '/';
  }
  next();
}
schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}sites`, schema);

module.exports = Model;
