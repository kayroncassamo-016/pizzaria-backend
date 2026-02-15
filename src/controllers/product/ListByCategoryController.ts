import {Response,Request} from "express"
import { ListByCategoryService } from "../../services/product/ListByCategoryService"

class ListByCategoryController 
{
    async handle (req:Request,res:Response)
    {
        const category_id = req.query.category_id as string
        //duvida: Como encontrar o category_id atraves da query mesmo? Duvida a responder amanha.
        const listByCategory = new ListByCategoryService()

        const products = await listByCategory.execute({category_id})

        return res.json(products)
    }
}
export {ListByCategoryController}