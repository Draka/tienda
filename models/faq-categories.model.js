const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
    immutable: true,
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
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__tenancy:${result.tenancy}__faq-category__${result._id}`);
  client.del(`__tenancy:${result.tenancy}__faq-categories__`);
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  next();
}

schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}faq-categories`, schema);

module.exports = Model;
