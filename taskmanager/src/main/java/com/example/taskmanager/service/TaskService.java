
package com.example.taskmanager.service;

import com.example.taskmanager.entity.Priority;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {

        task.setId(null);

        if (task.getPriority() == null) {
            task.setPriority(Priority.MEDIUM);
        }

        if (task.getCompleted() == null) {
            task.setCompleted(false);
        }

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task request) {

        Task existing = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: " + id
                        )
                );

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setDueDate(request.getDueDate());

        existing.setPriority(
                request.getPriority() == null
                        ? Priority.MEDIUM
                        : request.getPriority()
        );

        existing.setCompleted(
                request.getCompleted() == null
                        ? false
                        : request.getCompleted()
        );

        return taskRepository.save(existing);
    }

    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found with id: " + id
                        )
                );

        taskRepository.delete(task);
    }
}
