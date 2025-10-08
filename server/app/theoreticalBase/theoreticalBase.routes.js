import express from 'express'
import { verifyJWT } from "../middleware/verifyJWT.js"
import { addMove, getMoves, deleteMove, updatePosition } from './theoreticalBase.controller.js'

const router = express.Router()

router.route('/theory').post(verifyJWT, addMove)           // create
router.route('/theory').get(getMoves)                      //read
router.route('/theory/:id').put(verifyJWT, updatePosition) //update
router.route('/theory/:id').delete(verifyJWT, deleteMove)  //delete

export default router