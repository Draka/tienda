const { deleteKeysByPattern } = require('../libs/redis.lib');

const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
  },
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}stores`,
    index: true,
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}categories`,
    index: true,
  },
  name: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  slugLong: {
    type: String,
    trim: true,
    index: true,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  deleteKeysByPattern(`__tenancy:${result.tenancy}__category__*`);
  client.del(`__tenancy:${result.tenancy}__category_tree__`);
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  next();
}

schema.post('validate', preUpdate);

schema.post('remove', (result) => {
  deleteKeysByPattern(`__tenancy:${result.tenancy}__category__*`);
  client.del(`__tenancy:${result.tenancy}__category_tree__`);
});

schema.index({
  tenancy: 1, storeID: 1, categoryID: 1, slug: 1,
}, { unique: true });
const Model = mongoose.model(`${appCnf.dbPrefix}categories`, schema);

module.exports = Model;
