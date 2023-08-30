import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

interface IToken extends Document {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
}

const TokenSchema = new Schema<IToken>({
  _id: { type: String, required: true, default: uuid },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt:{type: Date, required:true}
});
const Token = mongoose.model<IToken>('Token', TokenSchema);

interface INft extends Document {
  _id: string;
  tokens: IToken[];
  collectionName: string;
  userId: string;
  deletedAt?: Date;
}

const NftSchema = new Schema<INft>(
  {
    _id: { type: String, required: true, default: uuid },
    tokens: [TokenSchema],
    collectionName: { type: String, required: true },
    userId: { type: String, required: true },
    deletedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    autoCreate: false,
  }
);

const Nft = mongoose.model<INft>('Nft', NftSchema);

export  {Nft,Token,IToken};
