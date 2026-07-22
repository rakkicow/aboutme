const fs = require('fs');
let html = fs.readFileSync('public/weather/index.html', 'utf8');

const countryCodes = {
  'Netherlands': 'NL', 'Greece': 'GR', 'New Zealand': 'NZ', 'Thailand': 'TH',
  'Spain': 'ES', 'China': 'CN', 'Germany': 'DE', 'Argentina': 'AR', 'Egypt': 'EG',
  'South Africa': 'ZA', 'Denmark': 'DK', 'India': 'IN', 'United Arab Emirates': 'AE',
  'Ireland': 'IE', 'Scotland': 'GB', 'Finland': 'FI', 'Turkey': 'TR', 'Indonesia': 'ID',
  'Japan': 'JP', 'Nigeria': 'NG', 'Peru': 'PE', 'Portugal': 'PT', 'United Kingdom': 'GB',
  'Mexico': 'MX', 'Russia': 'RU', 'Kenya': 'KE', 'Italy': 'IT', 'Norway': 'NO',
  'France': 'FR', 'Australia': 'AU', 'Czechia': 'CZ', 'Iceland': 'IS', 'Brazil': 'BR',
  'South Korea': 'KR', 'Singapore': 'SG', 'Sweden': 'SE', 'Iran': 'IR', 'Canada': 'CA',
  'Austria': 'AT', 'Poland': 'PL', 'Switzerland': 'CH'
};

const regex = /\[([^\]]+)\]/g;
// ... wait, simpler to just match the LOCAL array manually or do a simple replace
