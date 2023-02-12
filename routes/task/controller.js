const TaskService = require("./service")

async function findAllHandler(req, reply) {
    const taskService = new TaskService(this);
    const findAllTask = await taskService.findAll();
    return reply.send(findAllTask);
}
async function findOneHandler(req, reply) {
    const { id } = req.params
    const taskService = new TaskService(this);
    const findOneTask = await taskService.findOne({ id });
    return reply.send(findOneTask);
}
async function createHandler(req, reply) {
    const { body } = req
    const taskService = new TaskService(this);

    const createParams = {
        name: body.name, 
        description: body.description
    }
    const createTask = await taskService.create(createParams );
    return reply.send(createTask);
}
async function updateHandler(req, reply) {
    const { body } = req
    const { id } = req.params
    const taskService = new TaskService(this)
    const findOneTask = await taskService.findOne({ id })
    if (!findOneTask) {
        return reply.code(404).send({ message: "Task not found" })
    }

    for (const item of Object.keys(body)) {
        if (
            findOneTask[item] !== undefined &&
            typeof findOneTask[item] !== "object"
        ) {
            findOneTask[item] = body[item];
        }
    }

    if (!(await findOneTask.save())) {
        return reply.code(500).send({ message: "Couldn't update this Task" });
    }
    return reply.send(findOneTask)
}
async function deleteHandler(req, reply) {
    const { id } = req.params
    const taskService = new TaskService(this);
    const findOneTask = await taskService.findOne({ id });
    const deleteTask = await taskService.destroy({ id });
    if (!deleteTask) {
        return reply.send({ message: "No ID found"});
    }else{
        return reply.send({ message: "Task deleted", id: findOneTask });
    }
}

module.exports = {
    findAllHandler,
    findOneHandler,
    createHandler,
    updateHandler,
    deleteHandler
}