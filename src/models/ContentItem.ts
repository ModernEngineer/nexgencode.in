import mongoose, { Schema, type Model } from 'mongoose';

export type ContentKind = 'project' | 'service' | 'job';

export interface ContentItemDocument extends mongoose.Document {
  kind: ContentKind;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  category?: string;
  url?: string;
  location?: string;
  tags: string[];
  features: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contentItemSchema = new Schema<ContentItemDocument>(
  {
    kind: { type: String, enum: ['project', 'service', 'job'], required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
    url: { type: String, trim: true },
    location: { type: String, trim: true },
    tags: { type: [String], default: [] },
    features: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

contentItemSchema.index({ kind: 1, slug: 1 }, { unique: true });

const ContentItem: Model<ContentItemDocument> = mongoose.models.ContentItem ?? mongoose.model<ContentItemDocument>('ContentItem', contentItemSchema);

export default ContentItem;
