import { useState, useRef, useEffect } from 'react';
import { Trash2, MessageSquare, Calendar, CheckSquare, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function AITaskManager() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI Task Assistant. I can help you break down tasks into executable steps. Tell me what task or project you want to accomplish!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingTask, setDraggingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  // Date handling functions
  const getWeekDays = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to start from Monday
    const monday = new Date(date.setDate(diff));
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(monday);
      newDate.setDate(monday.getDate() + i);
      weekDays.push(newDate);
    }
    
    return weekDays;
  };

  const weekDays = getWeekDays(new Date(currentDate));
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Week view navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Task operations
  const addTask = (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      date: null
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Enhanced drag and drop functionality
  const handleDragStart = (task, e) => {
    setDraggingTask(task);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  };

  const handleDrop = (date, targetTaskId = null) => {
    if (!draggingTask) return;
    
    // Case 1: Dropping on the task list (removing date)
    if (date === 'taskList') {
      setTasks(tasks.map(task => 
        task.id === draggingTask.id ? { ...task, date: null } : task
      ));
    }
    // Case 2: Reordering within the same date or moving to a different date
    else {
      const formattedDate = new Date(date);
      
      // If we have a target task, we're reordering
      if (targetTaskId) {
        // Get all tasks for this date
        const dateTasks = getTasksForDate(formattedDate);
        // Find the positions of the dragged task and target task
        const targetIndex = dateTasks.findIndex(t => t.id === targetTaskId);
        
        // Create a new order for tasks on this date
        const updatedTasks = tasks.map(task => {
          // Update the dragged task with the new date
          if (task.id === draggingTask.id) {
            return { ...task, date: formattedDate };
          }
          return task;
        });
        
        // Sort the tasks with the new order
        setTasks(updatedTasks);
      } 
      // Just moving to a date with no specific order
      else {
        setTasks(tasks.map(task => 
          task.id === draggingTask.id ? { ...task, date: formattedDate } : task
        ));
      }
    }
    
    setDraggingTask(null);
  };

  // Chat functionality
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = { role: 'user', content: inputMessage };
    setChatMessages([...chatMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // In a real app, this would call an AI API
    // Simulating AI response process
    setTimeout(() => {
      let response;
      
      if (inputMessage.toLowerCase().includes('project') || 
          inputMessage.toLowerCase().includes('task') || 
          inputMessage.toLowerCase().includes('complete') ||
          inputMessage.toLowerCase().includes('do')) {
        response = {
          role: 'assistant',
          content: `Let me help break down this task. Here are the executable steps:\n\n1. Gather requirements and materials\n2. Create initial plan\n3. Allocate resources and time\n4. Execute main work\n5. Test and revise\n6. Complete and deliver results`,
          suggestedTasks: [
            'Gather requirements and materials',
            'Create initial plan',
            'Allocate resources and time',
            'Execute main work',
            'Test and revise',
            'Complete and deliver results'
          ]
        };
      } else {
        response = {
          role: 'assistant',
          content: 'What task or project would you like to break down? Please provide more details, and I can help divide it into executable steps.'
        };
      }
      
      setChatMessages(prev => [...prev, response]);
      
      // If there are suggested tasks, add them to the task list
      if (response.suggestedTasks) {
        response.suggestedTasks.forEach(task => addTask(task));
      }
      
      setIsLoading(false);
    }, 1500);
  };

  // Add new task from input
  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      addTask(newTaskInput.trim());
      setNewTaskInput('');
    }
  };

  // Handle keyboard events for task input
  const handleTaskInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Handle keyboard events for chat
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Auto-scroll to chat bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.date) return false;
      return date.getDate() === task.date.getDate() &&
        date.getMonth() === task.date.getMonth() &&
        date.getFullYear() === task.date.getFullYear();
    });
  };

  // Get unscheduled tasks
  const getUnscheduledTasks = () => {
    return tasks.filter(task => !task.date);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left - AI Chat */}
      <div className="w-1/4 bg-white shadow-md flex flex-col border-r border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-100">
          <h2 className="text-lg font-medium flex items-center text-gray-800">
            <MessageSquare className="mr-2" size={18} />
            AI Assistant
          </h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4" ref={chatRef}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg 
                ${msg.role === 'user' ? 'bg-gray-100' : 'bg-gray-50 border border-gray-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your task..."
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button 
              onClick={sendMessage} 
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Middle - Week Calendar */}
      <div className="w-1/2 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium flex items-center text-gray-800">
            <Calendar className="mr-2" size={18} />
            Week View
          </h2>
          <div className="flex items-center">
            <button onClick={goToPreviousWeek} className="p-1 hover:bg-gray-200 rounded-full">
              <ChevronLeft size={18} />
            </button>
            <span className="mx-2 text-sm">
              {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            <button onClick={goToNextWeek} className="p-1 hover:bg-gray-200 rounded-full">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-7 text-center p-2 border-b">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={i} className="font-medium text-sm text-gray-600">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 h-full">
            {weekDays.map((date, i) => (
              <div 
                key={i} 
                className={`border border-gray-100 min-h-24 p-2 ${isToday(date) ? 'bg-gray-50' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(date)}
              >
                <div className={`text-xs ${isToday(date) ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                  {formatDate(date)}
                </div>
                <div className="mt-1">
                  {getTasksForDate(date).map(task => (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(task, e)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(date, task.id)}
                      className={`p-1 mb-1 rounded text-xs cursor-pointer flex items-center 
                        ${task.completed ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <div 
                        className={`w-3 h-3 border rounded flex items-center justify-center mr-1 flex-shrink-0
                          ${task.completed ? 'bg-green-100 border-green-400' : 'border-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(task.id);
                        }}
                      >
                        {task.completed && (
                          <svg className="w-2 h-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Task List */}
      <div className="w-1/4 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-medium flex items-center text-gray-800">
            <CheckSquare className="mr-2" size={18} />
            Tasks
          </h2>
          <button 
            onClick={() => addTask('New Task')} 
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <Plus size={18} />
          </button>
        </div>

        <div 
          className="p-4 flex-grow overflow-y-auto"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('taskList')}
        >
          {getUnscheduledTasks().length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              No tasks yet
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2 text-sm text-gray-600">Unscheduled</h3>
              {getUnscheduledTasks().map(task => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(task, e)}
                  className={`p-2 mb-2 rounded shadow-sm border-l-2 border-gray-400 flex justify-between items-center
                    ${task.completed ? 'bg-gray-50 line-through text-gray-400' : 'bg-white'}`}
                >
                  <div 
                    className="flex items-center flex-grow cursor-pointer"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${task.completed ? 'bg-green-100 border-green-400' : 'border-gray-300'}`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{task.title}</span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-200">
          <div className="flex text-sm">
            <input
              type="text"
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyPress={handleTaskInputKeyPress}
              placeholder="New task..."
              className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button 
              onClick={handleAddTask} 
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 rounded-r"
            >
              Add
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Tip: Drag tasks to calendar to schedule
          </div>
        </div>
      </div>
    </div>
  );
}