import LegalPage from '../components/sections/LegalPage';
import { legalUpdated, termsSections } from '../data/legal';
import { useSeo } from '../hooks/useSeo';

export default function Terms() {
  useSeo();
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="The terms that apply when you use our website and engage NexGenCode for services."
      updated={legalUpdated}
      sections={termsSections}
    />
  );
}
