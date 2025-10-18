import express from 'express';

import { contactSupportController } from './controller';
import validate from '../../validators/validate';
import { grantAccess } from '../../validators/validateAccessControl';
import { Resources } from '../../config/roles';
import { authenticateJWT } from '../../middlewares/jwt';
import { commonValidation } from '../../validators/commonValidation';
import { contactSupportValidation } from './validation';

const supportRouter = express.Router();

supportRouter
  .route('/')
  .get(authenticateJWT, grantAccess('read', 'any', Resources.SUPPORT), contactSupportController.getSupportRequests)
  .post(validate({ body: contactSupportValidation.ContactSupportSchema }), contactSupportController.contactSupport)
  .delete(
    authenticateJWT,
    grantAccess('delete', 'any', Resources.SUPPORT),
    validate({ body: commonValidation.IdsSchema }),
    contactSupportController.deleteSupportRequests,
  );

supportRouter
  .route('/:id/reply')
  .post(
    authenticateJWT,
    grantAccess('update', 'any', Resources.SUPPORT),
    validate({ params: commonValidation.IdSchema, body: contactSupportValidation.ReplySchema }),
    contactSupportController.replyToSupportRequest,
  );

supportRouter
  .route('/mark-as-read')
  .patch(
    authenticateJWT,
    grantAccess('update', 'any', Resources.SUPPORT),
    validate({ body: commonValidation.IdsSchema }),
    contactSupportController.markAsRead,
  );

supportRouter
  .route('/:id')
  .patch(
    authenticateJWT,
    grantAccess('update', 'any', Resources.SUPPORT),
    validate({ params: commonValidation.IdSchema, body: contactSupportValidation.StatusSchema }),
    contactSupportController.updateSupportRequest,
  );

export default supportRouter;
