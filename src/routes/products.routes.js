import {Router} from 'express'
const router = Router();
import * as productsCtrl from '../controllers/products.controller'
import {authjwt} from '../middlewares'
router.post('/', [authjwt.verifyToken, authjwt.isModerator], productsCtrl.createProduct)

router.get('/', productsCtrl.getProducts)

router.get('/:producttId', productsCtrl.getProductById)

router.put('/:producttId',  [authjwt.verifyToken, authjwt.isModerator], productsCtrl.updateProductById)

router.get('/producto/:producttId',  productsCtrl.buyProductById)

router.delete('/:producttId',  productsCtrl.deleteProductById)


export default router;