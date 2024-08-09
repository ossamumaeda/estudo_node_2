import { FastifyInstance } from "fastify"
import { knexExport } from "../database"
import { z } from 'zod'
import { randomUUID } from "crypto"
import { checkSessionIdExists } from "../middleware/check-session-id-exists"

export async function transactionRoutes(app: FastifyInstance) {
    app.addHook('preHandler',async (request, reply) =>{
        // console.log(`${request.method} : ${request.url}`)
    })
    app.get('/', {
        preHandler: [checkSessionIdExists]
    }, async (request) => {
        const { sessionId } = request.cookies;
        const transaction = await knexExport('transactions').select('*').where({session_id:sessionId})


        return { transaction }
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists]
    }, async (request) => {

        const { sessionId } = request.cookies;

        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)
        const transaction = await knexExport('transactions')
            .where({
                id,
                session_id: sessionId
            })
            .first()
        return { transaction }
    })

    app.get('/summary', {
        preHandler: [checkSessionIdExists]
    }, async (request) => {
        const { sessionId } = request.cookies;

        const summary = await knexExport('transactions')
        .sum("amount", { as: 'amount' })
        .where({
            session_id: sessionId
        })
        .first()

        return { summary }
    })

    app.post('/', async (request, reply) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)
        let session_id = request.cookies.sessionId
        if (!session_id) {
            session_id = randomUUID()
            reply.cookie('sessionId', session_id, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 Dias
            })
        }

        await knexExport('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id
        })

        return reply.status(201).send()
    })
}