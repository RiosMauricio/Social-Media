const { Router } = require('express');
const {suscribeToUser, unsubscribeFromUser, checkSubscription} = require('../controllers/subscription.controller')
const { verifyToken } = require('../controllers/user.controller')

const router = Router();

router.post('/suscribeToUser/:subscriberId/:subscribedToId', verifyToken, suscribeToUser)
router.get('/checkSubscription/:subscriberId/:subscribedToId', verifyToken, checkSubscription)
router.delete('/unsubscribeFromUser/:subscriberId/:subscribedToId', verifyToken, unsubscribeFromUser)


module.exports = router;
