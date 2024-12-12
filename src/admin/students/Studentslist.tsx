import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import Papa from "papaparse";
import jsPDF from "jspdf";

const AddStudentFormSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required").min(3, "Full Name must be at least 3 characters"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
  course: Yup.string().required("Please select a course"),
  dob: Yup.date().required("Date of Birth is required"),
});

const Studentlist = () => {
  const [studentData, setStudentData] = useState([
    {
      id: 1,
      fullName: "Caroline Jensen",
      email: "carolinejensen@zidant.com",
      phone: "+1 (821) 447-3782",
      dob: "2004-05-28",
      course: "POLARAX",
    },
  ]);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // Page size state
  const [currentPage, setCurrentPage] = useState(1); // Current page state

  const handleAddStudent = (values, { resetForm }) => {
    const newStudent = {
      ...values,
      id: studentData.length + 1,
    };

    setStudentData((prev) => [...prev, newStudent]);

    Swal.fire({
      icon: "success",
      title: "Student added successfully",
      timer: 3000,
    });

    resetForm();
    setIsAddStudentModalOpen(false);
  };

  const handleEditStudent = (values, { resetForm }) => {
    setStudentData((prev) =>
      prev.map((student) => (student.id === editStudent.id ? { ...editStudent, ...values } : student))
    );

    Swal.fire({
      icon: "success",
      title: "Student updated successfully",
      timer: 3000,
    });

    resetForm();
    setEditStudent(null);
    setIsEditStudentModalOpen(false);
  };

  const handleDeleteStudent = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setStudentData((prev) => prev.filter((student) => student.id !== id));
        Swal.fire("Deleted!", "The student has been deleted.", "success");
      }
    });
  };

  const exportToCSV = () => {
    const csvData = studentData.map(({ id, fullName, email, phone, dob, course }) => ({ id, fullName, email, phone, dob, course }));
    const csvContent = [
      ["ID", "Full Name", "Email", "Phone", "Date of Birth", "Course"],
      ...csvData.map(Object.values),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Student List", 10, 10);
    const tableColumn = ["ID", "Full Name", "Email", "Phone", "Date of Birth", "Course"];
    const tableRows = studentData.map((row) => [
      row.id,
      row.fullName,
      row.email,
      row.phone,
      row.dob,
      row.course,
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("students.pdf");
  };

  const filteredData = studentData.filter((student) =>
    Object.values(student)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <button
        key={i}
        className={`btn ${i === currentPage ? "btn-primary" : "btn-secondary"}`}
        onClick={() => setCurrentPage(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4 panel bg-light">
      <div className="flex gap-4">
      <button
              type="button"
              onClick={exportToCSV}
              className="btn btn-primary btn-sm m-1 "
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ltr:mr-2 rtl:ml-2"
              >
                <path
                  d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.5"
                  d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              CSV
            </button>
            
            <button
              type="button"
              onClick={exportToPDF}
              className="btn btn-primary btn-sm m-1"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ltr:mr-2 rtl:ml-2"
              >
                <path
                  d="M15.3929 4.05365L14.8912 4.61112L15.3929 4.05365ZM19.3517 7.61654L18.85 8.17402L19.3517 7.61654ZM21.654 10.1541L20.9689 10.4592V10.4592L21.654 10.1541ZM3.17157 20.8284L3.7019 20.2981H3.7019L3.17157 20.8284ZM20.8284 20.8284L20.2981 20.2981L20.2981 20.2981L20.8284 20.8284ZM14 21.25H10V22.75H14V21.25ZM2.75 14V10H1.25V14H2.75ZM21.25 13.5629V14H22.75V13.5629H21.25ZM14.8912 4.61112L18.85 8.17402L19.8534 7.05907L15.8947 3.49618L14.8912 4.61112ZM22.75 13.5629C22.75 11.8745 22.7651 10.8055 22.3391 9.84897L20.9689 10.4592C21.2349 11.0565 21.25 11.742 21.25 13.5629H22.75ZM18.85 8.17402C20.2034 9.3921 20.7029 9.86199 20.9689 10.4592L22.3391 9.84897C21.9131 8.89241 21.1084 8.18853 19.8534 7.05907L18.85 8.17402ZM10.0298 2.75C11.6116 2.75 12.2085 2.76158 12.7405 2.96573L13.2779 1.5653C12.4261 1.23842 11.498 1.25 10.0298 1.25V2.75ZM15.8947 3.49618C14.8087 2.51878 14.1297 1.89214 13.2779 1.5653L12.7405 2.96573C13.2727 3.16993 13.7215 3.55836 14.8912 4.61112L15.8947 3.49618ZM10 21.25C8.09318 21.25 6.73851 21.2484 5.71085 21.1102C4.70476 20.975 4.12511 20.7213 3.7019 20.2981L2.64124 21.3588C3.38961 22.1071 4.33855 22.4392 5.51098 22.5969C6.66182 22.7516 8.13558 22.75 10 22.75V21.25ZM1.25 14C1.25 15.8644 1.24841 17.3382 1.40313 18.489C1.56076 19.6614 1.89288 20.6104 2.64124 21.3588L3.7019 20.2981C3.27869 19.8749 3.02502 19.2952 2.88976 18.2892C2.75159 17.2615 2.75 15.9068 2.75 14H1.25ZM14 22.75C15.8644 22.75 17.3382 22.7516 18.489 22.5969C19.6614 22.4392 20.6104 22.1071 21.3588 21.3588L20.2981 20.2981C19.8749 20.7213 19.2952 20.975 18.2892 21.1102C17.2615 21.2484 15.9068 21.25 14 21.25V22.75ZM21.25 14C21.25 15.9068 21.2484 17.2615 21.1102 18.2892C20.975 19.2952 20.7213 19.8749 20.2981 20.2981L21.3588 21.3588C22.1071 20.6104 22.4392 19.6614 22.5969 18.489C22.7516 17.3382 22.75 15.8644 22.75 14H21.25ZM2.75 10C2.75 8.09318 2.75159 6.73851 2.88976 5.71085C3.02502 4.70476 3.27869 4.12511 3.7019 3.7019L2.64124 2.64124C1.89288 3.38961 1.56076 4.33855 1.40313 5.51098C1.24841 6.66182 1.25 8.13558 1.25 10H2.75ZM10.0298 1.25C8.15538 1.25 6.67442 1.24842 5.51887 1.40307C4.34232 1.56054 3.39019 1.8923 2.64124 2.64124L3.7019 3.7019C4.12453 3.27928 4.70596 3.02525 5.71785 2.88982C6.75075 2.75158 8.11311 2.75 10.0298 2.75V1.25Z"
                  fill="currentColor"
                />
                <path
                  opacity="0.5"
                  d="M6 14.5H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M6 18H11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  opacity="0.5"
                  d="M13 2.5V5C13 7.35702 13 8.53553 13.7322 9.26777C14.4645 10 15.643 10 18 10H22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              PDF
            </button>
         
          
        </div>
        <input
          type="text"
          placeholder="Search"
          className="form-input w-1/4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setIsAddStudentModalOpen(true)}>
            Add Student
          </button>
      </div>

      <DataTable
        highlightOnHover
        records={paginatedData}
        columns={[
          { accessor: "id", title: "ID" },
          { accessor: "fullName", title: "Full Name" },
          { accessor: "email", title: "Email" },
          { accessor: "phone", title: "Phone" },
          { accessor: "dob", title: "Date of Birth" },
          { accessor: "course", title: "Course" },
          {
            accessor: "actions",
            title: "Actions",
            render: (record) => (
              <div className="flex gap-2">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    setEditStudent(record);
                    setIsEditStudentModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteStudent(record.id)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        pagination
      />

      <div className="flex justify-between items-center bg-white p-2">

      <div className="flex  items-center">
        <span>Show </span>
        <select
          className="form-select mx-2"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>entries</span>
      </div>
      <div className="flex items-center">
  <button
    className="btn btn-icon btn-primary rounded-full p-2"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>

  <div className="flex gap-2">{paginationItems}</div>

  <button
    className="btn btn-icon btn-primary rounded-full p-2"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5L15.75 12l-7.5 7.5" />
    </svg>
  </button>
</div>

      </div>

      



       {/* Add Student Modal */}
       <Transition appear show={isAddStudentModalOpen} as={Fragment}>
        <Dialog as="div" open={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex items-center justify-center min-h-screen px-4">
              <Dialog.Panel className="panel max-w-lg p-5 text-black bg-white rounded-lg">
                <Formik
                  initialValues={{
                    fullName: "",
                    email: "",
                    phone: "",
                    dob: "",
                    course: "",
                  }}
                  validationSchema={AddStudentFormSchema}
                  onSubmit={handleAddStudent}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-5">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                        <label htmlFor="fullName">Full Name</label>
                        <Field name="fullName" type="text" className="form-input" />
                        {touched.fullName && errors.fullName && (
                          <div className="text-danger">{errors.fullName}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email">Email</label>
                        <Field name="email" type="email" className="form-input" />
                        {touched.email && errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone">Phone</label>
                        <Field name="phone" type="text" className="form-input" />
                        {touched.phone && errors.phone && (
                          <div className="text-danger">{errors.phone}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="dob">Date of Birth</label>
                        <Field name="dob" type="date" className="form-input" />
                        {touched.dob && errors.dob && (
                          <div className="text-danger">{errors.dob}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="course">Course</label>
                        <Field name="course" as="select" className="form-input">
                          <option value="">Select a course</option>
                          <option value="Frontend">Frontend Development</option>
                          <option value="Backend">Backend Development</option>
                        </Field>
                        {touched.course && errors.course && (
                          <div className="text-danger">{errors.course}</div>
                        )}
                      </div>
                       </div>
                     
                      <button type="submit" className="btn btn-primary">
                        Add Student
                      </button>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Student Modal */}
      <Transition appear show={isEditStudentModalOpen} as={Fragment}>
        <Dialog as="div" open={isEditStudentModalOpen} onClose={() => setIsEditStudentModalOpen(false)}>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex items-center justify-center min-h-screen px-4">
              <Dialog.Panel className="panel max-w-lg p-5 text-black bg-white rounded-lg">
                <Formik
                  initialValues={
                    editStudent || {
                      fullName: "",
                      email: "",
                      phone: "",
                      dob: "",
                      course: "",
                    }
                  }
                  validationSchema={AddStudentFormSchema}
                  onSubmit={handleEditStudent}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-5">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                        <label htmlFor="fullName">Full Name</label>
                        <Field name="fullName" type="text" className="form-input" />
                        {touched.fullName && errors.fullName && (
                          <div className="text-danger">{errors.fullName}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email">Email</label>
                        <Field name="email" type="email" className="form-input" />
                        {touched.email && errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="phone">Phone</label>
                        <Field name="phone" type="text" className="form-input" />
                        {touched.phone && errors.phone && (
                          <div className="text-danger">{errors.phone}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="dob">Date of Birth</label>
                        <Field name="dob" type="date" className="form-input" />
                        {touched.dob && errors.dob && (
                          <div className="text-danger">{errors.dob}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="course">Course</label>
                        <Field name="course" as="select" className="form-input">
                          <option value="">Select a course</option>
                          <option value="Frontend">Frontend Development</option>
                          <option value="Backend">Backend Development</option>
                        </Field>
                        {touched.course && errors.course && (
                          <div className="text-danger">{errors.course}</div>
                        )}
                      </div>
                       </div>
                      
                      <button type="submit" className="btn btn-primary">
                        Update Student
                      </button>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Studentlist;