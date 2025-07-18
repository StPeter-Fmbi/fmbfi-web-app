// components/SubmitForm.tsx
import { FormEvent, useState } from "react";

const SubmitForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please fill out both fields.");
      return;
    }

    const form = {
      name,
      email,
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const content = await response.json();
      console.log(content);
      alert("Success");

      setName("");
      setEmail("");
      setError(null); // Clear error after successful submit
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("There was an error submitting your form. Please try again.");
    }
  };

  return (
    <form className="py-4 space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md">{error}</div>
      )}

      <div className="flex items-center justify-center">
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          id="name"
          className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-64 sm:text-md border-gray-300 rounded-md"
          placeholder="Your Name"
        />
      </div>

      <div className="flex items-center justify-center">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          name="email"
          id="email1"
          className="shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-64 sm:text-md border-gray-300 rounded-md"
          placeholder="Your Email"
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="flex items-center justify-center text-sm w-64 rounded-md shadow py-3 px-2 text-white bg-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SubmitForm;
