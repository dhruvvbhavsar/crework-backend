const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['To do', 'In progress', 'Under review', 'Finished'],
    default: 'To do'
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'Urgent']
  },
  date: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  }
});

taskSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const createdDate = this.createdAt;
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return `${diffHours} hr ago`;
  } else {
    return `${diffDays} days ago`;
  }
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;