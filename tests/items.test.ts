import { prisma } from '../src/database';
import * as itemFactory from './factories/item.factory';
import app from '../src/app';
import supertest from 'supertest';

//antes de cada item
beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`
});

afterAll(async () => {
  await prisma.$disconnect()
});

describe('Testa POST /items ', () => {
  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const item = await itemFactory.insertItem()

    const result = await supertest(app).post('/items').send(item);

    //espera o código de criado
    expect(result.status).toBe(201)
  });
  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const item = await itemFactory.insertItem()

    //Cria o item antes de fazer o teste no DB
    await prisma.items.create({ data: item })

    const result = await supertest(app).post('/items').send(item);

    //espera o código de conflito
    expect(result.status).toBe(409)
  });
});

describe('Testa GET /items ', () => {
  it('Deve retornar status 200 e o body no formato de Array', async () => {
    const result = await supertest(app).get('/items')

    //espera o código de Ok
    expect(result.status).toBe(200)

    //espera um array como response
    expect(result.body).toBeInstanceOf(Array)
  });
});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const item = await itemFactory.insertItem()

    //Cria o item antes de fazer o teste no DB
    const insertedItem = await prisma.items.create({ data: item })

    //Pega a id do item criado
    const id = insertedItem.id;

    //Faz o GET com a ID
    const result = await supertest(app).get(`/items/${id}`)

    //Confere o Status
    expect(result.status).toBe(200)

    //Confere se os itens são iguais
    expect(result.body).toEqual(insertedItem)
  });
  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const result = await supertest(app).get('/items/500')

    expect(result.status).toBe(404)
  });
});

