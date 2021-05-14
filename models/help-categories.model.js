const schema = new mongoose.Schema({
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}help-categories`,
    index: true,
  },
  order: {
    type: Number,
    default: 50,
  },
  name: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  text: {
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
  client.del(`__tenancy:${result.tenancy}__help-category__${result._id}`);
  client.del(`__tenancy:${result.tenancy}__help-categories__`);
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  next();
}

schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}help-categories`, schema);

module.exports = Model;
