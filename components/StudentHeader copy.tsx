import { Student } from "@/types/student";

interface StudentHeaderProps {
  student: Student;
  image?: string;
  schoolName?: string;
}

const StudentHeader = ({ student, image, schoolName }: StudentHeaderProps) => {
  const hasImage = image && image.trim() !== "";

  const initials = `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`;

  return (
    <header className="text-center mb-10 relative pt-20 md:pt-24">
      {/* Background highlight */}
      <div className="absolute inset-x-0 top-0 h-32 bg-[#ffeaea] rounded-b-3xl shadow-sm -z-10"></div>

      {/* Avatar */}
      <div className="relative inline-block -mt-16">
        {hasImage ? (
          <img
            src={image}
            alt="Profile"
            className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="h-28 w-28 rounded-full flex items-center justify-center bg-[#d12f27] text-white text-2xl font-bold border-4 border-white shadow-lg">
            {initials || "?"}
          </div>
        )}
      </div>

      

      {/* Name */}
      <h1 className="mt-4 text-3xl font-bold text-[#d12f27]">
        {student.first_name?.toUpperCase()} {student.middle_name?.toUpperCase()} {student.last_name?.toUpperCase()}
      </h1>

      {/* School */}
      {schoolName && (
        <p className="text-gray-700 mt-1 text-lg font-semibold">
          {schoolName}
        </p>
      )}

      {/* Batch */}
      {student.batch && (
        <p className="text-gray-500 mt-1 text-sm font-medium">
          BATCH {student.year_start}
        </p>
      )}
    </header>
  );
};

export default StudentHeader;