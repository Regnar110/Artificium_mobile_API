import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Agreement {
  @Prop()
  agreementField: string;
  @Prop()
  checked: boolean;
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);
