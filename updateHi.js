const fs = require('fs');
const hiPath = 'g:/charifund/charifund-frontend/public/locales/hindi/translation.json';
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const hiUpdates = {
  'Join Our Social Mission': 'हमारे सामाजिक मिशन से जुड़ें',
  'Become a Volunteer?': 'स्वयंसेवक बनें',
  'Join Youth Util Welfare Association and contribute your time, skills and ideas to meaningful social service initiatives.': 'युवा इंडिया से जुड़कर अपना समय, कौशल और विचार समाज सेवा के विभिन्न कार्यों में योगदान करें।',
  'Join Us': 'हमसे जुड़ें',
  'Support Our Social Initiatives': 'हमारे सामाजिक कार्यों में सहयोग करें',
  'Support Youth Util Welfare Association': 'युवा इंडिया का सहयोग करें',
  'Your support helps us continue our work in education, child welfare, women empowerment, healthcare, blood donation and environmental protection.': 'आपका सहयोग शिक्षा, बाल कल्याण, महिला सशक्तिकरण, स्वास्थ्य, रक्तदान एवं पर्यावरण संरक्षण जैसे सामाजिक कार्यों को आगे बढ़ाने में मदद करता है।',
  'Section6 Donate Now': 'सहयोग करें',
  'Together for a Better Society': 'मिलकर बनाएं बेहतर समाज'
};

Object.assign(hi, hiUpdates);
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2), 'utf8');
console.log('HI translations updated successfully');
