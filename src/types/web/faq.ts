export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onClick: () => void;
}