import { Request, Response } from 'express'
import { CreateTodo, ReadTodo } from '../interface/Todo'
import Logger from '../utils/Logger'
import StatusCode from '../utils/StatusCode'
import TodoModel from '../models/TodoModel'

const createTodo = async (req: Request, res: Response) => {
    try {
        Logger.info('createTodo')
        Logger.info('req.body' + req.body.todo)
        Logger.info('req.isDone' + req.body.isDone)
        const { todo, isDone } = req.body
        if (todo && isDone) {
            const newObject: CreateTodo = {
                todo: todo,
                isDone: isDone
            }
            const newTodo = new TodoModel(newObject)
            const dbResponse = await newTodo.save()
            Logger.http('New todo registered in the database:' + dbResponse)
            res.status(StatusCode.CREATED).send({
                message: 'Created new todo in the database.', 
                body: dbResponse
            })
        } else {
            Logger.error('Creating new todo failed! 🤕')
            res.status(StatusCode.BAD_REQUEST).send({
                todo: 'Failed when trying to create new todo; either todo or isDone is missing.'
            })
        }
    } catch (error) {
        Logger.error('Could not create new todo: ' + error)
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
            error: 'Something went wrong when trying to create new todo.'
        })
    }
}

function getAllTodos(req: Request, res: Response) {
    Logger.info('Getting all todos in the database...')
    try {
        TodoModel.find({}, '', (error: ErrorCallback, allTodos: Array<ReadTodo>) => {
            if (error) {
                Logger.error(error);
                res.status(StatusCode.BAD_REQUEST).send({
                    error: 'Could not get all todos in the database.'
                });
            } else if (allTodos.length === 0) {
                Logger.warn('No todos found in the database')
                res.status(StatusCode.OK).send({
                    message: 'There are currently no todos in the database.'
                });
            } else {
                Logger.http('Array of all todos in the database: ' + allTodos);
                res.status(StatusCode.OK).send(allTodos);
            }
        });
    } catch (error) {
        Logger.error(error);
        res.status(StatusCode.BAD_REQUEST).send({
            error: 'Det gick inte att hämta todo.'
        });
    }
}

function getUndoneTodos(req: Request, res: Response) {
    Logger.info('Getting all UNDONE todos in the database...')
    try {
        TodoModel.find({}, '', (error: ErrorCallback, allTodos: Array<ReadTodo>) => {
            const undoneTodos = allTodos.filter(todo => todo.isDone === false)
            if (error) {
                Logger.error(error);
                res.status(StatusCode.BAD_REQUEST).send({
                    error: 'Could not get all undone todos in the database.'
                });
            } else if (undoneTodos.length === 0) {
                Logger.warn('No undone todos found in the database')
                res.status(StatusCode.NO_CONTENT).send({
                    message: 'There are currently no undone todos in the database.'
                });
            } else {
                Logger.http('Array of all undone todos in the database: ' + undoneTodos);
                res.status(StatusCode.OK).send(undoneTodos);
            }
        });
    } catch (error) {
        Logger.error(error);
        res.status(StatusCode.BAD_REQUEST).send({
            message: 'Could not get all undone todos in the database.',
            error: error
        });
    }
}

const getTodoById = (req: Request, res: Response) => {
    
    Logger.http('Getting todo by id, with id: ' + req.params.id)
    try {
        TodoModel.findById(req.params.id, '', (error: ErrorCallback, todoByID: ReadTodo) => {
            if (error) {
                Logger.error('error' + error)
                res.status(StatusCode.BAD_REQUEST).send({
                    error: 'Could not get todo with id: ' + req.params.id
                })
            } else {
                Logger.http('Found todo:' + todoByID)
                res.status(StatusCode.OK).send(todoByID ? todoByID : {
                    todoByID: `Found todo with id: ${req.params.id}\n` + todoByID
                })
            }
        })
    } catch (error) {
        Logger.error('error' + error)
        res.status(StatusCode.BAD_REQUEST).send({
            error: 'Error while trying to get todo by id'
        })
    }
}

const deleteTodoById = (req: Request, res: Response) => {
    Logger.info('Trying to delete todo by id. Supplied id: ' + req.params.id)
    try {
        TodoModel.findByIdAndRemove(req.params.id, (error: ErrorCallback, todo: ReadTodo) => {
            if (error) {
                Logger.error('Could not delete todo with id \"' + req.params.id + '\"! Got the following error:\n' + error)
                res.status(StatusCode.BAD_REQUEST).send({
                    error: `Could not delete todo with id: ${req.params.id}` 
                })
            } else {
                Logger.http('todo' + todo)
                res.status(StatusCode.OK).json(todo ? {
                    todo: `Todo with id ${req.params.id} was deleted`
                } : {
                    todo: `Could not find todo with id: ${req.params.id}`
                })
            }
        })
    } catch (error) {
        Logger.error('error' + error)
        res.status(StatusCode.BAD_REQUEST).send({
            error: 'Could not delete todo with id: ' + req.params.id
        })
    }
}

const updateTodoById = (req: Request, res: Response) => {
    try {
        const thisId = req.params.id
        Logger.debug('Trying to update todo with id: '+ req.params.id)
        Logger.info('Trying to update the following information:')
        Logger.info(`todo: ${req.body.todo}\nisDone: ${req.body.isDone}`)
        const updatedTodo: CreateTodo = {
            todo: req.body.todo,
            isDone: req.body.isDone
        }
        TodoModel.findByIdAndUpdate(thisId, updatedTodo,  {new : true }, (error: any, todo: any) => {
            if (error) {
                Logger.error('Was not able to update todo with id: ' + req.params.id + '. Got the following error: ' + error)
                res.status(StatusCode.BAD_REQUEST).send({
                    error: 'Was not able to update todo with id: ' + req.params.id + '. Got the following error: ' + error
                })
            } else {
                if (todo) {
                    Logger.http('Updated todo: ' + todo)
                    res.status(StatusCode.OK).send({
                        message: 'Todo was updated!',
                        body: todo
                    })
                 } else if (todo === null) {
                        Logger.http('Could not update todo with id: ' + req.params.id + '. There is no todo with that id.')
                        res.status(StatusCode.NOT_FOUND).send({
                            message: `Could not find a todo with id: \"${req.params.id}\". Make sure you have the correct id.`
                        })
                    }
            }
        })
    } catch (error) {
        Logger.error('Could not update todo with id: ' + req.params.id + '. Got error:' + error)
        res.status(StatusCode.BAD_REQUEST).send({
            error: 'Could not update todo with id: ' + req.params.id + '. Got error:' + error
        })
    }
}

export default {
    createTodo,
    getAllTodos,
    getUndoneTodos,
    getTodoById,
    deleteTodoById,
    updateTodoById
}