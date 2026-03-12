import { Icon } from "@iconify/react"
import { useCreateAttendance } from "../../../data/queries/attendances.queries"
import { useState, useMemo } from "react"
import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"

const AttendenceTable = ({ days_of_week = [], scheduleId, id, setNotif, studentsData }) => {
     const { mutate: updateAttendance } = useCreateAttendance()

     // monthOffset: 0 - joriy oy, -1 - o'tgan oy, 1 - kelgusi oy
     const [monthOffset, setMonthOffset] = useState(0)
     const [selectedStatuses, setSelectedStatuses] = useState({})

     const dayCodeMap = {
          1: "Du",
          2: "Se",
          3: "Cho",
          4: "Pay",
          5: "Ju",
          6: "Sha",
          0: "Ya"
     }

     const monthNames = [
          "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
          "Iyul", "Avgust", "Sentyabr", "Oktabr", "Noyabr", "Dekabr"
     ]

     const lessonDates = useMemo(() => {
          const dates = []
          const now = new Date()
          const year = now.getFullYear()
          const month = now.getMonth() + monthOffset

          const lastDate = new Date(year, month + 1, 0).getDate()
          const useAllDays = days_of_week.length === 0

          for (let i = 1; i <= lastDate; i++) {
               const tempDate = new Date(year, month, i)
               const code = dayCodeMap[tempDate.getDay()]

               // Yakshanba bo'lmasa va tanlangan dars kunlariga to'g'ri kelsa
               if (tempDate.getDay() !== 0 && (useAllDays || days_of_week.some(day => day.code === code))) {
                    dates.push(new Date(tempDate))
               }
          }
          return dates
     }, [monthOffset, days_of_week])


     const currentHeaderMonth = useMemo(() => {
          const now = new Date()
          const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
          return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`
     }, [monthOffset])

     const saveAttendance = () => {
          const items = Object.keys(selectedStatuses).map(student_id => ({
               student_id: Number(student_id),
               status: selectedStatuses[student_id]
          }))

          updateAttendance(
               {
                    id: scheduleId,
                    data: { items }
               },
               {
                    onSuccess: () => {
                         setNotif({ show: true, type: "edited", message: "Davomat saqlandi" })
                    },
                    onError: (err) => {
                         console.error(err)
                         setNotif({ show: true, type: 'error', message: "Xatolik yuz berdi!" })
                    }
               }
          )
     }

     return (
          <div className="attendence-wrapper" style={{ overflowX: "auto" }}>
               {/* HEADER */}
               <div className="d-flex align-items-center gap-3 my-3">
                    <button className="btn btn-sm border" onClick={() => setMonthOffset(p => p - 1)}>
                         <Icon icon="akar-icons:chevron-left" />
                    </button>

                    <span className="fs-4 fw-semibold">
                         {currentHeaderMonth}
                    </span>

                    <button className="btn btn-sm border" onClick={() => setMonthOffset(p => p + 1)}>
                         <Icon icon="akar-icons:chevron-right" />
                    </button>
               </div>

               {/* TABLE */}
               <Table>
                    <thead>
                         <tr>
                              <th>O‘quvchi</th>
                              <th>
                                   <div className="d-flex align-items-center gap-1">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00a854" }} /> Keldi
                                   </div>
                              </th>
                              <th>
                                   <div className="d-flex align-items-center gap-1">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4d4d" }} /> Kelmadi
                                   </div>
                              </th>
                              <th>
                                   <div className="d-flex align-items-center gap-1">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#c48a07" }} /> Kech keldi
                                   </div>
                              </th>
                              <th>
                                   <div className="d-flex align-items-center gap-1">
                                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0881c2" }} /> Sababli
                                   </div>
                              </th>
                         </tr>
                    </thead>

                    <tbody>
                         {studentsData.length > 0 ? (
                              studentsData.map(student => (
                                   <tr key={student.student_id}>
                                        <td style={{ position: "sticky", left: 0, zIndex: 1 }}>
                                             <Link to={`/students/${student.student_id}`} className="text-decoration-none text-dark fw-medium">
                                                  {student.first_name} {student.last_name}
                                             </Link>
                                        </td>
                                        <td className="ps-3">
                                             <div
                                                  className="circle border"
                                                  onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "present" }))}
                                                  style={{ background: selectedStatuses[student.student_id] === "present" ? "#00a854" : "" }}
                                             />
                                        </td>
                                        <td className="ps-3">
                                             <div
                                                  className="circle border"
                                                  onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "absent" }))}
                                                  style={{ background: selectedStatuses[student.student_id] === "absent" ? "#ff4d4d" : "" }}
                                             />
                                        </td>
                                        <td className="ps-3">
                                             <div
                                                  className="circle border"
                                                  onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "late" }))}
                                                  style={{ background: selectedStatuses[student.student_id] === "late" ? "#c48a07" : "" }}
                                             />
                                        </td>
                                        <td className="ps-3">
                                             <div
                                                  className="circle border"
                                                  onClick={() => setSelectedStatuses(prev => ({ ...prev, [student.student_id]: "excused" }))}
                                                  style={{ background: selectedStatuses[student.student_id] === "excused" ? "#0881c2" : "" }}
                                             />
                                        </td>
                                   </tr>
                              ))
                         ) : (
                              <tr>
                                   <td colSpan={lessonDates.length + 1} className="text-center py-4 text-muted">
                                        Hozircha o‘quvchilar yo‘q!
                                   </td>
                              </tr>
                         )}
                    </tbody>
               </Table>

               <div className="d-flex justify-content-end mt-3">
                    <button
                         className="btn btn-sm save-button"
                         onClick={saveAttendance}
                         disabled={Object.keys(selectedStatuses).length === 0}
                    >
                         Saqlash
                    </button>
               </div>
          </div>
     )
}

export default AttendenceTable