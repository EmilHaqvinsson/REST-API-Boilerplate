import {Express} from 'express'
// import MessageController from '../controllers/MessageController'
// import CrawlController from '../controllers/CrawlController'
import TodoController from '../controllers/TodoController'

const TodoRoutes = (server: Express) => {
    server.get('/todos', TodoController.getAllTodos)
    server.get('/todos/undone', TodoController.getUndoneTodos)
    server.get('/todos/:id', TodoController.getTodoById)
    server.post('/todos', TodoController.createTodo)
    server.put('/todos/:id', TodoController.updateTodoById)
    server.delete('/todos/:id', TodoController.deleteTodoById)
}
export default TodoRoutes