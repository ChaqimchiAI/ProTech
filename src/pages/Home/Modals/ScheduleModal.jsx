import Modal from "../../../components/Ui/Modal"

const ScheduleModal = ({ scheduleModal, setScheduleModal }) => {
  return (
    <Modal
      title="Dars jadvali"
      anima={scheduleModal}
      close={setScheduleModal}
      width="95%"
      zIndex={1000}
    >
      <div style={{ minHeight: "74.5vh" }}>
        <p className="fs-5 fw-bold mt-4 alert alert-success">Hozircha dars jadvallari yo'q</p>
      </div>
    </Modal>
  )
}

export default ScheduleModal