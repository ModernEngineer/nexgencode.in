import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '../../../../lib/mongodb';
import { ADMIN_COOKIE, isAdminTokenValid } from '../../../../lib/admin-auth';
import ContentItem, { type ContentKind } from '../../../../models/ContentItem';

async function isAdmin() {
  const cookieStore = await cookies();
  return isAdminTokenValid(cookieStore.get(ADMIN_COOKIE)?.value);
}

function normalize(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean) : [];
}

export async function GET(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectToDatabase();
  const kind = new URL(request.url).searchParams.get('kind');
  const filter: { kind?: ContentKind } = kind && ['project', 'service', 'job'].includes(kind) ? { kind: kind as ContentKind } : {};
  const items = await ContentItem.find(filter).sort({ updatedAt: -1 }).lean();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const kind = normalize(body.kind) as ContentKind;
  const title = normalize(body.title);
  const slug = normalize(body.slug);
  const summary = normalize(body.summary);
  if (!['project', 'service', 'job'].includes(kind) || !title || !slug || !summary) return NextResponse.json({ error: 'Type, title, slug, and summary are required.' }, { status: 400 });
  await connectToDatabase();
  const item = await ContentItem.create({ kind, title, slug, summary, description: normalize(body.description), category: normalize(body.category), url: normalize(body.url), location: normalize(body.location), tags: normalizeList(body.tags), features: normalizeList(body.features), active: body.active !== false });
  return NextResponse.json(item, { status: 201 });
}
