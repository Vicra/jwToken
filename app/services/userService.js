const dbManager = require('../db/dbmanager')
const dbService = new dbManager("wepapi");

class UserService {
    async isValidUser(user) {
        const SQL =
            `select * 
        from usuarios
        where usuario = '${user.usuario}'
        and contrasena = '${user.contrasena}'
        `;
        const response = await dbService.execute('wepapi', SQL);
        console.log(response);
        if (response.length)
            return true
        return false
    }
}

module.exports = new UserService();