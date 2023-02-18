import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, type: String })
  firstname: string;
  @Prop({ required: true, type: String })
  lastname: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ required: true, type: String })
  phone: String;
  @Prop({ required: false, type: String, default: 'Google Sign In' })
  password: string;
  @Prop({ type: String, default: '' })
  profile: string;
  @Prop({ type: String, default: '' })
  sub: string;
  @Prop({ type: [String], enum: ['admin', 'user'], default: ['user'] })
  roles: String[];
  @Prop({ type: String })
  resetPasswordToken?: string;
  @Prop({ type: Date })
  resetPasswordExpiration?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
