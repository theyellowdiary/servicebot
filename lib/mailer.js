let SystemOptions = require("../models/system-options");
let transporter = require("../config/transporter");
let _ = require("lodash");

let sendMail = function (address, message, subject) {
    SystemOptions.findAll(undefined, undefined, function (result) {
        let company_email = result.filter(option => {
            return option.data.option == 'company_email'
        })[0].get("value");
        let company_name = result.filter(option => {
            return option.data.option == 'company_name'
        })[0].get("value");
        let mailOptions = {
            from: `"${company_name}" <${company_email}>`, // sender address
            to: address, // list of receivers
            subject: subject, // Subject line
            html: message, // html body
            text: message // text only body
        };


        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.error(error);
            }
            console.log('Message sent: ' + info.response);
        });
    });
};

module.exports = sendMail;
