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
    <header className="mb-6 mt-6 sm:mt-10 xl:mt-4">
      {/* Background */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl sm:rounded-3xl text-white shadow-lg">
        {/* Responsive padding */}
        <div className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-col md:flex-row items-center md:items-center gap-5 sm:gap-6 text-center md:text-left">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {hasImage ? (
                <img
                  src={image}
                  alt="Profile"
                  className="
                    h-24 w-24 sm:h-28 sm:w-28 md:h-28 md:w-28
                    rounded-full object-cover
                    border-4 border-white shadow-lg
                    mx-auto md:mx-0
                  "
                />
              ) : (
                <div
                  className="
                    h-24 w-24 sm:h-28 sm:w-28 md:h-28 md:w-28
                    rounded-full flex items-center justify-center
                    bg-white text-[#d12f27]
                    text-2xl sm:text-3xl font-bold
                    border-4 border-white shadow-lg
                    mx-auto md:mx-0
                  "
                >
                  {initials || "?"}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 w-full">
              <h2 className="text-base sm:text-lg font-semibold text-center md:text-left">
                Welcome back,
              </h2>

              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight text-center md:text-left break-words">
                {[student.first_name, student.middle_name, student.last_name]
                  .filter((name): name is string => !!name)
                  .map((name) => name.toUpperCase())
                  .join(" ")}
              </h1>

              {schoolName && (
                <p className="mt-2 text-red-100 text-sm sm:text-base md:text-lg text-center md:text-left">
                  {schoolName}
                </p>
              )}

              {student.batch && (
                <p className="mt-1 text-red-200 text-xs sm:text-sm text-center md:text-left">
                  Batch {student.year_start}
                </p>
              )}

              <div className="mt-4 border-t border-red-300 pt-4">
                <p className="text-red-100 text-xs sm:text-sm md:text-base text-center md:text-left">
                  Manage your scholarship details, view your grades, and stay
                  updated with announcements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
