import CryptoJS from 'crypto-js';

class EncryptService {
  secretKey = 'secret key routeMaker';

  encrypt(value: string) {
    return btoa(CryptoJS.AES.encrypt(value, this.secretKey).toString());
  }

  decrypt(value: string) {
    const bytes = CryptoJS.AES.decrypt(atob(value), this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

export default new EncryptService();
