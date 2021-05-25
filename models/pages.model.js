const { deleteKeysByPattern } = require('../libs/redis.lib');

const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}users`,
    index: true,
  },
  publish: {
    type: Boolean,
    index: true,
    default: false,
  },
  active: {
    type: Boolean,
    index: true,
    default: false,
  },
  auth: {
    type: Boolean,
    index: true,
    default: false,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  seo: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  html: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  deleteKeysByPattern(`__tenancy:${result.tenancy}__page_render__*`);
  client.del(`__tenancy:${result.tenancy}__page__${result._id}`);
  if (result.slug) {
    result.slug = _.kebabCase(_.deburr(result.slug));
    client.del(`__tenancy:${result.tenancy}__page__${result.slug}`);
  }
  if (result.title && !result.slug) {
    result.slug = _.kebabCase(_.deburr(result.title));
    client.del(`__tenancy:${result.tenancy}__page__${result.slug}`);
  }
  next();
}
schema.post('validate', preUpdate);
schema.index({ tenancy: 1, slug: 1 }, { unique: true });

const Model = mongoose.model(`${appCnf.dbPrefix}pages`, schema);

module.exports = Model;
