module.exports = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  if (req.method === "POST") {
    Number.isInteger(Number(phoneNumber)) && !isNaN(Number(phoneNumber)) ? next() : res.status(400).json({ invalidForm: true });
  } else {
    if (req.phoneNumber.idUser == req.params.idUser) {
      Number.isInteger(Number(phoneNumber)) && !isNaN(Number(phoneNumber)) ? next() : res.status(400).json({ invalidForm: true });
    } else {
      res.status(403).json({ invalidToken: true });
    }
  }
};