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
    category: true;
    tags: true;
    title: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
