import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const data = await apiFetch(`/api/students/${id}/`);
      setStudent(data);
    };
    fetchStudent();
  }, [id]);

  if (!student) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 border-b pb-6">
        {student.photo_path && (
          <img
            src={student.photo_path}
            alt="Student"
            className="h-32 w-32 rounded-full object-cover border"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold">
            {student.first_name} {student.last_name}
          </h1>
          <p className="text-muted-foreground">
            ID: {student.temporary_student_id}
          </p>
        </div>
      </div>

      {/* Personal Details */}
      <Section title="Personal Details">
        <Detail label="Gender" value={student.gender} />
        <Detail label="DOB" value={student.date_of_birth} />
        <Detail label="Aadhar" value={student.aadhar_number} />
      </Section>

      {/* Contact */}
      <Section title="Contact Details">
        <Detail label="Email" value={student.email} />
        <Detail label="Phone" value={student.phone_number} />
        <Detail label="Address" value={student.address} />
        <Detail label="City" value={student.city} />
        <Detail label="State" value={student.state} />
        <Detail label="Pincode" value={student.pincode} />
      </Section>

      {/* Guardian */}
      <Section title="Guardian Details">
        <Detail label="Name" value={student.guardian_name} />
        <Detail label="Relation" value={student.guardian_relation} />
        <Detail label="Phone" value={student.guardian_phone_number} />
      </Section>

      {/* Academic */}
      <Section title="Academic Details">
        <Detail label="Course" value={student.course_name} />
        <Detail label="Centre" value={student.centre_name} />
        <Detail
          label="Qualification"
          value={student.educational_qualification}
        />
      </Section>

      {/* Payment */}
      <Section title="Payment Proof">
        {student.payment_proof ? (
          <a
            href={student.payment_proof}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            View Payment Document
          </a>
        ) : (
          <p>No payment proof uploaded</p>
        )}
      </Section>
    </div>
  );
};

export default StudentProfile;

/* ---------- Helpers ---------- */

function Section({ title, children }: any) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
