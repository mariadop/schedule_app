//creating a new familiy member schema for the database

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IMember extends Document {
  name: string;
  role: string;
  login: string;
  password: string;
  color: string;  //colour in the calendar
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const MemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  login: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  color: { type: String, default: '#3498db' }
}, {
  timestamps: true
});

MemberSchema.pre<IMember>('save', async function() {
  if (!this.isModified('password')) return;
  
  // Zamieniamy hasło na "hash" (bełkot)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// METODA DO LOGOWANIA: Porównuje wpisane hasło z tym z bazy
MemberSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IMember>('Member', MemberSchema);