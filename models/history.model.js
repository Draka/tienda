mongoose.set('useFindAndModify', false);

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
  productIDs: [{
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${appCnf.dbPrefix}products`,
    },
  }],
}, { timestamps: true });

function preUpdate(result, next) {
  client.del(`__tenancy:${result.tenancy}__histories__${result.userID}`);
  next();
}
schema.post('validate', preUpdate);

schema.index({ tenancy: 1, userID: 1 }, { unique: true });

const Model = mongoose.model(`${appCnf.dbPrefix}histories`, schema);

module.exports = Model;
