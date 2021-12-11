const bcrypt = require('bcryptjs')

class User {

    constructor(firstname, lastname, email) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
    }

    async hashPassword(password) {

        this.password = await bcrypt.hash(password, 12);

    }
}

module.exports = User;