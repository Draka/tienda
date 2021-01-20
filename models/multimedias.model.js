/* eslint-disable no-param-reassign */
const schema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  multimediaID: {
    type: Number,
    index: {
      unique: true,
    },
  },
  type: {
    type: String,
    trim: true,
  },
  files: {},
}, { timestamps: true });

function preSave(next) {
  const doc = this;
  if (this.isNew) {
    models.Inc.findOneAndUpdate({ id: 'multimediaID' }, { $inc: { seq: 1 } }, (error, inc) => {
      if (error) {
        return next(error);
      }
      if (!inc) {
        const inc = new models.Inc({ id: 'multimediaID', seq: 1 });
        inc.save((error) => {
          if (error) {
            return next(error);
          }
          doc.multimediaID = 0;
          next();
        });
      } else {
        doc.multimediaID = inc.seq;
        next();
      }
    });
  } else {
    next();
  }
}
schema.pre('save', preSave);

function preUpdate(result, next) {
  client.del('__multimedias__');
  next();
}
schema.post('validate', preUpdate);
const Model = mongoose.model(`${appCnf.dbPrefix}multimedias`, schema);

module.exports = Model;
