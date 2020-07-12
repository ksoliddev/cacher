const crypto = require('crypto');

class Security {

    private algorithm : string = 'aes-128-ctr';
    private key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
    private iv  = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');

    private encryptText(cipher : any, text : string){
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    private decryptText(decipher : any, text : string){
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
      }

    private encryptBuffer(cipher : any, buffer : Buffer){
        var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
        return crypted;
      }

    private decryptBuffer(decipher : any, buffer: Buffer){
        var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
        return dec;
      }

    public encrypt(data : any, type = 'text'){
        var cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        switch (type){
            case 'text' : return this.encryptText(cipher, data);
            case 'buffer' : return this.encryptBuffer(cipher, data);
            default: return cipher;
        }
    }

    public decrypt(data : any, type = 'text'){
        var decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)
        switch (type){
            case 'text' : return this.decryptText(decipher, data);
            case 'buffer' : return this.decryptBuffer(decipher, data);
            default: return decipher;
        }
    }

}

export default new Security();

