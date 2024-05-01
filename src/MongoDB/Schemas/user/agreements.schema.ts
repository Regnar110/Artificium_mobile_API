import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Agreement {
  @Prop()
  agreementField: string;
  @Prop()
  checked: boolean;
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);
