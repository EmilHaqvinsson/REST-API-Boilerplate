import { CreateNote } from "../interface/Note";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Logger from "../utils/Logger";
import NoteModel from "../models/NoteModel";
import StatusCode from "../utils/StatusCode";

const addNote = async (req: Request, res: Response) => {
    try {
        Logger.info('addNote')
        const { title, content, author, isPrivate } = req.body;
        if (content !== undefined) {
            const newObject: CreateNote = {
                title: title,
                content: content,
                author: author,
                isPrivate: isPrivate
            }
            Logger.info(newObject)
            const newNote = new NoteModel(newObject)
            const dbResponse = await newNote.save()
            Logger.info(dbResponse)
            Logger.http('New note registered in the database:' + dbResponse)
            res.status(StatusCode.CREATED).send({
                message: 'Created new note in the database.',
                body: dbResponse
            })
        } else {
            Logger.error('Creating new note failed! 🤕')
            res.status(StatusCode.BAD_REQUEST).send({
                note: 'Failed when trying to create new note; you didnt supply any content.'
            })
        }
    } catch (error) {
        Logger.error('Could not create new note: ' + error)
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
            error: 'Something went wrong when trying to create new note.'
        })
    }
}

const getAllNotes = async (req: Request, res: Response) => {
    Logger.info('Getting all notes in the database...')
    const token: string = req.headers['auth-token'] as string
    const avaliableNotes: object[] = []
    jwt.verify(token, process.env.TOKEN_SECRET as string, async (err: any, user: any) => {
        if (err) {
            Logger.error('Could not get all notes: ' + err)
            Logger.info('User is not authorized to view any private notes.')
        } else {
            try {
                const allNotes = await NoteModel.find({})
                if (allNotes.length === 0) {
                    Logger.warn('No notes found in the database')
                    res.status(StatusCode.OK).send({
                        message: 'There are currently no notes in the database.'
                    });
                } else {
                    Logger.http('Array of all notes in the database: ' + allNotes);
                    allNotes.forEach(note => {
                        if (note.isPrivate === false) {
                            avaliableNotes.push(note)
                        } else {
                            if (note.author === user.username) {
                                avaliableNotes.push(note)
                            }
                        }
                    })
                    res.status(StatusCode.OK).send(avaliableNotes);
                }
            } catch (error) {
                Logger.error(error);
                res.status(StatusCode.BAD_REQUEST).send({
                    error: 'Could not get all notes in the database.'
                });
            }
        }
    })
    if (token === undefined) {
        try {
            const publicNotes: object[] = []
            const allPublicNotes = await NoteModel.find({})
            if (allPublicNotes.length === 0) {
                Logger.warn('No notes found in the database')
                res.status(StatusCode.OK).send({
                    message: 'There are currently no notes in the database.'
                });
            } else {
                allPublicNotes.forEach(note => {
                    if (note.isPrivate === false) {
                        publicNotes.push(note)
                    }
                })
                Logger.http('Array of all public notes in the database: ' + publicNotes);
                res.status(StatusCode.OK).send(publicNotes);
            }
        } catch (error) {
            Logger.error(error);
            res.status(StatusCode.BAD_REQUEST).send({
                error: 'Could not get all notes in the database.'
            });
        }
    }
}

const getNoteById = async (req: Request, res: Response) => {
    Logger.info('Getting note by id...')
    try {
        const note = await NoteModel.findById(req.params.id)
        if (note?.isPrivate === true) {
            Logger.warn('Note is private! 🤫 Checking if user is authorized...')
            const token = req.headers['auth-token'] as string
            jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
                Logger.info(user)
                if (err) {
                    Logger.error('Could not verify token')
                    res.status(StatusCode.UNAUTHORIZED).send({
                        error: 'Could not verify token.'
                    })
                } else {
                    if (user.username === note?.author) {
                        Logger.info('User is authorized to view this note')
                        res.status(StatusCode.OK).send(note)
                    } else {
                        Logger.warn('User is not authorized to view this note')
                        res.status(StatusCode.UNAUTHORIZED).send({
                            error: 'You are not authorized to view this note.'
                        })
                    }
                }
            })
        } else {
            if (note === null) {
                Logger.warn('No note found in the database')
                res.status(StatusCode.OK).send({
                    message: 'There are currently no notes in the database.'
                });
            } else {
                Logger.http('Note found in the database: ' + note);
                res.status(StatusCode.OK).send(note);
            }
        }
    } catch (error) {
        Logger.error(error);
        res.status(StatusCode.BAD_REQUEST).send({
            error: 'Could not get note by id.'
        });
    }
}

export default {
    addNote,
    getAllNotes,
    getNoteById
}