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
  description: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  text: {
    type: String,
    trim: true,
  },
  html: {
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
  client.del(`__tenancy:${result.tenancy}__email-template__${result._id}`);
  if (result.name) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'name')));
  }
  next();
}

schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}emails-templates`, schema);

module.exports = Model;
