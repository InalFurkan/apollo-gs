const API_URL = 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${getToken()}`
});

const checkResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    console.log('Response Content-Type:', contentType);

    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
    }
};

export const login = async (email, password) => {
    try {
        console.log('Sending login request to:', `${API_URL}/login`);
        console.log('With credentials:', { email, password });

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status);
        const data = await checkResponse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Login error details:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export const getTasks = async () => {
    try {
        console.log('Fetching tasks with headers:', headers());
        const response = await fetch(`${API_URL}/tasks`, {
            headers: headers(),
        });

        console.log('Tasks response status:', response.status);
        const data = await checkResponse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch tasks');
        }

        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        console.log('Creating task with data:', taskData);
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(taskData),
        });

        console.log('Create task response status:', response.status);
        const data = await checkResponse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create task');
        }

        return data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        console.log('Updating task:', taskId, 'with data:', taskData);
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(taskData),
        });

        console.log('Update task response status:', response.status);
        const data = await checkResponse(response);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update task');
        }

        return data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        console.log('Deleting task:', taskId);
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: headers(),
        });

        console.log('Delete task response status:', response.status);

        if (!response.ok) {
            const data = await checkResponse(response);
            throw new Error(data.message || 'Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

export const getTags = async () => {
    try {
        const response = await fetch(`${API_URL}/tags`, {
            headers: headers(),
        });
        const data = await checkResponse(response);
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch tags');
        }
        return data;
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw error;
    }
};