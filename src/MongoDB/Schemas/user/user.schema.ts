import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AgreementSchema } from './agreements.schema';
import { AgreementContentInterface } from './schema.model';

@Schema()
export class User {
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
