import React, { useState } from "react";

// Define the interface for form data
interface FormData {
  name: string;
  age: string | number; // Allows both string and number for form input handling
  email: string;
}

const FormToTable: React.FC = () => {
  // State for form inputs
  const [formData, setFormData] = useState<FormData>({ name: "", age: "", email: "" });

  // State for table rows
  const [tableData, setTableData] = useState<FormData[]>([]);

  // State for edit mode
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentRowIndex, setCurrentRowIndex] = useState<number | null>(null);

  // State for validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" ? (value === "" ? "" : Number(value)) : value, // Convert age to number or allow empty string
    });
  };

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (
      !formData.age || 
      (typeof formData.age === "number" && formData.age <= 0)
    ) {
      newErrors.age = "Valid age is required.";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && currentRowIndex !== null) {
      // Update existing row
      const updatedTable = [...tableData];
      updatedTable[currentRowIndex] = formData;
      setTableData(updatedTable);
      setIsEditing(false);
      setCurrentRowIndex(null);
    } else {
      // Add new row
      setTableData([...tableData, formData]);
    }

    // Reset form and errors
    setFormData({ name: "", age: "", email: "" });
    setErrors({});
  };

  // Handle editing
  const handleEdit = (index: number) => {
    setFormData(tableData[index]); // Populate form with row data
    setIsEditing(true);
    setCurrentRowIndex(index);
  };

  // Handle deletion
  const handleDelete = (index: number) => {
    const updatedTable = tableData.filter((_, i) => i !== index);
    setTableData(updatedTable);
  };

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
        </div>
        <div>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <span style={{ color: "red" }}>{errors.age}</span>}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>
        <button type="submit">{isEditing ? "Update Row" : "Add to Table"}</button>
      </form>

      {/* Table */}
      <table style={{ marginTop: "20px", width: "100%"}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.email}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormToTable;
