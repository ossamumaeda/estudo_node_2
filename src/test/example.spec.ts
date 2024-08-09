import { expect, test, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import { app } from '../app'
import supertest from 'supertest'
import { title } from 'process'
import { execSync } from 'child_process'
import { request } from 'http'

describe('Transaction routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })


    beforeEach(async () => {
        execSync('npm run knex -- migrate:rollback --all')
        execSync('npm run knex -- migrate:latest')
    })

    it('Should be able to create a new transaction', async () => {
        const response = await supertest(app.server)
            .post('/transactions').send({
                title: 'Testando vitest',
                amount: 1000,
                type: 'credit'
            })

        expect(response.statusCode).toEqual(201)
    })

    it('Should be able to list all transactions', async () => {
        const createTransaction = await supertest(app.server)
            .post('/transactions').send({
                title: 'Testando vitest',
                amount: 1000,
                type: 'credit'
            })

        const cookies = createTransaction.get('Set-Cookie') ?? ''

        const response = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)

        // expect(response.body.transaction.length).toBeGreaterThan(0)
        expect(response.body.transaction).toEqual([
            expect.objectContaining({
                title: 'Testando vitest',
                amount: 1000
            })
        ])

    })

    it('Should be able to get a specific transaction', async () => {
        const createTransaction = await supertest(app.server)
            .post('/transactions').send({
                title: 'Testando vitest',
                amount: 1000,
                type: 'credit'
            })

        const cookies = createTransaction.get('Set-Cookie') ?? ''

        const transactionList = await supertest(app.server)
            .get('/transactions')
            .set('Cookie', cookies)

        const transactionId = transactionList.body.transaction[0].id

        const getTransactionResponse = await supertest(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'Testando vitest',
                amount: 1000,
            })
        )

    })

    it('Should be able to summary the transactions', async () => {
        const createTransactionCredit = await supertest(app.server)
            .post('/transactions').send({
                title: 'Testando vitest',
                amount: 1000,
                type: 'credit'
            }) // Adiciona 1000 na conta
        const cookies = createTransactionCredit.get('Set-Cookie') ?? ''

        const createTransactionDebit = await supertest(app.server)
            .post('/transactions').send({
                title: 'Testando vitest',
                amount: 800,
                type: 'debit'
            }) // Debita 800 da conta
            .set('Cookie', cookies)


        const response = await supertest(app.server)
            .get('/transactions/summary')
            .set('Cookie', cookies)

        // expect(response.body.transaction.length).toBeGreaterThan(0)
        expect(response.body.summary).toEqual(
            expect.objectContaining({
                amount: 200
            })
        )

    })
})