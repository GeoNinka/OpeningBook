import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'

export const addMove = asyncHandler(async (req, res) => {
    const {from, to, move, type, piece} = req.body

    let fromTheory = await prisma.theoreticalBase.findUnique({
        where: {
            fen: from
        }
    })
    if (!fromTheory) {
        fromTheory = await prisma.theoreticalBase.create({
            data: {
                fen: from,
            }
        })
    }

    let toTheory = await prisma.theoreticalBase.findUnique({
        where: {
            fen: to
        }
    }) 
    if (!toTheory) {
        toTheory = await prisma.theoreticalBase.create({
            data: {
                fen: to,
            }
        })
    }

    const isMoveExist = await prisma.moves.findFirst({
        where: {
            fromId: fromTheory.id,
            toId: toTheory.id,
        }
    })
    if (isMoveExist) {
        return res.status(400).json({message: 'Продолжение уже существует.'})
    } else {
        await prisma.moves.create({
            data: {
                fromId: fromTheory.id,
                toId: toTheory.id,
                move,
                type,
                piece
            }
        }) 
        return res.status(200).json({message: 'Ход добавлен'})
    }
})

export const getMoves = asyncHandler(async (req, res) => {
    const fen = req.query.fen
    const langCode = req.query.lang

    const position = await prisma.theoreticalBase.findUnique({
        where: {
            fen
        },
        include: {
            fromMove: {
                include: {
                    from: true,
                    to: true
                }
            }
        }
    })

    const positionDescription = await prisma.theoreticalBaseTranslate.findFirst({
        where: {
            positionId: position.id,
            langCode: langCode
        }
    })

    if (!position) {
        throw new Error('Такой позиции не существует')
    }

    res.status(200).json({moves: position.fromMove, desc: positionDescription})
})

export const deleteMove = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    await prisma.moves.delete({
        where: {
            id
        }
    })
    res.status(200).json({"message": "OK"})
})

export const updatePosition = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id)
    const {langCode, description, name} = req.body

    const isPositionExist = await prisma.theoreticalBase.findUnique({
        where: {
            id
        }
    })

    if (!isPositionExist) {
        throw new Error('Такой позиции не существует')
    } else {
        const isTranslationExist = await prisma.theoreticalBaseTranslate.findFirst({
            where: {
                positionId: id,
                langCode: langCode
            }
        }) 

        if (!isTranslationExist) {
            await prisma.theoreticalBaseTranslate.create({
                data: {
                    langCode: langCode,
                    description: description,
                    name: name,
                    positionId: id
                }
            })
        } else {
            await prisma.theoreticalBaseTranslate.update({
                where: {
                    id: isTranslationExist.id
                },
                data: {
                    langCode: langCode,
                    description: description,
                    name: name,
                }
            })
        }
        res.status(200).json({ "message": "Позиция изменена" })
    }
})