const schema = new mongoose.Schema({
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `${appCnf.dbPrefix}help-categories`,
    index: true,
  },
  active: {
    type: Boolean,
    index: true,
    default: false,
  },
  question: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  answer: {
    type: String,
    trim: true,
    index: true,
  },
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__help__${result._id}`);
  if (result.categoryID) {
    client.del(`__helps__categoryID__${result.categoryID}`);
  }
  if (result.question) {
    result.slug = _.kebabCase(_.deburr(_.get(result, 'question')));
  }
  next();
}

schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}help`, schema);

module.exports = Model;