//creating a new schedule schema for the database

import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  memberId: mongoose.Types.ObjectId; // ID osoby z tabeli Family_members
  day: string;          
  time_start: number;
  time_end: number; 
  task: string;        
}

const ScheduleSchema: Schema = new Schema({
 memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family_member', required: true },
  
  day: { 
    type: String, 
    required: true, 
    enum: ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'] 
  },
  
  time_start: { type: Number, required: true },
  time_end: { type: Number, required: true },
  task: { type: String, required: true }
});

export default mongoose.model<ITask>('Task', ScheduleSchema);