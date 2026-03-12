import { Button, Spinner } from "react-bootstrap"
import { Input } from "../../../components/Ui/Input"
import Modal from "../../../components/Ui/Modal"
import { ReactSelect } from "../../../components/Ui/ReactSelect"
import { useCreateStudentTransaction } from "../../../data/queries/billing.queries"
import { useState } from "react"

const PaymentModal = ({
    paymentModal,
    setPaymentModal,
    setNotif,
    studentsData
}) => {

    const [selectedStudent, setSelectedStudent] = useState(null)
    const [paymentAmount, setPaymentAmount] = useState("")
    const [paymentType, setPaymentType] = useState("cash")

    const { mutate: createStudentTransaction, isPending: paymating } = useCreateStudentTransaction(selectedStudent)

    const handlePayment = () => {

        if (!selectedStudent) {
            setNotif({ show: true, type: "error", message: "O'quvchi tanlanmadi" })
            return
        }

        if (!paymentAmount) {
            setNotif({ show: true, type: "error", message: "To'lov miqdori kiritilmadi" })
            return
        }

        const body = {
            amount: paymentAmount,
            type: paymentType,
        }
        createStudentTransaction(
            body,
            {
                onSuccess: () => {
                    setNotif({ show: true, type: "success", message: "To'lov muvaffaqiyatli amalga oshirildi" })
                    setPaymentModal(false)
                    setPaymentAmount("")
                    setSelectedStudent(null)
                },
                onError: (err) => {
                    console.error(err)
                    setNotif({ show: true, type: "error", message: "Xatolik yuz berdi!" })
                }
            }
        )
    }

    return (
        <Modal
            title="To'lov qilish"
            anima={paymentModal}
            close={setPaymentModal}
            width="30%"
            zIndex={100}
            scroll={true}
        >
            <form onSubmit={handlePayment}>
                <div className="d-flex gap-3 my-3">
                    <div className="form-check cursor-pointer">
                        <input
                            className="form-check-input cursor-pointer"
                            type="radio"
                            name="paymentType"
                            id="cash"
                            value="cash"
                            checked={paymentType === "cash"}
                            onChange={(e) => setPaymentType(e.target.value)}
                        />
                        <label className={`form-check-label cursor-pointer`} htmlFor="cash">Naqd</label>
                    </div>
                    <div className="form-check cursor-pointer">
                        <input
                            className="form-check-input cursor-pointer"
                            type="radio"
                            name="paymentType"
                            id="card"
                            value="card"
                            checked={paymentType === "card"}
                            onChange={(e) => setPaymentType(e.target.value)}
                        />
                        <label className={`form-check-label cursor-pointer`} htmlFor="card">Plastik</label>
                    </div>
                </div>

                <ReactSelect
                    label="O'quvchi tanlash"
                    placeholder="O'quvchini tanlang"
                    required
                    options={studentsData?.map(student => ({
                        value: student.id,
                        label: `${student.first_name} ${student.last_name} ${student.phone} ${student.balance}`,
                        student: student
                    }))}
                    formatOptionLabel={({ student }) => (
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div className="d-flex flex-column">
                                <span className="fw-semibold">{student.first_name} {student.last_name}</span>
                                <small className="text-muted opacity-75" style={{ fontSize: '11px' }}>{student.phone}</small>
                            </div>
                            <div className="text-end ms-3">
                                <span className="text-success fw-bold" style={{ color: Number(student.balance) > 1 ? "#10b981" : "#f59e0b" }}>{(Number(student.balance) || 0).toLocaleString()}</span>
                                <small className="text-success ms-1" style={{ fontSize: '10px' }}>so'm</small>
                            </div>
                        </div>
                    )}
                    onChange={(option) => setSelectedStudent(option.value)}
                />

                <Input
                    label="To'lov summasi"
                    placeholder="To'lov summasini kiriting"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                />

                <div className="d-flex justify-content-end gap-2">
                    <Button className="cencel-button btn-sm">
                        Orqaga
                    </Button>
                    <Button
                        className="save-button btn-sm"
                        onClick={handlePayment}
                    >
                        {paymating ? <Spinner animation="border" size="sm" /> : "To'lash"}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

export default PaymentModal