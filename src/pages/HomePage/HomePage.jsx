import { useState, useEffect } from 'react';
import styles from './HomePage.module.scss';
import Weather from '@/widgets/Weather';
import Button2 from '@/shared/ui/Button';
import RouterLink from '@/shared/ui/RouterLink';

const HomePage = () => {
    const [quickNote, setQuickNote] = useState(() => {
        return localStorage.getItem('quickNote') || '';
    });
    const [pendingTasksCount, setPendingTasksCount] = useState(0);

    useEffect(() => {
        const tasks = localStorage.getItem('tasks');
        const parsedTasks = tasks ? JSON.parse(tasks) : [];
        const incompleteCount = parsedTasks.filter(task => !task.isDone).length;
        setPendingTasksCount(incompleteCount);
    }, []);

    useEffect(() => {
        const savedNote = localStorage.getItem('quickNote');
        if (savedNote) setQuickNote(savedNote);
    }, []);

    useEffect(() => {
        localStorage.setItem('quickNote', quickNote);
    }, [quickNote]);

    return (
        <div className={styles.homePage}>
            {/* Часы (заглушка) */}
            <div className={styles.clockWrapper}>
                <div className={styles.clock}>--:--:--</div>
                <div className={styles.date}>-- ------ ----</div>
            </div>
            <Weather />

            {/* Быстрая заметка */}
            <div className={styles.noteSection}>
                <h3 className={styles.sectionTitle}>✏️ Быстрая заметка</h3>
                <textarea
                    className={styles.quickNote}
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder="Что-то записать..."
                    rows={3}
                />
            </div>

            {/* Статистика задач и переход */}
            <div className={styles.tasksSection}>
                <div className={styles.tasksInfo}>
                    <span className={styles.tasksIcon}>📋</span>
                    <span>Осталось выполнить: {pendingTasksCount}</span>
                </div>
                <RouterLink to="/tasks">
                    <Button2 variant="primary" size="medium">
                        Перейти к заметкам →
                    </Button2>
                </RouterLink>
            </div>
        </div>
    );
};

export default HomePage;