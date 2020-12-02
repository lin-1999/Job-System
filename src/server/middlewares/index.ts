import config from '@/server/config'

import { Account } from '@/server/models'

import { Request, Response, NextFunction } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

type Middleware = (req: Request, res: Response, next: NextFunction) => void

export const auth: Middleware = async (req, res, next) => {
    try {
        const decoded: any = jwt.verify(req.cookies.token, config.JWT_SECRET)
        req.account = await Account.findById(decoded.id)
        next()
    } catch (error) {
        res.status(401).json({ error: '尚未登入' })
    }
}

export const required: (fields: string[]) => Middleware = fields => {
    return (req, res, next) => {
        let params: any
        switch (req.method) {
        case 'GET':
            params = req.query
            break
        case 'POST':
            params = req.body
            break
        }

        if (fields.every(x => params[x] !== undefined)) {
            next()
        } else {
            res.status(400).json({ error: '缺少欄位' })
        }
    }
}
