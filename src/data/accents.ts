// Gradients an admin can pick for a project card without a screenshot.
// Classes are listed literally so Tailwind generates them; unknown values fall back to the first one.
export const projectAccents = [
  { value: 'from-sky-500 to-cyan-500', label: 'Sky' },
  { value: 'from-indigo-500 to-blue-500', label: 'Indigo' },
  { value: 'from-violet-500 to-indigo-500', label: 'Violet' },
  { value: 'from-fuchsia-500 to-pink-500', label: 'Pink' },
  { value: 'from-emerald-500 to-teal-500', label: 'Emerald' },
  { value: 'from-amber-500 to-orange-500', label: 'Orange' },
  { value: 'from-rose-500 to-red-500', label: 'Red' },
  { value: 'from-slate-600 to-slate-800', label: 'Slate' },
];

export const accentClass = (value?: string | null) =>
  projectAccents.find((a) => a.value === value)?.value ?? projectAccents[0]!.value;
