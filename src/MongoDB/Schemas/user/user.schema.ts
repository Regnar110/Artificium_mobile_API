import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AgreementSchema } from './agreements.schema';
import { AgreementContentInterface } from './schema.model';
import mongoose, { ObjectId } from 'mongoose';

@Schema({ versionKey: false })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop()
  password: string;

  @Prop({ type: [AgreementSchema] })
  agreementFields: AgreementContentInterface[];
}

export const UserSchema = SchemaFactory.createForClass(User);
