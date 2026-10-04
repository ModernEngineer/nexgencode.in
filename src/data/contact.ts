export const contactInfo = {
  email: 'info@nexgencode.in',
  phoneDisplay: '+91 94501 90953',
  phoneHref: 'tel:+919450190953',
  whatsappNumber: '919554058799',
  office: '228B/1A, Lukarganj, Prayagraj, Uttar Pradesh 211001',
  officeStreet: '228B/1A, Lukarganj',
  officePostalCode: '211001',
  officeMapUrl: 'https://www.google.com/maps/search/?api=1&query=228B%2F1A%2C+Lukarganj%2C+Prayagraj%2C+Uttar+Pradesh+211001',
};

export const whatsappLink = (message = "Hi NexGenCode, I'd like to know more about your services.") =>
  `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
