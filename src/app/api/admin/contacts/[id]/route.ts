import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '../../../../../lib/mongodb';
import { ADMIN_COOKIE, isAdminTokenValid } from '../../../../../lib/admin-auth';
import Contact from '../../../../../models/Contact';

async function isAdmin() {
  const cookieStore = await cookies();
  return isAdminTokenValid(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const { status } = await request.json();
  if (!['new', 'read', 'archived'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  await connectToDatabase();
  const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  return NextResponse.json({ status: contact.status });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  await connectToDatabase();
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
