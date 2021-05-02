const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
  },
  publish: {
    type: Boolean,
    index: true,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  features: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  test: {
    type: Number,
    default: 0,
  },
  period: {
    type: Number,
    default: 1,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del('__plans__publish__');
  client.del(`__plan__${result._id}`);
  if (result.slug) {
    result.slug = _.kebabCase(_.deburr(result.slug));
    client.del(`__plan__${result.slug}`);
  }
  if (result.name && !result.slug) {
    result.slug = _.kebabCase(_.deburr(result.name));
  }
  next();
}
schema.post('validate', preUpdate);
schema.index({ tenancy: 1, slug: 1 }, { unique: true });

const Model = mongoose.model(`${appCnf.dbPrefix}plans`, schema);

module.exports = Model;
