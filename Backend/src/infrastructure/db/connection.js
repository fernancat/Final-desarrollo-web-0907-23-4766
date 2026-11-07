import { Sequelize } from 'sequelize';
import { config } from '../../config.js';

export const database = new Sequelize({
  ...config.database,
  dialect: 'postgres',
  logging: false,
  define: { timestamps: false, freezeTableName: true },
});
