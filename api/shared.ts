import crypto from "crypto";

export const DOWNLOAD_LINKS: Record<string, string> = {
  'ronix-vn-32': 'https://wrdcdn.net/r/154522/1772784195927/Ronix_VNG_32Bits-2.710.706.apk',
  'ronix-window': 'https://wearedevs.net/d/Ronix',
  'ronix-vn-64': 'https://wrdcdn.net/r/154522/1772783652438/Ronix_VNG_64Bits-2.710.706.apk',
  'ronix-global-32': 'https://wrdcdn.net/r/154522/1773016642772/Ronix_32Bits-2.710.707_EMU_FIX.apk',
  'ronix-global-64': 'https://wrdcdn.net/r/154522/1772697006689/Ronix_64Bits-2.710.707.apk',
  'jjsploit-global-32': 'https://wrdcdn.net/r/103473/1772684331411/JJSploit_32Bits-2.710.707.apk',
  'jjsploit-global-64': 'https://wrdcdn.net/r/103473/1773521561112/JJSploit_64Bits-2.711.876.apk',
  'jjsploit-vn-32': 'https://wrdcdn.net/r/103473/1772814003810/JJSploit_VNG_32Bits-2.710.706.apk',
  'jjsploit-vn-64': 'https://wrdcdn.net/r/103473/1772814173580/JJSploit_VNG_64Bits-2.710.706.apk',
  'delta-vn': 'https://cdn.gloopup.net/file/Delta-2.711.871-VN.apk',
  'delta-global': 'https://drive.google.com/uc?export=download&id=1SGfbWKrcqBsKE5NK3ujhUI1WDPMfmsvm',
  'codex-global': 'https://drive.google.com/uc?export=download&id=17qjldMIUe7ufg2XIkk6y0t-7kD4fOuWR',
  'vega-x-global': 'https://github.com/1f0yt/community/releases/download/Vegax/Vega.X.apk'
};

const SECRET_KEY_BUFFER = crypto.scryptSync(process.env.SECRET_KEY || 'default_vercel_secret_key_12345', 'salt', 32);

export function encrypt(text: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY_BUFFER, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY_BUFFER, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
