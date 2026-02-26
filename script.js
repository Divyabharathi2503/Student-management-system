let students = JSON.parse(localStorage.getItem("students")) || [];
let currentPage = 1;
let rowsPerPage = 5;
let filteredData = students;

const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const marksInput = document.getElementById("marks");
const idInput = document.getElementById("studentId");

function calculateStatus(marks) {
return marks >= 50 ? "Pass" : "Fail";
}

function saveStudent() {
let name = nameInput.value.trim();
let roll = rollInput.value.trim();
let marks = marksInput.value.trim();
let id = idInput.value;

if (!name || !roll || !marks) {
alert("Fill all fields");
return;
}

let status = calculateStatus(Number(marks));

if (id === "") {
students.push({
id: Date.now(),
name,
roll,
marks,
status
});
} else {
students = students.map(s =>
s.id == id ? { id: Number(id), name, roll, marks, status } : s
);
}

localStorage.setItem("students", JSON.stringify(students));
filteredData = students;
clearForm();
displayStudents();
}

function displayStudents() {
let list = document.getElementById("studentList");
list.innerHTML = "";

let start = (currentPage - 1) * rowsPerPage;
let end = start + rowsPerPage;
let paginated = filteredData.slice(start, end);

paginated.forEach(s => {
list.innerHTML += `
<tr>
<td>${s.name}</td>
<td>${s.roll}</td>
<td>${s.marks}</td>
<td>${s.status}</td>
<td>
<button onclick="editStudent(${s.id})">Edit</button>
<button onclick="deleteStudent(${s.id})">Delete</button>
</td>
</tr>
`;
});

let totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
document.getElementById("pageInfo").innerText =
`Page ${currentPage} of ${totalPages}`;

updateDashboard();
}

function editStudent(id) {
let s = students.find(st => st.id == id);
idInput.value = s.id;
nameInput.value = s.name;
rollInput.value = s.roll;
marksInput.value = s.marks;
}

function deleteStudent(id) {
students = students.filter(s => s.id != id);
localStorage.setItem("students", JSON.stringify(students));
filteredData = students;
displayStudents();
}

function clearForm() {
idInput.value = "";
nameInput.value = "";
rollInput.value = "";
marksInput.value = "";
}

function searchStudent() {
let value = document.getElementById("search").value.toLowerCase();
filteredData = students.filter(s =>
s.name.toLowerCase().includes(value)
);
currentPage = 1;
displayStudents();
}

function toggleDarkMode() {
document.body.classList.toggle("dark");
localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

if (localStorage.getItem("darkMode") === "true") {
document.body.classList.add("dark");
}

function updateDashboard() {
let total = students.length;
let pass = students.filter(s => s.status === "Pass").length;
let fail = total - pass;

document.getElementById("total").innerText = total;
document.getElementById("passPercent").innerText =
total ? ((pass / total) * 100).toFixed(1) + "%" : "0%";
document.getElementById("failPercent").innerText =
total ? ((fail / total) * 100).toFixed(1) + "%" : "0%";
}

function nextPage() {
let totalPages = Math.ceil(filteredData.length / rowsPerPage);
if (currentPage < totalPages) {
currentPage++;
displayStudents();
}
}

function prevPage() {
if (currentPage > 1) {
currentPage--;
displayStudents();
}
}

displayStudents();