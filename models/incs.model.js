const schema = new mongoose.Schema({
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
