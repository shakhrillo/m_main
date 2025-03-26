const { mongo } = require("mongoose");

const ushSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Invalid telephone number');
        }
      },
    },
  },
  {
    timestamps: true,
  }
);