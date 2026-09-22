import mongoose, { Schema, type Model } from 'mongoose';

export interface ContactDocument extends mongoose.Document {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: Date;
}

const contactSchema = new Schema<ContactDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true },
    budget: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Contact: Model<ContactDocument> = mongoose.models.Contact ?? mongoose.model<ContactDocument>('Contact', contactSchema);

export default Contact;
