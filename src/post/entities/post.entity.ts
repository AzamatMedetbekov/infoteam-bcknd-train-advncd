import { Prisma } from "@prisma/client";

export type PostFullContent = Prisma.PostGetPayload<{
  include: {
    author: {
      select: {
        uuid: true;
        name: true;
        email: true;
      };
    };
    content: true;
    category: {
      select:{
        id: true,
        name: true,
      }
    }
    title: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
