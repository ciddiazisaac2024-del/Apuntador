import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Crear usuarios de prueba con contraseñas hasheadas
  const supHash = await bcrypt.hash('super123', 10);
  const ejecHash = await bcrypt.hash('ejec123', 10);

  const supervisor = await prisma.user.upsert({
    where: { username: 'ana.super' },
    update: {},
    create: {
      username: 'ana.super',
      passwordHash: supHash,
      role: 'supervisor',
    },
  });

  const ejecutivo = await prisma.user.upsert({
    where: { username: 'pedro.ejec' },
    update: {},
    create: {
      username: 'pedro.ejec',
      passwordHash: ejecHash,
      role: 'ejecutivo',
    },
  });

  // 2. Crear casos de prueba
  await prisma.case.createMany({
    data: [
      {
        name: 'Devolución por falla técnica',
        type: 'Garantía',
        content: 'Buenos días, Sr(a). [Nombre del cliente]. Le informamos que su caso por falla técnica ha sido aceptado. Procederemos con la devolución en un plazo de 5 días hábiles. ¿Tiene alguna pregunta adicional?',
        createdById: supervisor.id,
      },
      {
        name: 'Reclamo por cobro duplicado',
        type: 'Facturación',
        content: 'Estimado(a) [Nombre del cliente], hemos identificado el cobro duplicado en su cuenta. Se realizará la reversión inmediata del cargo por [monto]. Le pedimos una disculpa por las molestias. ¿Necesita ayuda con algo más?',
        createdById: supervisor.id,
      },
      {
        name: 'Actualización de datos personales',
        type: 'Consulta',
        content: 'Con gusto le ayudo a actualizar sus datos. Por favor indíqueme su nuevo [correo electrónico / número telefónico / dirección]. Un momento mientras lo actualizo en nuestro sistema.',
        createdById: supervisor.id,
      },
    ],
  });

  console.log('✅ Datos de prueba creados exitosamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
