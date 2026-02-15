import { Request,Response } from "express";
import { ListCategoryService } from "../../services/category/ListCategoryService";

class ListCategoryController {

    async handle (req:Request,res:Response)
    {
        const listcategoryService = new ListCategoryService()
        
        const category =  await listcategoryService.execute()
        
        return res.json(category)
    }
    
}

export {ListCategoryController}