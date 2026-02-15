import prismaClient from "../../Prisma";

interface ListProductsRequest {
  disabled: boolean;
}

class ListProductsService {
  async execute({ disabled }: ListProductsRequest) {
    const products = await prismaClient.product.findMany({
      where: {
        disabled: disabled,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        disabled: true,
        category_id: true,
        created_At: true,
        updated_At: true,
        category:
        {
          select:
          {
            id:true,
            name:true
          }
        }
      },
      orderBy: {
        created_At: "desc",
      },
    });

    return products;
  }
}

export { ListProductsService };
