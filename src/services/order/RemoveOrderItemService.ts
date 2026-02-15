import prismaClient from "../../Prisma";

interface RemoveItemRequest {
  item_id: string;
}

class RemoveOrderItemService {
  async execute({ item_id }: RemoveItemRequest) {
    // Verificar se o item existe
    const item = await prismaClient.item.findFirst({
      where: {
        id: item_id,
      },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    // Deletar o item
    const deletedItem = await prismaClient.item.delete({
      where: {
        id: item_id,
      },
    });

    return deletedItem;
  }
}

export { RemoveOrderItemService };
