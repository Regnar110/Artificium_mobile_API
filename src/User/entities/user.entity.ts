import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AgreementSchema } from 'src/MongoDB/Schemas/user/agreements.schema';

interface AgreementContentInterface {
  agreementField: string;
  checked: boolean;
}

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

  @Prop()
  friendList: Array<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
