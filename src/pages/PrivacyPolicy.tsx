import LegalPage from '../components/sections/LegalPage';
import { legalUpdated, privacySections } from '../data/legal';
import { useSeo } from '../hooks/useSeo';

export default function PrivacyPolicy() {
  useSeo();
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How NexGenCode collects, uses and protects the information you share with us."
      updated={legalUpdated}
      sections={privacySections}
    />
  );
}
