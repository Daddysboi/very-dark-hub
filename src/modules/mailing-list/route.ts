import express from 'express';

import validate from '../../validators/validate';
import { mailingListController } from './controller';
import { commonValidation } from '../../validators/commonValidation';
import { grantAccess } from '../../validators/validateAccessControl';
import { Resources } from '../../config/roles';
import { authenticateJWT } from '../../middlewares/jwt';

const mailingListRouter = express.Router();

/**
 * Mailing list routes
 */
mailingListRouter
  .route('/')
  .post(validate({ body: commonValidation.EmailSchema }), mailingListController.subscribeToMailingList)
  .get(authenticateJWT, grantAccess('read', 'any', Resources.SUPPORT), mailingListController.getAllSubscribers);

mailingListRouter
  .route('/:email')
  .delete(
    authenticateJWT,
    grantAccess('delete', 'any', Resources.SUPPORT),
    validate({ params: commonValidation.EmailSchema }),
    mailingListController.unsubscribeFromMailingList,
  )
  .get(
    authenticateJWT,
    grantAccess('read', 'any', Resources.SUPPORT),
    validate({ params: commonValidation.EmailSchema }),
    mailingListController.getSubscriberByEmail,
  );

export default mailingListRouter;
