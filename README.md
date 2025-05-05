# 🚀 GoalFlow AI Task Manager


**GoalFlow AI** is an AI-powered task management tool built within **two days** during the [Anthropic x USC Claude Hackathon](https://anthropic-usc-hackathon.devpost.com/). It combines natural language interaction with a visual weekly planner to help users break down their goals and schedule actionable steps effectively.

**GitHub Repository**: [https://github.com/cgdjustin1/Goal-breakdown-AI](https://github.com/cgdjustin1/Goal-breakdown-AI)

---

### 🌟 Key Features

- 🧠 **AI Task Breakdown Assistant (Claude-powered)**  
  Describe your goal in natural language, and the AI assistant powered by **Anthropic Claude** will **automatically break it down** into smaller, executable steps. Then, automatically adds them to your to-do list.
  For example:  
  _"Plan my final paper for next week"_ →  
  _Claude suggests: “Research topic,” “Draft outline,” “Write first draft,” etc._

- 📆 **Weekly Calendar View**  
  Visualize your tasks on a draggable weekly planner. You can assign tasks to specific days by dragging them from the to-do list.

- 🔍 **Smart Task Filtering**  
  Easily toggle between All / Active / Done tasks in the right panel to stay focused and organized.

- ✏️ **Task Detail Editor**  
  Click on any task to view and edit its details, including title, date, time, and description in a clean popup.

---

### 📦 Tech Stack

- **Frontend**: Vue 3, Tailwind CSS  
- **Backend**: Python (`API_task_backend.py`)  
- **Icons**: Lucide Icons  
- **AI Logic**: Claude-style intent recognition and task breakdown simulation  
- **Storage**: LocalStorage (MVP stage, no database yet)

---

### 🧑‍💻 How to Use

#### 📦 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 🔧 Setup Environment

Create `.env` from template:

```bash
cp frontend/.env.template .env
```

Add your **Anthropic Claude API Key** to the `.env` file.

#### 🚀 Launch

Open `frontend/index.html` in your browser.

(Optional: Run `python API_task_backend.py` if backend is connected in future versions)

---

### 📁 File Structure

```
Goal-breakdown-AI/
├── API_task_backend.py         # Optional: future backend logic
├── frontend/
│   ├── index.html              # Main frontend interface
│   └── .env.template           # Sample environment config
├── requirements.txt            # Python dependencies
├── .gitignore
└── README.md
```

---

### ✅ User Interactions

| Action               | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| Add Task             | Use the input bar or AI chat assistant                                  |
| Drag & Drop          | Move tasks from the list to a calendar day                              |
| Mark as Done         | Click the ✅ icon to toggle completion                                   |
| View/Edit Task       | Click on a task to open the edit popup                                  |
| AI Task Breakdown    | Chat with the Claude assistant to break down big goals into subtasks    |
| AI Task Suggestions  | Claude helps populate the to-do list with actionable subtasks           |

---

### 🔮 Future Plans

- ✨ Full integration with **Anthropic Claude API**  
- 🔔 Reminders & overdue alerts  
- ☁️ Online sync (e.g., Firebase/Supabase)  
- 📱 Mobile optimization  
- 🤝 Smarter AI assistant that extracts tasks, dates, and priorities from free text  
- ✅ Enhanced task management features, such as priority levels, subtasks, recurring tasks, and task dependencies

---

### 🏆 Credits

Built during the [Anthropic x USC Claude Hackathon](https://anthropic-usc-hackathon.devpost.com/)  
with contributions from amazing open-source tools:

- [Vue.js](https://vuejs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Lucide Icons](https://lucide.dev/)  
- [Anthropic Claude](https://www.anthropic.com/index/claude) *(for concept and simulated breakdowns)*
