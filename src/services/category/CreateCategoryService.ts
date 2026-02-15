import prismaClient from "../../Prisma"

interface CategoryRequest
{
    name:string;
}

class CreateCategoryService 
{
   async execute ({name}:CategoryRequest)
   {
   // return {ok:true}

    //  if (name ==='')
    //  {
    //     throw new Error('Name Invalid')
    //  }

     const category = await prismaClient.category.create({
        data:
        {
          name: name
        },
        select:
        {
          id: true,
          name:true
        }
     })
     return category
   }
   

}

export {CreateCategoryService}