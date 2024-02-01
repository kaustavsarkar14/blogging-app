const AccessSchema = require("../Schema/AccessSchema");

const rateLimit = async (req, res, next) => {
  const sessionId = req.session.id;
  try {
    const accessDb = await AccessSchema.findOne({ sessionId });
    if (accessDb) {
      if (new Date().getTime() - new Date(accessDb.time).getTime() < 1000)
        return res.send({ status: 400, message: "Too many requests" });
      accessDb.time = Date.now();
      await accessDb.save();
      next( );
    }
    const accessObj = new AccessSchema({ sessionId, time: Date.now() });
    await accessObj.save();
  } catch (error) {
    console.log(error);
    return res.send({ status: 500, message: "accessdb error" });
  }
};
module.exports = rateLimit;
