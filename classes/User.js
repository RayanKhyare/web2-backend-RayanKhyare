const bcrypt = require('bcryptjs')

class User {

    constructor(firstname, lastname, email, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }

    async hashPassword(password) {
        this.password = await bcrypt.hash(password, 12);
    }

    async unHashPassword(password) {
        return await bcrypt.compareSync(password, this.password);
    }
}

module.exports = User;