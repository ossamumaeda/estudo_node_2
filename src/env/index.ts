import { config } from 'dotenv'
import { z } from 'zod'

if(process.env.NODE_ENV === 'test'){
    config({path: '.env.test'})
}else{
    config()
}

const envSchema = z.object({
    NODE_ENV: z.enum(['dev','test','prod']).default('prod'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if(!_env.success){
    console.log('Invalid env variables ! !', _env.error.format())
    throw new Error('Invalid env variables ! !')
}

export const env = _env.data