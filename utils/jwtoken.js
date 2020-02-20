var jwt = require("jsonwebtoken");

class JWToken {
  generateToken(user) {
    var u = {
      username: user.username,
      id: user.id
    };
    return (token = jwt.sign(u, "password", {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    }));
  }

  verify(token, 'password', function(err, token) {
    if (err) {
      return res.status(401).send({
        ok: false,
        message: 'Toket inválido'
      });
    } else {
      req.token = token
      next()
    }
  });
}

module.exports = new JWToken();