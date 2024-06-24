async function addTask() {
    let text = document.getElementById('titleNewTask').value;

    const newItem = {
        title: text, 
        status: "TODO",
        desc: "",
        createDate: new Date().toISOString().slice(0, 10)
    };
    try {
        const response = await fetch("http://localhost:3000/tasks", {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (response.ok) {
            document.getElementById('titleNewTask').value = "";
            renderColumns();
        }
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
    }
}

async function getTask(id) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            mode: 'cors', 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Erro ao obter tarefa:', error);
        return null; 
    }
}

async function getAllTasks(){
    try {
        const response = await fetch(`http://localhost:3000/tasks/`, {
            mode: 'cors', 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Erro ao obter tarefa:', error);
        return null; 
    }
}

async function editTask() {
    const formData = new FormData(document.getElementById('taskForm'));
    const taskId = formData.get('id');
    try {
        const response = fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });

        if (response.ok) {
            renderColumns();
        }
    } catch (error) {
        console.error('Erro ao obter tarefa:', error);
        return null; 
    }
}

async function deleteTask() {
    const formData = new FormData(document.getElementById('taskForm'));
    const taskId = formData.get('id');
    try {
        const response = fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            renderColumns();
        }
    } catch (error) {
        console.error('Erro ao obter tarefa:', error);
        return null; 
    }
}

const loadPopupContent = async (id) => {
    const popupDialog = document.getElementById('popupDialog');
    const popupContent = document.getElementById('popupContent');
    const closePopup = () => { popupDialog.close(); };
    try {
        const taskData = await getTask(id);

        fetch('../pages/tarefa/tarefa.html')
            .then(response => response.text())
            .then(data => {
                popupContent.innerHTML = data;
                popupDialog.showModal();
                const closeBtn = document.getElementById('closeBtn');
                closeBtn.addEventListener('click', closePopup);
                
                if (taskData) {
                    document.getElementById('id').value = taskData.id;
                    document.getElementById('title').value = taskData.title || '';
                    document.getElementById('createDate').value = taskData.createDate || '';
                    document.getElementById('desc').value = taskData.desc || '';
                    document.getElementById('status').value = taskData.status;
                }
            })
            .catch(error => console.error('Error loading popup content:', error));
    } catch (error) {
        console.error('Error getting task data:', error);
    }
};

async function renderColumns(){
    try {
        const tasks = await getAllTasks();
        tasks.forEach(task => {
            renderTask(task);
        });
      
    } catch (error) {
        console.error('Erro ao obter tarefa:', error);
        return null; 
    }
}

function renderTask(data) {
    let columnTodo = document.getElementById('todo');
    let columnDoing = document.getElementById('doing');
    let columnDone = document.getElementById('done');

    let newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.addEventListener('click', function () {
        loadPopupContent(data.id);
    });

    Object.assign(newItem.style, {
        borderRadius: '8px',
        backgroundColor: '#A3489D',
        padding: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
    });

    let titulo = document.createElement('span');
    titulo.textContent = data.title;

    newItem.appendChild(titulo);

    if(data.status === 'TODO'){
        columnTodo.appendChild(newItem);
    }else if(data.status === 'DOING'){
        columnDoing.appendChild(newItem);
    }else if(data.status === 'DONE'){
        columnDone.appendChild(newItem);
    }
}

window.onload = function() {
    const inputElement = document.getElementById('titleNewTask');
    inputElement.focus();
    renderColumns();
};