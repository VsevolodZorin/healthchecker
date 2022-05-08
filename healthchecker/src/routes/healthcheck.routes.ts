import { Router } from 'express';
import { createMicroserviceMiddleware } from 'src/middlewares/create-microservice.middleware';
import { healthcheckController } from 'src/controllers/healthcheck.controller';
import { checkIdParamMiddleware } from 'src/middlewares/check-id-param.middleware';

const router = Router();

router.get('/', healthcheckController.all);
router.post('/', createMicroserviceMiddleware, healthcheckController.create);
router.put('/', createMicroserviceMiddleware, healthcheckController.update);
router.delete('/:id', checkIdParamMiddleware, healthcheckController.delete);

router.get('/:id/status', checkIdParamMiddleware, healthcheckController.check);

export default router;
