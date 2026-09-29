const fs = require('fs');
const enPath = 'g:/charifund/charifund-frontend/public/locales/english/translation.json';
const hiPath = 'g:/charifund/charifund-frontend/public/locales/hindi/translation.json';

let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const enUpdates = {
  'Meet Our Volunteer Team': 'Meet Our Volunteer Team',
  'Meet Our Volunteer': 'Meet Our Volunteer',
  'Team': 'Team',
  ' Members': ' Members',
  'Er. Ratnesh Kumar Tiwari': 'Er. Ratnesh Kumar Tiwari',
  'National President': 'National President',
  'Leading Youth Util Welfare Association with a commitment to social service, youth empowerment and community development.': 'Leading Youth Util Welfare Association with a commitment to social service, youth empowerment and community development.'
};

const hiUpdates = {
  'Meet Our Volunteer Team': 'हमारी स्वयंसेवी टीम से परिचय',
  'Meet Our Volunteer': 'हमारी स्वयंसेवी',
  'Team': 'टीम',
  ' Members': ' के सदस्य',
  'Er. Ratnesh Kumar Tiwari': 'इंजि. रत्नेश कुमार तिवारी',
  'National President': 'राष्ट्रीय अध्यक्ष',
  'Leading Youth Util Welfare Association with a commitment to social service, youth empowerment and community development.': 'सामाजिक सेवा, युवा सशक्तिकरण एवं सामुदायिक विकास के प्रति समर्पण के साथ यूथ युटिल वेलफेयर एसोसिएशन का नेतृत्व।'
};

Object.assign(en, enUpdates);
Object.assign(hi, hiUpdates);

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(hiPath, JSON.stringify(hi, null, 2), 'utf8');
console.log('Translations updated successfully');
