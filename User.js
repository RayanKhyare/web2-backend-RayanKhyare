const bcrypt = require('bcryptjs');



class User {
    constructor(firstname, lastname, email, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = this.convertPassword(password);



    }

    convertPassword(password) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                return hash;
            });
        });
    }
}

module.exports = User;