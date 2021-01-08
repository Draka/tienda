const schema = new mongoose.Schema({
  publish: {
    type: Boolean,
    index: true,
    default: false,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
  },
  html: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__document__${result._id}`);
  if (result.slug) {
    result.slug = _.kebabCase(_.deburr(result.slug));
    client.del(`__document__${result.slug}`);
  }
  if (result.title && !result.slug) {
    result.slug = _.kebabCase(_.deburr(result.title));
  }
  next();
}
schema.post('validate', preUpdate);

const Model = mongoose.model(`${appCnf.dbPrefix}documents`, schema);

module.exports = Model;