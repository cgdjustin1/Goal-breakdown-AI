<!-- AITaskManager.vue -->
<template>
    <div class="flex h-screen bg-gray-50">
      <!-- Left - AI Chat -->
      <div class="w-1/4 bg-white shadow-md flex flex-col border-r border-gray-200">
        <div class="p-4 border-b border-gray-200 bg-gray-100">
          <h2 class="text-lg font-medium flex items-center text-gray-800">
            <MessageSquare class="mr-2 w-4 h-4" />
            AI Assistant
          </h2>
        </div>
  
        <div class="flex-grow overflow-y-auto p-4" ref="chatRef">
          <div v-for="(msg, index) in chatMessages" :key="index" :class="['mb-4', msg.role === 'user' ? 'text-right' : '']">
            <div :class="['inline-block p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg', msg.role === 'user' ? 'bg-gray-100' : 'bg-gray-50 border border-gray-200']">
              {{ msg.content }}
            </div>
          </div>
          <div v-if="isLoading" class="mb-4">
            <div class="inline-block p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="p-4 border-t border-gray-200">
          <div class="flex">
            <input
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Describe your task..."
              class="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              @click="sendMessage"
              class="bg-gray-800 hover:bg-gray-700 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      </div>
  
      <!-- Middle - Placeholder for Week Calendar -->
      <div class="w-1/2 bg-white shadow-md flex flex-col items-center justify-center text-gray-500">
        <p class="text-lg">[Week Calendar Here]</p>
      </div>
  
      <!-- Right - Task List -->
      <div class="w-1/4 bg-white shadow-md flex flex-col">
        <div class="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center">
          <h2 class="text-lg font-medium flex items-center text-gray-800">
            <CheckSquare class="mr-2 w-4 h-4" />
            Tasks
          </h2>
        </div>
  
        <div class="p-4 flex-grow overflow-y-auto">
          <div v-if="tasks.length === 0" class="text-center text-gray-400 mt-8">No tasks yet</div>
          <div v-else>
            <div
              v-for="task in tasks"
              :key="task.id"
              class="p-2 mb-2 rounded shadow-sm border-l-2 border-gray-400 bg-white flex justify-between items-center"
            >
              <span class="text-sm">{{ task.title }}</span>
              <Trash2 @click="deleteTask(task.id)" class="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
  
        <div class="p-3 border-t border-gray-200">
          <div class="flex text-sm">
            <input
              v-model="newTaskInput"
              @keyup.enter="addTask"
              type="text"
              placeholder="New task..."
              class="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              @click="addTask"
              class="bg-gray-800 hover:bg-gray-700 text-white px-3 rounded-r"
            >
              Add
            </button>
          </div>
          <div class="text-xs text-gray-400 mt-2">Tip: Chat with AI to generate tasks</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue';
  import { Trash2, MessageSquare, CheckSquare } from 'lucide-vue-next';
  
  const tasks = ref([]);
  const newTaskInput = ref('');
  const inputMessage = ref('');
  const isLoading = ref(false);
  const chatRef = ref(null);
  
  const chatMessages = ref([
    {
      role: 'assistant',
      content: `Hello! I'm your AI Task Assistant. I can help you break down tasks into executable steps. Tell me what task or project you want to accomplish!`,
    },
  ]);
  
  function addTask() {
    if (!newTaskInput.value.trim()) return;
    tasks.value.push({ id: Date.now(), title: newTaskInput.value.trim() });
    newTaskInput.value = '';
  }
  
  function deleteTask(id) {
    tasks.value = tasks.value.filter(t => t.id !== id);
  }
  
  function sendMessage() {
    if (!inputMessage.value.trim()) return;
    const userMessage = { role: 'user', content: inputMessage.value };
    chatMessages.value.push(userMessage);
    inputMessage.value = '';
    isLoading.value = true;
  
    setTimeout(() => {
      const assistantReply = {
        role: 'assistant',
        content:
          'Let me help break down this task. Here are steps:\n1. Plan\n2. Do\n3. Revise\n4. Complete',
      };
      chatMessages.value.push(assistantReply);
      tasks.value.push(
        { id: Date.now() + 1, title: 'Plan' },
        { id: Date.now() + 2, title: 'Do' },
        { id: Date.now() + 3, title: 'Revise' },
        { id: Date.now() + 4, title: 'Complete' }
      );
      isLoading.value = false;
      nextTick(() => {
        if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight;
      });
    }, 1500);
  }
  </script>
  
  <style scoped>
  .animate-bounce {
    animation: bounce 1s infinite;
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }
  .delay-200 {
    animation-delay: 0.2s;
  }
  .delay-400 {
    animation-delay: 0.4s;
  }
  </style>
  