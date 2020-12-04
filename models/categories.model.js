const schema = new mongoose.Schema({
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${config.dbPrefix}stores`,
    index: true,
    required: true,
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${config.dbPrefix}categories`,
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
  client.del(`__category__${result._id}`);
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  next();
}

schema.post('validate', preUpdate);
schema.index({ storeID: 1, categoryID: 1, slug: 1 }, { unique: true });
const Model = mongoose.model(`${config.dbPrefix}categories`, schema);

module.exports = Model;
