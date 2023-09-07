import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const UserModel = model('User', UserSchema);

export default UserModel;
