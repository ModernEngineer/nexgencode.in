import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '../../../../../lib/mongodb';
import { ADMIN_COOKIE, isAdminTokenValid } from '../../../../../lib/admin-auth';
import ContentItem from '../../../../../models/ContentItem';

async function isAdmin() {
  const cookieStore = await cookies();
  return isAdminTokenValid(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  await connectToDatabase();
  const item = await ContentItem.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
  if (!item) return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  await connectToDatabase();
  const item = await ContentItem.findByIdAndDelete(id);
  if (!item) return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
