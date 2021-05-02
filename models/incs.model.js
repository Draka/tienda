const schema = new mongoose.Schema({
  tenancy: {
    type: String,
    index: true,
    required: true,
  },
  id: {
    type: String,
    required: true,
    index: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
}, { timestamps: false });

const Model = mongoose.model(`${appCnf.dbPrefix}incs`, schema);

module.exports = Model;
