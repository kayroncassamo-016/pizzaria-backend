import  prismaClient from '../../Prisma'

class ListCategoryService 
{
   async execute()
   {
      const category = await prismaClient.category.findMany({

        select:
        {
            id: true,
            name: true
        }
      })

      return category
   }
}

export {ListCategoryService}

//FindFirst --> devolve o primeiro elemento que foi cadastrado, sempre.
//FindMany --> devolve todos os elementos.