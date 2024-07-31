const Task = require('../models/task');

exports.getAllTasks = async (userId) => {
  return await Task.find({ user: userId }).sort({ status: 1, order: 1 });
};

exports.createTask = async (taskData) => {
  const highestOrderTask = await Task.findOne({ user: taskData.user, status: taskData.status })
    .sort('-order')
    .limit(1);

  const newOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

  const task = new Task({
    ...taskData,
    order: newOrder
  });

  return await task.save();
};

exports.updateTask = async (id, taskData, userId) => {
  console.log(id, taskData, userId);
  const task = await Task.findOne({ _id: id, user: userId });

  if (!task) {
    return null;
  }

  if (taskData.status && taskData.status !== task.status) {
    await this.reorderTasks(userId, task.status);
    await this.reorderTasks(userId, taskData.status, id, taskData.order);
  } else if (taskData.order !== undefined) {
    await this.reorderTasks(userId, task.status, id, taskData.order);
  }

  return await Task.findOneAndUpdate({ _id: id, user: userId }, taskData, { new: true, runValidators: true });
};

exports.reorderTasks = async (userId, status, movedTaskId = null, newOrder = null) => {
  const tasks = await Task.find({ user: userId, status }).sort('order');

  let updatedTasks = tasks;

  if (movedTaskId && newOrder !== null) {
    const movedTaskIndex = tasks.findIndex(task => task._id.toString() === movedTaskId);
    if (movedTaskIndex !== -1) {
      const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
      updatedTasks.splice(newOrder, 0, movedTask);
    } else {
      console.warn(`Task with id ${movedTaskId} not found in status ${status}`);
    }
  }

  const updates = updatedTasks.map((task, index) => ({
    updateOne: {
      filter: { _id: task._id },
      update: { $set: { order: index } }
    }
  }));

  if (updates.length > 0) {
    await Task.bulkWrite(updates);
  }
};