const { response } = require('express');
const { prisma } = require('../database');


/**
 * @method POST
 * @name suscribeToUser
 * @description este es el metodo empleado para crear un nuevo usuario en la plataforma
 * @params data: { username,password,email,categories }
 * @returns Usuario creado en la base de datos
 */
const suscribeToUser = async (req, res = response) => {
    const { subscriberId, subscribedToId } = req.params;
  
    try {
      const subscription = await prisma.subscription.create({
        data: {
          subscriberId: parseInt(subscriberId),
          subscribedToId: parseInt(subscribedToId),
        },
      });
  
      res.json(subscription);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error suscribiendo al usuario');
    }
  }

  /**
 * @method DELETE
 * @name unsubscribeFromUser
 * @description este es el metodo empleado para eliminar una suscripcion de un usuario
 * @params subscriberId, subscribedToId
 * @returns Mensaje indicando que la suscripcion fue eliminada
 */
const unsubscribeFromUser = async (req, res = response) => {
    const { subscriberId, subscribedToId } = req.params;
  
    try {
      await prisma.subscription.deleteMany({
        where: {
          subscriberId: parseInt(subscriberId),
          subscribedToId: parseInt(subscribedToId),
        },
      });
      res.json({ message: 'Suscripción eliminada' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error eliminando la suscripción');
    }
  }

  /**
 * @method GET
 * @name checkSubscription
 * @description este es el metodo empleado para verificar si un usuario está suscrito a otro
 * @params subscriberId: ID del usuario que quiere verificar si está suscrito
 * @params subscribedToId: ID del usuario al que se quiere verificar si se encuentra suscrito
 * @returns true si existe una suscripción, false si no existe
 */
const checkSubscription = async (req, res = response) => {
    const { subscriberId, subscribedToId } = req.params;
  
    try {
      const subscription = await prisma.subscription.findUnique({
        where: {
          subscriberId_subscribedToId: {
            subscriberId: parseInt(subscriberId),
            subscribedToId: parseInt(subscribedToId),
          },
        },
      });
  
      res.json({ isSubscribed: !!subscription });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error verificando suscripción');
    }
  }
  



module.exports = {suscribeToUser, unsubscribeFromUser, checkSubscription}