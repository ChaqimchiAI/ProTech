import { Form, Spinner } from "react-bootstrap"; // Spinner qo'shildi
import Modal from "../../../components/Ui/Modal";
import { Input } from "../../../components/Ui/Input";
import { useCreateGroup } from "../../../data/queries/group.queries";
import { useState } from "react";
import { useCourses } from "../../../data/queries/courses.queries";

const AddGroup = ({ addGroup, setAddGroup, setNotif }) => {
    const { mutateAsync: createGroup, isPending: createGroupLoading } = useCreateGroup();
    
    // Kurslarni olish
    const { data: courses } = useCourses();
    // Agar ma'lumot hali kelmagan bo'lsa, bo'sh massiv [] qilib turamiz
    const courseData = courses?.results || [];

    const [addNewGroup, setAddNewGroup] = useState({
        name: "",
        started_date: "",
        ended_date: "",
        status: "active", // Default qiymat
        description: "",
        course: "",
    });

    const handleAddNewGroup = async (e) => {
        e.preventDefault();

        // Validatsiya mantiqini to'g'irlash
        if (!addNewGroup.name || !addNewGroup.course || !addNewGroup.started_date || !addNewGroup.status) {
            setNotif({ show: true, type: "warn", message: "Barcha majburiy maydonlarni to'ldiring!" });
            return;
        }

        const payload = {
            name: addNewGroup.name,
            status: addNewGroup.status,
            course: Number(addNewGroup.course),
            branch: 1, // Static yoki dinamik branch ID
            attendance_kpi: 0,
            exam_kpi: 0,
            homework_kpi: 0,
            students_count: 0,
            started_date: addNewGroup.started_date,
            ended_date: addNewGroup.ended_date || null,
            description: addNewGroup.description
        };

        try {
            await createGroup(payload);
            setNotif({ show: true, type: "success", message: "Guruh muvaffaqiyatli qo‘shildi" });
            setAddGroup(false);
            // Formani tozalash
            setAddNewGroup({
                name: "",
                started_date: "",
                ended_date: "",
                status: "active",
                description: "",
                course: "",
            });
        } catch (err) {
            console.error(err);
            setNotif({ show: true, type: "error", message: "Guruh qo‘shishda xatolik yuz berdi!" });
        }
    };

    return (
        <Modal
            title="Yangi guruh qo'shish"
            close={() => setAddGroup(false)}
            anima={addGroup}
            width="30%"
            zIndex={100}
        >
            <Form className="mt-3" onSubmit={handleAddNewGroup}>
                <Form.Group className="mb-3">
                    <Input
                        label="Guruh nomi"
                        required
                        value={addNewGroup.name}
                        placeholder="Guruh nomi..."
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, name: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <label htmlFor="course" className="form-label">Kurs</label>
                    <select
                        required
                        id="course"
                        className="form-select"
                        value={addNewGroup.course}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, course: e.target.value })}
                    >
                        <option value="" disabled>Kurs tanlash</option>
                        {courseData.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </Form.Group>

                <div className="d-flex justify-content-between gap-3 mb-3">
                    <Input
                        required
                        type="date"
                        label="Boshlanish sanasi"
                        containerClassName="w-50"
                        value={addNewGroup.started_date}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, started_date: e.target.value })}
                    />
                    <Input
                        type="date"
                        label="Tugash sanasi"
                        containerClassName="w-50"
                        value={addNewGroup.ended_date}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, ended_date: e.target.value })}
                    />
                </div>

                <Form.Group className="mb-3">
                    <label htmlFor="status" className="form-label">Holati</label>
                    <select
                        required
                        id="status"
                        className="form-select"
                        value={addNewGroup.status}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, status: e.target.value })}
                    >
                        <option value="active">Faol</option>
                        <option value="finished">Tugagan</option>
                        <option value="waiting">Kutilmoqda</option>
                        <option value="paused">To'xtatilgan</option>
                    </select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <label htmlFor="desc" className="form-label">Izoh</label>
                    <textarea
                        rows="3"
                        id="desc"
                        placeholder="Izoh..."
                        className="form-control"
                        style={{ resize: "none" }}
                        value={addNewGroup.description}
                        onChange={(e) => setAddNewGroup({ ...addNewGroup, description: e.target.value })}
                    ></textarea>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                        type="button"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#e5e5e5", color: "#000" }}
                        onClick={() => setAddGroup(false)}
                    >
                        Orqaga
                    </button>
                    <button
                        type="submit"
                        className="btn btn-sm py-2 px-4"
                        style={{ background: "#0085db", color: "#fff" }}
                        disabled={createGroupLoading}
                    >
                        {createGroupLoading ? <Spinner animation="border" size="sm" /> : "Saqlash"}
                    </button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddGroup;