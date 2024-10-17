import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RegisterAgreement {
  @Prop()
  agreementField: string;
  @Prop()
  checked: boolean;
}

export const RegisterAgreementSchema =
  SchemaFactory.createForClass(RegisterAgreement);
