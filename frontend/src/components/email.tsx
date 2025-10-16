import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

interface Recipient {
  name: string;
  email: string;
}

export const Contact: React.FC<{ recipients: Recipient[] }> = ({
  recipients,
}) => {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");

  const sendEmails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    const formData = new FormData(form.current);
    const message = formData.get("message") as string;
    const fromName = formData.get("from_name") as string;

    try {
      for (const recipient of recipients) {
        await emailjs.send(
          "service_sutva3o",
          "YOUR_TEMPLATE_ID",
          {
            to_name: recipient.name,
            to_email: recipient.email,
            from_name: fromName,
            message,
          },
          "oEVj0NbVaJSSe7-xJ"
        );
      }
      setStatus("Emails sent successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send emails.");
    }
  };

  return (
    <form ref={form} onSubmit={sendEmails}>
      <label htmlFor="from_name">Name</label>
      <input id="from_name" name="from_name" type="text" required />

      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required />

      <input type="submit" value="Send" />
      {status && <p>{status}</p>}
    </form>
  );
};
