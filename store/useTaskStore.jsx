import { create } from 'zustand';

const useTaskStore = create((set,get) => ({
    tasks: [],
    categories: ['工作', '生活', '學習', '其他'],
    isModalVisible: false,
    filterStatus: '進行中',

    setModalVisible: (visible) => set({ isModalVisible: visible }),
    setFilterStatus: (status) => set({ filterStatus: status }),

    addTask: (newTask) => set((state) => ({
        tasks: [...state.tasks, {
            id: Date.now().toString(),
            status: '進行中',
            ...newTask
        }]
    })),
    updateTask: (id, updateData) => set((state) => ({
        tasks: state.tasks.map(task => task.id === id ? { ...task, ...updateData } : task)
    })),
    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
    })),
    addCategory: (newCate) => set((state) => ({
        categories: state.categories.includes(newCate)
            ? state.categories : [...state.categories, newCate]
    })),
    deleteCategory: (categoryName) => {
    const { tasks } = get();
    const isBeingUsed = tasks.some(t => t.category === categoryName);
    if (isBeingUsed) {
        return { success: false, message: "該分類尚有任務，無法刪除！" };
    }
    set((state) => ({
        categories: state.categories.filter(c => c !== categoryName)
    }));
    return { success: true };
},
    toggleTaskStatus: (id) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, status: task.status === '進行中' ? '已完成' : '進行中' } : task)
    })),
}));

export default useTaskStore;
