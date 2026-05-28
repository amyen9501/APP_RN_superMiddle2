import { create } from 'zustand';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';

const useTaskStore = create((set, get) => ({
    tasks: [],
    categories: ['工作', '生活', '學習', '其他'],
    isModalVisible: false,
    filterStatus: '進行中',

    setModalVisible: (visible) => set({ isModalVisible: visible }),
    setFilterStatus: (status) => set({ filterStatus: status }),

    listenToTasks: (forcedUid) => {
        const currentUid = forcedUid || auth.currentUser?.uid;
        const q = query(
            collection(db, "tasks"),
            where("userId", "==", currentUid),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (querySnapshot) => {
            console.log(`[Firebase] 同步成功，目前該 UID 雲端共有 ${querySnapshot.size} 筆任務`);
            const cloudTasks = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                cloudTasks.push({
                    id: doc.id,
                    title: data.title,
                    content: data.content || '',
                    status: data.isCompleted ? '已完成' : '進行中',
                    category: data.category || '其他',
                    date: data.date || '',
                });
            });
            set({ tasks: cloudTasks });
        }, (error) => {
            console.error("Firestore 監聽失敗:", error.message);
        });
    },

    addTask: async (newTask) => {
        const currentUid = auth.currentUser?.uid;
        if (!currentUid) return;

        try {
            await addDoc(collection(db, "tasks"), {
                userId: currentUid,
                title: newTask.title,
                content: newTask.content || '',
                category: newTask.category || '其他',
                date: newTask.date || '',
                isCompleted: false,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("雲端新增任務失敗:", error);
        }
    },

    updateTask: async (id, updateData) => {
        try {
            const taskRef = doc(db, "tasks", id);

            const updatedFields = { ...updateData };
            if (updateData.status) {
                updatedFields.isCompleted = updateData.status === '已完成';
                delete updatedFields.status;
            }

            await updateDoc(taskRef, updatedFields);
        } catch (error) {
            console.error("雲端更新任務失敗:", error);
        }
    },

    toggleTaskStatus: async (id) => {
        try {
            const taskRef = doc(db, "tasks", id);
            const currentTask = get().tasks.find(t => t.id === id);
            if (!currentTask) return;

            await updateDoc(taskRef, {
                isCompleted: currentTask.status !== '已完成'
            });
        } catch (error) {
            console.error("雲端切換狀態失敗:", error);
        }
    },

    deleteTask: async (id) => {
        try {
            await deleteDoc(doc(db, "tasks", id));
        } catch (error) {
            console.error("雲端刪除任務失敗:", error);
        }
    },

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

    migrateGuestTasks: async (guestUid, memberUid) => {
        if (!guestUid || !memberUid || guestUid === memberUid) return;

        try {
            const { getDocs } = require('firebase/firestore');
            const q = query(
                collection(db, "tasks"),
                where("userId", "==", guestUid)
            );
            const querySnapshot = await getDocs(q);

            const batchPromises = querySnapshot.docs.map((docSnapshot) => {
                const taskRef = doc(db, "tasks", docSnapshot.id);
                return updateDoc(taskRef, { userId: memberUid });
            });

            await Promise.all(batchPromises);
            console.log("[Zustand] 訪客任務已成功移轉至會員帳號");
        } catch (error) {
            console.error("移轉任務失敗:", error);
        }
    },
}));

export default useTaskStore;