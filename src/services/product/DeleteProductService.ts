import prismaClient from "../../Prisma";

interface DeleteProductServiceProps {
  product_id: string;
}

class DeleteProductService {
  async execute({product_id}: DeleteProductServiceProps) {
  
    try
    {
        await prismaClient.product.update({
            
            where: {
                id: product_id,
            },
            data:
            {
                disabled: true
            }
        });
        return {message: "Produto deletado/arquivado com sucesso!"};
    }
    catch (error)
    {
        throw new Error("Erro ao deletar o produto.");
    }

    }
}
export { DeleteProductService };
