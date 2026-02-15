import {Router, Request,Response} from 'express'
import {CreateUserController} from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserController'
import { DetailUserController } from './controllers/user/DetailUserController'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { CreateCategoryController } from './controllers/category/CreateCategoryController'
import { ListCategoryController } from './controllers/category/ListCategoryController'

import {CreateProductController} from './controllers/product/CreateProductController'

//import uploadConfig from './config/multer'
import uploadConfig from './config/multer2'
import multer from 'multer'
import { ListByCategoryController } from './controllers/product/ListByCategoryController'
import { CreateOrderController } from './controllers/order/CreateOrderController'
import { DeleteOrderController} from './controllers/order/DeleteOrderController'
import { authUserSchema, createUserSchema } from './schemas/userSchema'
import { validateSchema, } from './middlewares/validateSchema'
import { createProductSchema,listProductsSchema,listproductByCategorySchema } from './schemas/productSchema' 
import { isAdmin } from './middlewares/isAdmin'
import { createCategorySchema } from './schemas/categorySchema'

import { ListProductsController } from './controllers/product/ListProductsController'
import { DeleteProductController } from './controllers/product/DeleteProductController'

//import { ListOrderController } from './controllers/order/ListOrderController'

import { ListOrderController } from './controllers/order/ListOrderController'
import { addItemSchema, createOrderSchema, removeItemSchema, detailOrderSchema, sendOrderSchema, finishOrderSchema,
  deleteOrderSchema
 } from './schemas/orderSchema'

import { AddItemController } from './controllers/order/AddItemController'
import { RemoveOrderItemController } from './controllers/order/RemoveOrderItemController'
import { DetailOrderController } from './controllers/order/DetailOrderController'
import { SendOrderController } from './controllers/order/SendOrderController'
import { FinishOrderController } from './controllers/order/FinishOrderController'
//const upload = multer(uploadConfig.upload("./tmp"))


const upload = multer (uploadConfig)

const router = Router()


//ROTAS USUARIO
//  router.post('/users',new CreateUserController().handle)
//  router.post('/session', new AuthUserController().handle)
router.post('/users',validateSchema(createUserSchema),new CreateUserController().handle)
router.post('/session',validateSchema(authUserSchema), new AuthUserController().handle)

router.get('/me',isAuthenticated,new DetailUserController().handle)


//ROTAS CATEGORY
router.post ('/category', isAuthenticated,isAdmin,validateSchema(createCategorySchema),
  new CreateCategoryController().handle)
  
router.get ('/category',isAuthenticated, new ListCategoryController().handle)

// ROTAS PRODUCT 
router.post ('/product',isAuthenticated,isAdmin,
upload.single('file'),validateSchema(createProductSchema), new CreateProductController().handle)
//.single("campo") → cria req.file

router.get ('/products',isAuthenticated,validateSchema(listProductsSchema),
new ListProductsController().handle)

router.delete('/product',isAuthenticated,isAdmin, new DeleteProductController().handle)

router.get ('/category/product',isAuthenticated, validateSchema(listproductByCategorySchema),
new ListByCategoryController().handle)




//ROTAS ORDER

  router.post('/order', isAuthenticated,validateSchema(createOrderSchema),new CreateOrderController().handle)

  router.get('/orders',isAuthenticated,new ListOrderController().handle) 


  //DELETAR ORDER/ITEMS DO ORDER
  router.delete('/order',isAuthenticated, validateSchema(deleteOrderSchema), new DeleteOrderController().handle)

  router.delete('/order/item/remove',isAuthenticated,validateSchema(removeItemSchema), new RemoveOrderItemController().handle)

  //ADICIONAR ITENS AO ORDER
  router.post("/order/add", isAuthenticated,validateSchema(addItemSchema), new AddItemController().handle)

  //DETALHAR ORDER
  router.get('/order/detail',isAuthenticated,validateSchema(detailOrderSchema),new DetailOrderController().handle)


  //ACTUALIZAR ORDER
  router.put('/order/send',isAuthenticated, 
    validateSchema(sendOrderSchema),
    new SendOrderController().handle)   

  //FINALIZAR ORDER
  router.put('/order/finish',isAuthenticated, 
    validateSchema(finishOrderSchema),
    new FinishOrderController().handle)   


export {router}