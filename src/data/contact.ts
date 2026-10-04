export const contactInfo = {
  email: 'info@nexgencode.in',
  phoneDisplay: '+91 94501 90953',
  phoneHref: 'tel:+919450190953',
  whatsappNumber: '919554058799',
  office: 'Lukarganj, Prayagraj, Uttar Pradesh',
  officeLocality: 'Lukarganj',
  officeMapUrl: 'https://www.google.com/maps/search/?api=1&query=Lukarganj%2C+Prayagraj%2C+Uttar+Pradesh',
};

export const whatsappLink = (message = "Hi NexGenCode, I'd like to know more about your services.") =>
  `https://wa.me/${contactInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
