import { faqData } from "@/src/staticResource";
import FAQAccordion from "../../UI/web/Accordians/FAQAccordion";

const FAQList = ({
  openIndex,
  setOpenIndex,
}: {
  openIndex: number | null;
  setOpenIndex: (i: number | null) => void;
}) => (
  <div className="space-y-6">
    {faqData.map((item, index) => (
      <FAQAccordion
        key={index}
        item={item}
        isOpen={openIndex === index}
        onClick={() => setOpenIndex(openIndex === index ? null : index)}
      />
    ))}
  </div>
);

export default  FAQList