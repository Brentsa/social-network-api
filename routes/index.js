const router = require('express').Router();
const apiRoutes = require('./api/index');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).send('<h1>Page not found. Sorry!</h1>');
});

module.exports = router;