import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a hostel room?",
      answer:
        "Students can log in, navigate to the Rooms page, and request a room. Admins will then approve or allocate the room.",
    },
    {
      question: "Can I change my allocated room later?",
      answer:
        "Yes, but room change requests must be submitted to the hostel admin, who will review and approve based on availability.",
    },
    {
      question: "How are hostel fees paid?",
      answer:
        "Payments can be made online through the platform or directly at the hostel office. Receipts are generated automatically.",
    },
    {
      question: "Who can access the system?",
      answer:
        "The system is role-based: Students can request rooms and view status, while Admins and Wardens can manage allocations, records, and payments.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-blue-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-blue-600" />
                )}
              </button>

              {openIndex === index && (
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
