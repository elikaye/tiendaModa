import { sequelize } from './config/database.js';

try {
  await sequelize.authenticate();
  console.log('✅ Conexión a la base de datos establecida correctamente.');
} catch (error) {
  console.error('❌ Error al conectar con la base de datos:', error);
} finally {
  await sequelize.close();
}
