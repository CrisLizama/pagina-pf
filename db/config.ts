import { defineDb, defineTable, column } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    image: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  }
});

const Purchase = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    planId: column.text(),
    planName: column.text(),
    price: column.number(),
    status: column.text({ default: 'pending' }),
    mpPaymentId: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  }
});

export default defineDb({
  tables: { User, Purchase }
});