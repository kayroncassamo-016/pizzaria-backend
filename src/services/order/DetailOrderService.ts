import { id } from "zod/v4/locales";
import prismaClient from "../../Prisma";

interface DetailOrderRequest {
  order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: DetailOrderRequest) {
    // Buscar a order com todos os seus itens
    const order = await prismaClient.order.findFirst({
      where: {
        id: order_id,
      },
      select: {
        id: true,
        table: true,
        name: true,
        draft: true,
        status: true,
        created_At: true,
        updated_At: true,
        Items: {
          select: {
            id: true,
            amount: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order não encontrada");
    }

    return order;
  }
}

export { DetailOrderService };
