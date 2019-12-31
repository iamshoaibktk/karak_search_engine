const accountSid = 'ACfac06eb20136dfaa4d3db21484cf5c54';
const accountToken = 'ddde53510e2b093200e2aed6b8bcd124';
const client = require('twilio')(accountSid, accountToken);

client.messages.create({
    from: '+13343841654',
    to: '+923459016286',
    body: 'Your confirmation code is 23423'
}).then((message) => {console.log(message.sid)});