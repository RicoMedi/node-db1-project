const router = require('express').Router()
const Account = require('./accounts-model')

const md = require('./accounts-middleware')
router.get('/', async (req, res, next) => {
  try{
    const fecthed= await Account.getAll()
    res.status(200).json(fecthed)
  }catch (err){
    next(err)
  }
})

router.get('/:id', md.checkAccountId, async(req, res, next) => {
try{ 
  const account = await Account.getById(req.params.id)
  res.json(account)
}catch(err){
  next(err)
}
})

router.post(
  "/",
  md.checkAccountPayload, md.checkAccountNameUnique,
  (req, res, next) => {
    // DO YOUR MAGIC
    const { name, budget } = req.body;
    Account.create({
      name: name.trim(),
      budget: budget,
    })
      .then((newAccount) => {
        res.status(201).json(newAccount);
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put('/:id', md.checkAccountId, md.checkAccountPayload, md.checkAccountNameUnique, async (req, res, next) => {
 
 try{
  const updated = await Account.updateById(req.params.id, req.body)
  res.json(updated)
 }catch(err){
  next(err)
 }
});

router.delete('/:id', md.checkAccountId,async(req, res, next) => {
try{
await Account.deleteById(req.params.id)
res.json(req.account)
}catch(err){
  next(err)
}
})

router.use((err, req, res, next) => { // eslint-disable-line
 res.status(err.status || 500).json({
  message: err.message,
  stack: err.stack,
 })
})

module.exports = router;
