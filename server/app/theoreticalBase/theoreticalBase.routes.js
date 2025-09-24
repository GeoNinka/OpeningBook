import express from 'express'
import { verifyJWT } from "../middleware/verifyJWT.js"
import { addMove, getMoves, deleteMove, updatePosition } from './theoreticalBase.controller.js'

const router = express.Router()

router.route('/theory').post(verifyJWT, addMove)
router.route('/theory').get(getMoves) // api/theory?fen=1
router.route('/theory/:id').delete(verifyJWT, deleteMove) // api/theory/1
router.route('/theory/:id').put(verifyJWT, updatePosition)

export default router