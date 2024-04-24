import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AgreementSchema } from './agreements.schema';
import { AgreementContentInterface } from './schema.model';

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  password: string;

  @Prop({ type: [AgreementSchema] })
  agreementFields: AgreementContentInterface[];
}

export const UserSchema = SchemaFactory.createForClass(User);
