import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Contact from '../../../models/Contact';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) return NextResponse.json({ error: 'Name, valid email, and message are required.' }, { status: 400 });
    await connectToDatabase();
    await Contact.create({ name, email, company: body.company, budget: body.budget, message });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unable to save contact submission.' }, { status: 500 });
  }
}
