import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fighter = await prisma.fighter.upsert({
    where: { shortId: 123456789012345678n },
    create: {
      shortId: 123456789012345678n,
      fighterId: 'teste_puxei_cabo',
      platformId: 1,
      platformName: 'Test Fighter',
      platformTool: 'CFN',
    },
    update: {},
  });
  console.log('Fighter created:', fighter);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
